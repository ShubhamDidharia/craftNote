import React, { useState } from 'react';
import { aiService } from '../../services/aiService';

export const GenerateTitleModal = ({ isOpen, onClose, onTitleGenerated, noteContent }) => {
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError('Please describe what this note is about');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { title } = await aiService.generateTitle(context.trim(), noteContent || '');
      onTitleGenerated(title);
      setContext('');
      onClose();
    } catch (err) {
      console.error('[GenerateTitleModal]', err);
      setError(err.message || 'Failed to generate title');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content p-6 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="m-0 mb-2 text-lg font-bold text-text-primary">Generate Title with AI</h3>
        <p className="m-0 mb-4 text-sm text-text-secondary">
          Describe what your note is about. If you have already written content, it will be used as additional context.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          What is this note about? *
        </label>
        <textarea
          className="input w-full min-h-[100px] mb-3 resize-y"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., Meeting notes from product sync, key decisions and action items"
          disabled={loading}
        />

        {noteContent?.trim() && (
          <p className="text-xs text-gray-500 mb-4">
            Your current note content will be included as optional context.
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Title'}
          </button>
        </div>
      </div>
    </div>
  );
};
