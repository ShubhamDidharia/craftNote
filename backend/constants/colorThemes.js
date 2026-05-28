const DEFAULT_THEME_ID = 'classic';

const VALID_THEME_IDS = [
  'classic',
  'midnight',
  'ocean',
  'forest',
  'sunset',
  'lavender',
  'rose',
  'slate',
  'honey',
  'mint',
];

const normalizeThemeId = (themeId) => {
  if (themeId && VALID_THEME_IDS.includes(themeId)) {
    return themeId;
  }
  return DEFAULT_THEME_ID;
};

module.exports = {
  DEFAULT_THEME_ID,
  VALID_THEME_IDS,
  normalizeThemeId,
};
