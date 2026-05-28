import React, { useState } from 'react';
import { noteService } from '../services/noteService';
import '../styles/CreateNotePage.css';

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
    <div className="create-note-page">
      {/* Header */}
      <header className="note-page-header">
        <div className="workspace-context">
          <span className="workspace-label">Workspace:</span>
          <span className="workspace-name">{workspaceName}</span>
        </div>
        <div className="header-actions">
          <span className="word-count">{wordCount} words</span>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? '✓ Saving...' : '✓ Save Note'}
          </button>
          <button className="btn-close" onClick={onCancel} title="Close">
            ✕
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Document Area */}
      <div className="document-area">
        {/* Title Section */}
        <div className="title-section">
          <input
            type="text"
            className="note-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            autoFocus
          />
          <div className="ai-buttons-inline">
            <button className="ai-btn ai-title-gen" title="AI Title Generation (Coming Soon)" disabled>
              ✨ Generate Title
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <textarea
            className="note-content-input"
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your note here..."
          />
          
          {/* Floating AI Buttons */}
          <div className="floating-ai-toolbar">
            <button
              className="floating-ai-btn"
              title="AI Writing Help (Coming Soon)"
              disabled
            >
              💡 Writing Help
            </button>
            <button
              className="floating-ai-btn"
              title="AI Verification (Coming Soon)"
              disabled
            >
              ✓ Verify Content
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div className="tags-section">
          <button
            className="btn-add-tags"
            onClick={() => setShowTagInput(!showTagInput)}
          >
            + Add Tags
          </button>
          {showTagInput && (
            <div className="tags-input-area">
              <input
                type="text"
                className="tags-input"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags separated by commas (e.g., important, work, ideas)"
              />
              <p className="tags-hint">Press Enter or click outside to confirm</p>
            </div>
          )}
          {tags && (
            <div className="tags-display">
              {tags.split(',').map((tag, idx) => {
                const trimmedTag = tag.trim();
                return trimmedTag ? (
                  <span key={idx} className="tag-badge">
                    {trimmedTag}
                    <button
                      className="tag-remove"
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
      <footer className="note-page-footer">
        <div className="footer-info">
          <span className="auto-save-indicator">💾 Auto-save enabled</span>
        </div>
      </footer>
    </div>
  );
};
