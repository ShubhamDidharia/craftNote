import React, { useState } from 'react';
import { noteService } from '../services/noteService';

export const CreateNotePage = ({ workspaceId, workspaceName, onNoteSaved, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleContentChange = (e) => {
    const text = e.target.value;
    setContent(text);
    // Count words
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please add a title to your note');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await noteService.createNote({
        title: title.trim(),
        content,
        workspaceId,
        tags: tagsArray,
        color: '#fef3c7',
      });

      if (onNoteSaved) {
        onNoteSaved(response.note);
      }
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-bg-main to-gray-200 overflow-hidden">
      {/* Header */}
      <header className="bg-bg-surface border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Workspace:</span>
          <span className="text-sm text-accent font-semibold">{workspaceName}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-md">{wordCount} words</span>
          <button className="px-5 py-2.5 bg-gradient-to-r from-accent to-accent/80 text-white border-none rounded-md text-xs font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSave} disabled={saving}>
            {saving ? '✓ Saving...' : '✓ Save Note'}
          </button>
          <button className="w-8 h-8 rounded-md border-none bg-gray-100 text-gray-500 text-base cursor-pointer transition-all hover:bg-gray-200 hover:text-text-primary" onClick={onCancel} title="Close">
            ✕
          </button>
        </div>
      </header>

      {error && <div className="bg-red-100 text-red-600 px-6 py-3 border-b border-red-300 text-xs">{error}</div>}

      {/* Document Area */}
      <div className="flex-1 overflow-y-auto px-20 py-16 flex flex-col gap-8">
        {/* Title Section */}
        <div className="relative">
          <input
            type="text"
            className="w-full text-[42px] font-bold text-text-primary border-none bg-transparent outline-none resize-none font-sans mb-3 leading-[1.2]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-indigo-50 text-accent border border-indigo-200 rounded-md text-xs font-medium cursor-pointer transition-all hover:bg-indigo-100 hover:border-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed" title="AI Title Generation (Coming Soon)" disabled>
              ✨ Generate Title
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 relative">
          <textarea
            className="w-full h-full text-base leading-[1.8] text-gray-700 border-none bg-bg-surface outline-none resize-none p-6 rounded-lg font-sans shadow-sm"
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your note here..."
          />
          
          {/* Floating AI Buttons */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-bg-surface p-2 rounded-lg shadow-sm">
            <button
              className="px-3 py-2 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-all hover:bg-yellow-200 hover:border-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed"
              title="AI Writing Help (Coming Soon)"
              disabled
            >
              💡 Writing Help
            </button>
            <button
              className="px-3 py-2 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-md text-xs font-medium cursor-pointer whitespace-nowrap transition-all hover:bg-yellow-200 hover:border-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed"
              title="AI Verification (Coming Soon)"
              disabled
            >
              ✓ Verify Content
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-bg-surface p-4 rounded-lg shadow-sm">
          <button
            className="px-4 py-2 bg-gray-100 text-text-secondary border border-gray-200 rounded-md text-xs font-medium cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-700"
            onClick={() => setShowTagInput(!showTagInput)}
          >
            + Add Tags
          </button>
          {showTagInput && (
            <div className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md text-xs font-family-inherit"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags separated by commas (e.g., important, work, ideas)"
              />
              <p className="m-0 text-xs text-gray-400">Press Enter or click outside to confirm</p>
            </div>
          )}
          {tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.split(',').map((tag, idx) => {
                const trimmedTag = tag.trim();
                return trimmedTag ? (
                  <span key={idx} className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    {trimmedTag}
                    <button
                      className="bg-none border-none text-indigo-700 text-base cursor-pointer p-0 flex items-center transition-all hover:scale-120"
                      onClick={() => {
                        const newTags = tags
                          .split(',')
                          .filter((_, i) => i !== idx)
                          .join(',');
                        setTags(newTags);
                      }}
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bg-surface border-t border-gray-200 px-6 py-3 flex justify-between items-center text-xs text-gray-400">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">💾 Auto-save enabled</span>
        </div>
      </footer>
    </div>
  );
};
