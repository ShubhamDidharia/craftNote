export const DEFAULT_THEME_ID = 'classic';

export const COLOR_THEMES = [
  {
    id: 'classic',
    name: 'Classic',
    background: '#FFFFFF',
    text: '#212529',
    muted: '#495057',
    border: 'rgba(0,0,0,0.1)',
    tagBg: 'rgba(0,0,0,0.08)',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    background: '#1A1A2E',
    text: '#EAEAEA',
    muted: '#B8B8C8',
    border: 'rgba(255,255,255,0.12)',
    tagBg: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    background: '#E0F2FE',
    text: '#0C4A6E',
    muted: '#0369A1',
    border: 'rgba(12,74,110,0.15)',
    tagBg: 'rgba(12,74,110,0.12)',
  },
  {
    id: 'forest',
    name: 'Forest',
    background: '#ECFDF5',
    text: '#14532D',
    muted: '#166534',
    border: 'rgba(20,83,45,0.15)',
    tagBg: 'rgba(20,83,45,0.12)',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    background: '#FFF7ED',
    text: '#9A3412',
    muted: '#C2410C',
    border: 'rgba(154,52,18,0.15)',
    tagBg: 'rgba(154,52,18,0.12)',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    background: '#F5F3FF',
    text: '#5B21B6',
    muted: '#6D28D9',
    border: 'rgba(91,33,182,0.15)',
    tagBg: 'rgba(91,33,182,0.12)',
  },
  {
    id: 'rose',
    name: 'Rose',
    background: '#FFF1F2',
    text: '#9F1239',
    muted: '#BE123C',
    border: 'rgba(159,18,57,0.15)',
    tagBg: 'rgba(159,18,57,0.12)',
  },
  {
    id: 'slate',
    name: 'Slate',
    background: '#F1F5F9',
    text: '#334155',
    muted: '#475569',
    border: 'rgba(51,65,85,0.15)',
    tagBg: 'rgba(51,65,85,0.12)',
  },
  {
    id: 'honey',
    name: 'Honey',
    background: '#FEFCE8',
    text: '#854D0E',
    muted: '#A16207',
    border: 'rgba(133,77,14,0.15)',
    tagBg: 'rgba(133,77,14,0.12)',
  },
  {
    id: 'mint',
    name: 'Mint',
    background: '#F0FDFA',
    text: '#115E59',
    muted: '#0F766E',
    border: 'rgba(17,94,89,0.15)',
    tagBg: 'rgba(17,94,89,0.12)',
  },
];

const themeMap = Object.fromEntries(COLOR_THEMES.map((t) => [t.id, t]));

export const getThemeById = (themeId) =>
  themeMap[themeId] || themeMap[DEFAULT_THEME_ID];

export const resolveNoteThemeId = (note) =>
  note?.colorTheme || note?.color_theme || DEFAULT_THEME_ID;

export const resolveWorkspaceThemeId = (workspace) =>
  workspace?.colorTheme || workspace?.color_theme || DEFAULT_THEME_ID;

export const getNoteThemeStyle = (note) => {
  const theme = getThemeById(resolveNoteThemeId(note));
  return {
    backgroundColor: theme.background,
    color: theme.text,
    borderColor: theme.border,
    '--note-muted': theme.muted,
    '--note-tag-bg': theme.tagBg,
    '--note-border': theme.border,
  };
};

export const getThemeSwatchStyle = (themeId) => {
  const theme = getThemeById(themeId);
  return {
    backgroundColor: theme.background,
    color: theme.text,
    border: `1px solid ${theme.border}`,
  };
};
