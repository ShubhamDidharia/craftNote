import React, { useState } from 'react';
import { noteService } from '../services/noteService';

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
    <div className="max-w-[900px] mx-auto px-5 py-10">
      <div className="bg-bg-surface rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="m-0 text-2xl text-text-primary">Create New Note</h2>
          {onCancel && (
            <button className="bg-none border-none text-2xl cursor-pointer text-text-secondary p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all hover:bg-gray-100 hover:text-text-primary" onClick={onCancel}>
              ✕
            </button>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg border border-red-300 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700">Note Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={loading}
              className="px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-family-inherit transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="content" className="text-sm font-semibold text-gray-700">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your note content here..."
              rows="10"
              disabled={loading}
              className="px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-family-inherit transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tags" className="text-sm font-semibold text-gray-700">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., important, work, ideas"
                disabled={loading}
                className="px-3 py-3 border-2 border-gray-200 rounded-lg text-sm font-family-inherit transition-all focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="color" className="text-sm font-semibold text-gray-700">Note Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  disabled={loading}
                  className="w-12 h-10 rounded-md cursor-pointer p-0.5 border-2 border-gray-200"
                />
                <span className="text-sm text-gray-500 font-mono font-medium">{color}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-accent text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-accent/90 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating...' : '✓ Create Note'}
            </button>
            {onCancel && (
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-gray-100 text-text-secondary border-2 border-gray-200 rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
