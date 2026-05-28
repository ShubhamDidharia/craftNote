import React from 'react';
import { Pin, PinOff, Trash2, StickyNote } from 'lucide-react';
import { noteService } from '../services/noteService';
import { showToast } from '../utils/toast';
import { getNoteThemeStyle, getThemeById, resolveNoteThemeId } from '../constants/colorThemes';

export const NoteList = ({ notes, onNoteClick, onNoteDeleted, onNoteUpdated }) => {
  const handleDelete = async (e, noteId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await noteService.deleteNote(noteId);
      showToast.success('Note deleted');
      onNoteDeleted?.(noteId);
    } catch (err) {
      showToast.error(err.message || 'Failed to delete note');
    }
  };

  const handleTogglePin = async (e, note) => {
    e.stopPropagation();
    try {
      const response = await noteService.togglePinNote(note._id);
      showToast.success(response.note.isPinned ? 'Note pinned' : 'Note unpinned');
      onNoteUpdated?.(response.note);
    } catch (err) {
      showToast.error(err.message || 'Failed to update pin');
    }
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-20 bg-bg-surface rounded-xl border-2 border-dashed border-gray-200">
        <StickyNote size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
        <p className="m-0 mb-2 text-base text-text-secondary">No notes in this workspace yet</p>
        <p className="text-sm text-gray-400">Create your first note to get started</p>
      </div>
    );
  }

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  const renderGrid = (list) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      {list.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onClick={() => onNoteClick?.(note)}
          onDelete={(e) => handleDelete(e, note._id)}
          onTogglePin={(e) => handleTogglePin(e, note)}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {pinnedNotes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-base font-semibold text-gray-700 py-3 border-b-2 border-gray-200 flex items-center gap-2">
            <Pin size={16} />
            Pinned Notes
          </h3>
          {renderGrid(pinnedNotes)}
        </div>
      )}
      {unpinnedNotes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-base font-semibold text-gray-700 py-3 border-b-2 border-gray-200">
            All Notes
          </h3>
          {renderGrid(unpinnedNotes)}
        </div>
      )}
    </div>
  );
};

const NoteCard = ({ note, onClick, onDelete, onTogglePin }) => {
  const theme = getThemeById(resolveNoteThemeId(note));
  const themeStyle = getNoteThemeStyle(note);
  const contentPreview = (note.content || '').substring(0, 100).replace(/\n/g, ' ');
  const hasMore = (note.content || '').length > 100;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all border flex flex-col gap-3 cursor-pointer text-left"
      style={{
        ...themeStyle,
        borderColor: theme.border,
      }}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="m-0 text-base font-semibold leading-relaxed break-words flex-1" style={{ color: theme.text }}>
          {note.title}
        </h4>
        <button
          type="button"
          className="p-1.5 rounded-md flex-shrink-0 transition-all"
          style={{ backgroundColor: theme.tagBg }}
          onClick={onTogglePin}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? (
            <Pin size={16} style={{ color: theme.text }} />
          ) : (
            <PinOff size={16} style={{ color: theme.muted }} />
          )}
        </button>
      </div>

      {note.content && (
        <div className="text-sm leading-relaxed max-h-[60px] overflow-hidden" style={{ color: theme.muted }}>
          {contentPreview}
          {hasMore && '...'}
        </div>
      )}

      {note.tags?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: theme.tagBg, color: theme.text }}
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-medium"
              style={{ backgroundColor: theme.tagBg, color: theme.text }}
            >
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div
        className="flex justify-between items-center pt-2 border-t"
        style={{ borderColor: theme.border }}
      >
        <span className="text-xs" style={{ color: theme.muted }}>
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <button
          type="button"
          className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-all"
          onClick={onDelete}
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
