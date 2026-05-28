const geminiService = require('../services/geminiService');

const handleAiError = (res, error, action) => {
  console.error(`[AI Controller:${action}]`, {
    message: error.message,
    stack: error.stack,
  });

  if (error.message?.includes('GEMINI_API_KEY')) {
    return res.status(503).json({
      error:
        'AI service is not configured. Add GEMINI_API_KEY to backend/.env and restart the server.',
    });
  }

  if (error.message?.includes('JSON')) {
    return res.status(502).json({ error: 'AI returned an invalid response. Please try again.' });
  }

  return res.status(500).json({
    error: error.message || 'AI request failed',
  });
};

exports.generateTitle = async (req, res) => {
  try {
    const { context, content } = req.body;

    if (!context || !String(context).trim()) {
      return res.status(400).json({ error: 'Context is required to generate a title' });
    }

    const result = await geminiService.generateTitle({
      context: String(context).trim(),
      content: content ? String(content) : '',
    });

    return res.json(result);
  } catch (error) {
    return handleAiError(res, error, 'generateTitle');
  }
};

exports.writingHelp = async (req, res) => {
  try {
    const { content, style } = req.body;

    if (!content || !String(content).trim()) {
      return res.status(400).json({ error: 'Note content is required for writing help' });
    }

    const validStyles = ['professional', 'academic', 'simple'];
    const selectedStyle = validStyles.includes(style) ? style : 'simple';

    const result = await geminiService.writingHelp({
      content: String(content).trim(),
      style: selectedStyle,
    });

    return res.json(result);
  } catch (error) {
    return handleAiError(res, error, 'writingHelp');
  }
};

exports.verifyContent = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !String(content).trim()) {
      return res.status(400).json({ error: 'Note content is required for verification' });
    }

    const result = await geminiService.verifyContent({
      content: String(content).trim(),
    });

    return res.json(result);
  } catch (error) {
    return handleAiError(res, error, 'verifyContent');
  }
};
