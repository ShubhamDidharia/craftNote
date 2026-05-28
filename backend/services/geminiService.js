const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_NAME = 'gemini-2.5-flash';
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

const STYLE_DESCRIPTIONS = {
  professional: 'clear, polished professional tone',
  academic: 'formal academic tone suitable for scholarly notes',
  simple: 'simple, easy-to-understand language that anyone can follow',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const { getGeminiApiKey } = require('../config/env');

const getApiKey = () => {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return key;
};

const isRetryableError = (error) => {
  const status = error?.status ?? error?.statusCode ?? error?.response?.status;
  if ([429, 500, 502, 503, 504].includes(status)) return true;

  const message = (error?.message || String(error)).toLowerCase();
  return (
    message.includes('rate') ||
    message.includes('quota') ||
    message.includes('overloaded') ||
    message.includes('unavailable') ||
    message.includes('resource exhausted') ||
    message.includes('too many requests')
  );
};

const withExponentialBackoff = async (operation, context) => {
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const retryable = isRetryableError(error);
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (!retryable || isLastAttempt) {
        console.error(`[Gemini:${context}] Request failed`, {
          attempt: attempt + 1,
          maxRetries: MAX_RETRIES,
          message: error?.message,
          status: error?.status ?? error?.statusCode,
          stack: error?.stack,
        });
        throw error;
      }

      const delay = BASE_DELAY_MS * 2 ** attempt + Math.random() * 500;
      console.warn(`[Gemini:${context}] Retryable error on attempt ${attempt + 1}/${MAX_RETRIES}`, {
        message: error?.message,
        status: error?.status ?? error?.statusCode,
        retryInMs: Math.round(delay),
      });
      await sleep(delay);
    }
  }

  throw lastError;
};

const parseJsonResponse = (text) => {
  let cleaned = (text || '').trim();
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    cleaned = fenced[1].trim();
  }
  return JSON.parse(cleaned);
};

const generateContent = async (prompt, context) => {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  });

  return withExponentialBackoff(async () => {
    console.log(`[Gemini:${context}] Sending request`, { model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text();

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    console.log(`[Gemini:${context}] Response received`, {
      length: text.length,
    });

    return text;
  }, context);
};

const generateTitle = async ({ context, content }) => {
  const prompt = `You generate concise, descriptive note titles.

Given the user's context about what the note is about, and optionally the note body, produce ONE fitting title.

Rules:
- Maximum 80 characters
- No quotation marks around the title
- Capture the main topic clearly

Return ONLY valid JSON in this shape:
{"title": "Your Title Here"}

User context (required):
${context.trim()}

${content?.trim() ? `Note content (optional):\n${content.trim()}` : 'Note content: (not provided)'}`;

  const raw = await generateContent(prompt, 'generateTitle');
  const parsed = parseJsonResponse(raw);

  if (!parsed?.title || typeof parsed.title !== 'string') {
    console.error('[Gemini:generateTitle] Invalid JSON shape', { parsed });
    throw new Error('AI returned an invalid title format');
  }

  return { title: parsed.title.trim().slice(0, 80) };
};

const writingHelp = async ({ content, style }) => {
  const styleKey = STYLE_DESCRIPTIONS[style] ? style : 'simple';
  const styleDescription = STYLE_DESCRIPTIONS[styleKey];

  const prompt = `You help users improve how their note is written WITHOUT changing their meaning or forcing new ideas.

Reframe the user's note in a ${styleDescription}.

Rules:
- Preserve all facts, intent, and structure the user intended
- Do not add new claims, sections, or opinions
- Do not remove important information
- Only improve clarity, flow, grammar, and tone
- Return the full reframed note body

Return ONLY valid JSON:
{
  "reframedContent": "full improved note text",
  "summary": "1-2 sentences explaining what you changed stylistically"
}

Style requested: ${styleKey}

User note:
${content.trim()}`;

  const raw = await generateContent(prompt, 'writingHelp');
  const parsed = parseJsonResponse(raw);

  if (!parsed?.reframedContent || typeof parsed.reframedContent !== 'string') {
    console.error('[Gemini:writingHelp] Invalid JSON shape', { parsed });
    throw new Error('AI returned an invalid writing help format');
  }

  return {
    reframedContent: parsed.reframedContent.trim(),
    summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
    style: styleKey,
  };
};

const verifyContent = async ({ content }) => {
  const prompt = `You review user-written notes for factual, conceptual, and clarity issues.

Check for:
- Incorrect concepts or misconceptions
- Outdated information
- Wrong or dubious facts
- Internal contradictions
- Misleading or ambiguous statements

Rules:
- Only flag real issues you are reasonably confident about
- Quote the exact problematic line from the note
- Provide a concrete suggested fix for each issue
- If the note looks fine, return an empty suggestions array
- Do not nitpick minor style preferences

Return ONLY valid JSON:
{
  "suggestions": [
    {
      "lineNumber": 1,
      "problematicLine": "exact line from the note",
      "issue": "what is wrong and why",
      "suggestedFix": "corrected line or specific fix"
    }
  ]
}

User note (line numbers correspond to newline-separated lines):
${content.trim()}`;

  const raw = await generateContent(prompt, 'verifyContent');
  const parsed = parseJsonResponse(raw);

  if (!parsed || !Array.isArray(parsed.suggestions)) {
    console.error('[Gemini:verifyContent] Invalid JSON shape', { parsed });
    throw new Error('AI returned an invalid verification format');
  }

  const suggestions = parsed.suggestions
    .filter((s) => s?.problematicLine && s?.issue && s?.suggestedFix)
    .map((s, index) => ({
      lineNumber: Number.isFinite(s.lineNumber) ? s.lineNumber : index + 1,
      problematicLine: String(s.problematicLine).trim(),
      issue: String(s.issue).trim(),
      suggestedFix: String(s.suggestedFix).trim(),
    }));

  return { suggestions };
};

module.exports = {
  generateTitle,
  writingHelp,
  verifyContent,
  MODEL_NAME,
};
