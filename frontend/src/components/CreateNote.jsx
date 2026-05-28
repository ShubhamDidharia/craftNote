import React, { useState } from 'react';
import { noteService } from '../services/noteService';
import '../styles/CreateNote.css';

export const CreateNote = ({ workspaceId, onNoteCreated, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState('#fef3c7');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!title.trim()) {
        setError('Note title is required');
        setLoading(false);
        return;
      }

      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await noteService.createNote({
        title: title.trim(),
        content,
        workspaceId,
        tags: tagsArray,
        color,
      });

      // Reset form
      setTitle('');
      setContent('');
      setTags('');
      setColor('#fef3c7');

      if (onNoteCreated) {
        onNoteCreated(response.note);
      }
    } catch (err) {
      setError(err.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-note-container">
      <div className="create-note-card">
        <div className="create-note-header">
          <h2>Create New Note</h2>
          {onCancel && (
            <button className="close-btn" onClick={onCancel}>
              ✕
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Note Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your note content here..."
              rows="10"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., important, work, ideas"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Note Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={loading}
                />
                <span className="color-code">{color}</span>
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : '✓ Create Note'}
            </button>
            {onCancel && (
              <button
                type="button"
                className="cancel-btn"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
