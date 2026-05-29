import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { aiService } from '../../services/aiService';

export const VerifyContentPanel = ({ isOpen, onClose, content, onApplyFix }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState(null);

  if (!isOpen) return null;

  const runVerification = async () => {
    if (!content?.trim()) {
      setError('Write some content first to verify');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions(null);

    try {
      const result = await aiService.verifyContent(content);
      setSuggestions(result.suggestions || []);
    } catch (err) {
      console.error('[VerifyContentPanel]', err);
      setError(err.message || 'Failed to verify content');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuggestions(null);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content p-6 max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-3">
          <Sparkles size={13} />
          AI Content Check
        </div>
        <h3 className="m-0 mb-2 text-lg font-bold text-text-primary">Check your note for possible issues</h3>
        <p className="m-0 mb-4 text-sm text-text-secondary">
          Check your note for incorrect concepts, outdated information, or factual issues.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        {suggestions === null && (
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn-ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              onClick={runVerification}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Run Verification'}
            </button>
          </div>
        )}

        {suggestions !== null && (
          <div className="border-t border-gray-200 pt-4">
            {suggestions.length === 0 ? (
              <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm border border-green-200 mb-4">
                No significant issues found. Your content looks reasonable, but always double-check critical facts.
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-4">
                {suggestions.map((item, index) => (
                  <div
                    key={`${item.lineNumber}-${index}`}
                    className="border border-amber-200 bg-amber-50 rounded-lg p-4 text-sm"
                  >
                    <span className="inline-block text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mb-2">
                      Line {item.lineNumber}
                    </span>
                    <blockquote className="m-0 mb-2 pl-3 border-l-2 border-amber-400 text-gray-800 italic">
                      &ldquo;{item.problematicLine}&rdquo;
                    </blockquote>
                    <p className="m-0 mb-2">
                      <strong className="text-amber-900">Issue:</strong> {item.issue}
                    </p>
                    <p className="m-0 mb-3">
                      <strong className="text-green-800">Suggested fix:</strong> {item.suggestedFix}
                    </p>
                    {onApplyFix && (
                      <button
                        type="button"
                        className="text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-md hover:bg-amber-100 transition-all"
                        onClick={() => onApplyFix(item)}
                      >
                        Apply this fix
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <button type="button" className="btn-primary" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
