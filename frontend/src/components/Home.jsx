import React, { useState, useEffect } from 'react';
import { StickyNote } from 'lucide-react';
import { noteService } from '../services/noteService';
import { workspaceService } from '../services/workspaceService';
import { NoteList } from './NoteList';
import { NoteDetailModal } from './NoteDetailModal';
import { showToast } from '../utils/toast';

export const Home = ({ user, onEditNote }) => {
  const [allNotes, setAllNotes] = useState([]);
  const [workspaceMap, setWorkspaceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [notesData, workspacesData] = await Promise.all([
        noteService.getNotes(),
        workspaceService.getWorkspaces(),
      ]);

      const map = {};
      (workspacesData.workspaces || []).forEach((ws) => {
        map[ws._id] = ws;
      });
      setWorkspaceMap(map);

      const sortedNotes = (notesData.notes || []).sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt);
        const timeB = new Date(b.updatedAt || b.createdAt);
        return timeB - timeA;
      });
      setAllNotes(sortedNotes);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const getWorkspaceName = (note) => {
    const id = note.workspaceId?._id || note.workspaceId;
    return workspaceMap[id]?.name || 'Workspace';
  };

  const handleNoteDeleted = (noteId) => {
    setAllNotes(allNotes.filter((n) => n._id !== noteId));
    setSelectedNote(null);
  };

  const handleNoteUpdated = (updatedNote) => {
    setAllNotes(allNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
    if (selectedNote?._id === updatedNote._id) {
      setSelectedNote(updatedNote);
    }
  };

  const handleEditFromModal = (note) => {
    setSelectedNote(null);
    onEditNote?.(note, getWorkspaceName(note));
  };

  const handleDeleteFromModal = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await noteService.deleteNote(noteId);
      showToast.success('Note deleted');
      handleNoteDeleted(noteId);
    } catch (err) {
      showToast.error(err.message || 'Failed to delete note');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <div className="mb-10 text-center">
        <h2 className="m-0 mb-2 text-3xl font-bold text-text-primary">
          Welcome back, {user.firstName}!
        </h2>
        <p className="m-0 text-base text-text-secondary">Your latest notes from all workspaces</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg border border-red-300 text-sm mb-5">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-base text-text-secondary">Loading your notes...</div>
      ) : allNotes.length > 0 ? (
        <div className="flex flex-col gap-5">
          <h3 className="m-0 text-lg font-semibold text-text-primary py-3 border-b-2 border-gray-200 flex items-center gap-2">
            <StickyNote size={20} className="text-accent" />
            All Your Notes
          </h3>
          <NoteList
            notes={allNotes}
            workspaceMap={workspaceMap}
            onNoteClick={setSelectedNote}
            onNoteDeleted={handleNoteDeleted}
            onNoteUpdated={handleNoteUpdated}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-surface rounded-xl border-2 border-dashed border-gray-200">
          <StickyNote size={56} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
          <p className="m-0 mb-2 text-base text-text-secondary">No notes yet</p>
          <p className="text-sm text-gray-400">Go to Workspaces to create your first note!</p>
        </div>
      )}

      <NoteDetailModal
        note={selectedNote}
        workspace={selectedNote ? workspaceMap[selectedNote.workspaceId?._id || selectedNote.workspaceId] : null}
        workspaceName={selectedNote ? getWorkspaceName(selectedNote) : ''}
        isOpen={Boolean(selectedNote)}
        onClose={() => setSelectedNote(null)}
        onEdit={handleEditFromModal}
        onDelete={handleDeleteFromModal}
        onTogglePin={async (note) => {
          try {
            const response = await noteService.togglePinNote(note._id);
            showToast.success(response.note.isPinned ? 'Note pinned' : 'Note unpinned');
            handleNoteUpdated(response.note);
          } catch (err) {
            showToast.error(err.message || 'Failed to update pin');
          }
        }}
      />
    </div>
  );
};
