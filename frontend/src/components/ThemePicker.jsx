import React from 'react';
import { COLOR_THEMES } from '../constants/colorThemes';

export const ThemePicker = ({ value, onChange, disabled = false }) => (
  <div>
    <p className="m-0 mb-2 text-xs font-semibold text-gray-600">Color theme</p>
    <div className="grid grid-cols-3 gap-2">
      {COLOR_THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(theme.id)}
          className={`flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all ${
            value === theme.id
              ? 'border-accent ring-2 ring-accent/20'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span
            className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: theme.background,
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
          >
            Aa
          </span>
          <span className="text-xs font-medium text-text-primary truncate">{theme.name}</span>
        </button>
      ))}
    </div>
  </div>
);
