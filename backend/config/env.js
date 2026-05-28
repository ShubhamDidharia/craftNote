const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const backendDir = path.resolve(__dirname, '..');
const projectRoot = path.resolve(backendDir, '..');

const envCandidates = [
  path.join(projectRoot, '.env'),
  path.join(backendDir, '.env'),
];

// Load root first, then backend/.env so local backend overrides win
for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath, override: true });
    if (result.error) {
      console.error(`[env] Failed to load ${envPath}:`, result.error.message);
    } else {
      console.log(`[env] Loaded ${envPath}`);
    }
  }
}

const getMongoUri = () =>
  process.env.MONGO_URI || process.env.MONGODB_URI || '';

const getGeminiApiKey = () =>
  (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

const requiredVars = [
  { key: 'JWT_SECRET', getValue: () => process.env.JWT_SECRET },
  { key: 'MONGO_URI', getValue: getMongoUri, label: 'MONGODB_URI or MONGO_URI' },
];

const missing = requiredVars.filter(({ getValue }) => !getValue());

if (missing.length > 0) {
  const labels = missing.map((v) => v.label || v.key).join(', ');
  console.error(
    `[env] Missing required environment variables: ${labels}\n` +
      `       Add them to backend/.env or the project root .env file.`
  );
  process.exit(1);
}

const geminiApiKey = getGeminiApiKey();

if (!geminiApiKey) {
  console.warn(
    '[env] GEMINI_API_KEY is not set — AI features will be disabled.\n' +
      '       Add GEMINI_API_KEY to backend/.env (get a key at https://aistudio.google.com/apikey)'
  );
} else {
  console.log('[env] Gemini AI: configured');
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: getMongoUri(),
  port: Number(process.env.PORT) || 5000,
  getGeminiApiKey,
  get geminiApiKey() {
    return getGeminiApiKey();
  },
};
