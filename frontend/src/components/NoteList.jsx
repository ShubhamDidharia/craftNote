import React from 'react';
import { noteService } from '../services/noteService';
import '../styles/NoteList.css';

export const NoteList = ({ notes, workspaceId, onNoteDeleted, onNoteUpdated }) => {
  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(noteId);
        if (onNoteDeleted) {
          onNoteDeleted(noteId);
        }
      } catch (err) {
        alert(err.message || 'Failed to delete note');
      }
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const response = await noteService.togglePinNote(note._id);
      if (onNoteUpdated) {
        onNoteUpdated(response.note);
      }
    } catch (err) {
      alert(err.message || 'Failed to pin note');
    }
  };

  if (notes.length === 0) {
    return (
      <div className="empty-notes-state">
        <div className="empty-icon">📝</div>
        <p>No notes in this workspace yet</p>
        <p className="empty-hint">Create your first note to get started</p>
      </div>
    );
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="notes-list-container">
      {pinnedNotes.length > 0 && (
        <div className="notes-section">
          <h3 className="notes-section-title">📌 Pinned Notes</h3>
          <div className="notes-grid">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}

      {unpinnedNotes.length > 0 && (
        <div className="notes-section">
          <h3 className="notes-section-title">All Notes</h3>
          <div className="notes-grid">
            {unpinnedNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NoteCard = ({ note, onDelete, onTogglePin }) => {
  const contentPreview = note.content
    .substring(0, 100)
    .replace(/\n/g, ' ');
  const hasMore = note.content.length > 100;

  return (
    <div className="note-card" style={{ backgroundColor: note.color }}>
      <div className="note-header">
        <h4 className="note-title">{note.title}</h4>
        <button
          className="pin-btn"
          onClick={() => onTogglePin(note)}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? '📌' : '📍'}
        </button>
      </div>

      {note.content && (
        <div className="note-content">
          {contentPreview}
          {hasMore && '...'}
        </div>
      )}

      {note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="tag">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="note-footer">
        <span className="note-date">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <button
          className="delete-btn"
          onClick={() => onDelete(note._id)}
          title="Delete note"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
