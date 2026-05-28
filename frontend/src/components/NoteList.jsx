import React from 'react';
import { noteService } from '../services/noteService';

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
      <div className="text-center py-20 bg-bg-surface rounded-xl border-2 border-dashed border-gray-200">
        <div className="text-6xl mb-4">📝</div>
        <p className="m-0 mb-2 text-base text-text-secondary">No notes in this workspace yet</p>
        <p className="text-sm text-gray-400">Create your first note to get started</p>
      </div>
    );
  }

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className="flex flex-col gap-8">
      {pinnedNotes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-base font-semibold text-gray-700 py-3 border-b-2 border-gray-200">📌 Pinned Notes</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
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
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-base font-semibold text-gray-700 py-3 border-b-2 border-gray-200">All Notes</h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
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
    <div className="bg-yellow-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border-2 border-transparent hover:border-black/10 flex flex-col gap-3" style={{ backgroundColor: note.color }}>
      <div className="flex justify-between items-start gap-2">
        <h4 className="m-0 text-base font-semibold text-gray-800 leading-relaxed word-break break-word flex-1">{note.title}</h4>
        <button
          className="bg-none border-none text-lg cursor-pointer p-1 flex-shrink-0 transition-all hover:scale-120"
          onClick={() => onTogglePin(note)}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? '📌' : '📍'}
        </button>
      </div>

      {note.content && (
        <div className="text-sm text-gray-600 leading-relaxed min-h-[30px] max-h-[60px] overflow-hidden">
          {contentPreview}
          {hasMore && '...'}
        </div>
      )}

      {note.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap min-h-0">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="inline-block bg-black/10 text-gray-700 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="inline-block bg-black/10 text-gray-700 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t border-black/10">
        <span className="text-xs text-gray-500">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <button
          className="bg-none border-none text-base cursor-pointer p-1 transition-all hover:scale-120 hover:brightness-75"
          onClick={() => onDelete(note._id)}
          title="Delete note"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
