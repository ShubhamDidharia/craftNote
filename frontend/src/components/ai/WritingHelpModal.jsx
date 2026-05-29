import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { aiService } from '../../services/aiService';

const STYLES = [
  { id: 'professional', label: 'Professional', description: 'Clear and polished for work notes' },
  { id: 'academic', label: 'Academic', description: 'Formal tone for study and research' },
  { id: 'simple', label: 'Simple', description: 'Easy to read and understand' },
];

export const WritingHelpModal = ({ isOpen, onClose, content, onAccept }) => {
  const [style, setStyle] = useState('simple');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!content?.trim()) {
      setError('Write some content first so AI can help reframe it');
      return;
    }

    setLoading(true);
    setError('');
    setPreview(null);

    try {
      const result = await aiService.writingHelp(content, style);
      setPreview(result);
    } catch (err) {
      console.error('[WritingHelpModal]', err);
      setError(err.message || 'Failed to get writing help');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (preview?.reframedContent) {
      onAccept(preview.reframedContent);
      setPreview(null);
      onClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content p-6 max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800 mb-3">
          <Sparkles size={13} />
          AI Writing Assistant
        </div>
        <h3 className="m-0 mb-2 text-lg font-bold text-text-primary">Refine your note without losing your voice</h3>
        <p className="m-0 mb-4 text-sm text-text-secondary">
          Reframe your note in your preferred style. Your ideas stay yours — only clarity and tone are improved.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-700 mb-2">Choose a style</p>
        <div className="grid gap-2 mb-4">
          {STYLES.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                style === option.id
                  ? 'border-accent bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="writing-style"
                value={option.id}
                checked={style === option.id}
                onChange={() => setStyle(option.id)}
                className="mt-1"
                disabled={loading}
              />
              <div>
                <span className="font-medium text-text-primary">{option.label}</span>
                <p className="m-0 text-xs text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {!preview && (
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn-ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Reframing...' : 'Get Suggestions'}
            </button>
          </div>
        )}

        {preview && (
          <div className="border-t border-gray-200 pt-4 mt-2">
            {preview.summary && (
              <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                <strong>What changed:</strong> {preview.summary}
              </p>
            )}
            <p className="text-sm font-semibold text-gray-700 mb-2">Preview</p>
            <div className="bg-bg-main border border-gray-200 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto mb-4">
              {preview.reframedContent}
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" className="btn-ghost" onClick={() => setPreview(null)}>
                Try Another Style
              </button>
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Keep Original
              </button>
              <button type="button" className="btn-primary" onClick={handleAccept}>
                Use This Version
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
