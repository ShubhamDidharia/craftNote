import React from 'react';
import {
  X,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  Calendar,
  Tag,
} from 'lucide-react';
import {
  getNoteThemeStyle,
  getThemeById,
  resolveNoteThemeId,
} from '../constants/colorThemes';

export const NoteDetailModal = ({
  note,
  workspaceName,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  if (!isOpen || !note) return null;

  const theme = getThemeById(resolveNoteThemeId(note));
  const themeStyle = getNoteThemeStyle(note);

  return (
    <div className="modal-overlay z-[200]" onClick={onClose}>
      <div
        className="rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col mx-4 overflow-hidden border"
        onClick={(e) => e.stopPropagation()}
        style={{ ...themeStyle, borderColor: theme.border }}
      >
        <div
          className="flex items-start justify-between gap-4 p-6 border-b"
          style={{ borderColor: theme.border }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="m-0 text-2xl font-bold break-words" style={{ color: theme.text }}>
              {note.title}
            </h2>
            {workspaceName && (
              <p className="m-0 mt-1 text-sm" style={{ color: theme.muted }}>
                {workspaceName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg flex-shrink-0 transition-all"
            style={{ color: theme.muted }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {note.content ? (
            <div
              className="text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: theme.text }}
            >
              {note.content}
            </div>
          ) : (
            <p className="italic m-0" style={{ color: theme.muted }}>
              No content in this note.
            </p>
          )}

          {note.tags?.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mt-6 pt-6 border-t"
              style={{ borderColor: theme.border }}
            >
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: theme.tagBg, color: theme.text }}
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-4 p-6 border-t"
          style={{ borderColor: theme.border, backgroundColor: theme.tagBg }}
        >
          <div className="flex items-center gap-2 text-xs" style={{ color: theme.muted }}>
            <Calendar size={14} />
            <span>{new Date(note.updatedAt || note.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all"
              style={{ borderColor: theme.border, color: theme.text }}
              onClick={() => onTogglePin?.(note)}
            >
              {note.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
              {note.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent/90 transition-all"
              onClick={() => onEdit?.(note)}
            >
              <Pencil size={16} />
              Edit Note
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all"
              onClick={() => onDelete?.(note._id)}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
