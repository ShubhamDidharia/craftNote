import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, FilePlus, LayoutGrid } from 'lucide-react';
import { workspaceService } from '../services/workspaceService';
import { noteService } from '../services/noteService';
import { NoteList } from './NoteList';
import { NoteDetailModal } from './NoteDetailModal';
import { WorkspaceFormModal } from './WorkspaceFormModal';
import { showToast } from '../utils/toast';
import {
  DEFAULT_THEME_ID,
  getThemeById,
  getThemeSwatchStyle,
  resolveWorkspaceThemeId,
} from '../constants/colorThemes';

export const Workspace = ({ onCreateNote, onEditNote }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchNotes(selectedWorkspace._id);
    }
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await workspaceService.getWorkspaces();
      const list = data.workspaces || [];
      setWorkspaces(list);
      if (list.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(list[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (workspaceId) => {
    try {
      setNotesLoading(true);
      const data = await noteService.getNotes(workspaceId);
      setNotes(data.notes || []);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const handleCreateWorkspace = async (formData) => {
    setSubmitting(true);
    try {
      if (!formData.name.trim()) {
        showToast.error('Workspace name is required');
        return;
      }
      const response = await workspaceService.createWorkspace({
        name: formData.name.trim(),
        description: formData.description,
        colorTheme: formData.colorTheme || DEFAULT_THEME_ID,
      });
      setWorkspaces((prev) => [...prev, response.workspace]);
      setSelectedWorkspace(response.workspace);
      setShowCreateModal(false);
      showToast.success('Workspace created');
    } catch (err) {
      showToast.error(err.message || 'Failed to create workspace');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditWorkspace = async (formData) => {
    if (!editingWorkspace) return;
    setSubmitting(true);
    try {
      const response = await workspaceService.updateWorkspace(editingWorkspace._id, {
        name: formData.name.trim(),
        description: formData.description,
        colorTheme: formData.colorTheme,
      });
      const updated = response.workspace;
      setWorkspaces((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
      if (selectedWorkspace?._id === updated._id) {
        setSelectedWorkspace(updated);
      }
      setEditingWorkspace(null);
      showToast.success('Workspace updated');
    } catch (err) {
      showToast.error(err.message || 'Failed to update workspace');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Delete this workspace and all its notes?')) return;

    try {
      await workspaceService.deleteWorkspace(id);
      const updated = workspaces.filter((w) => w._id !== id);
      setWorkspaces(updated);
      showToast.success('Workspace deleted');

      if (selectedWorkspace?._id === id) {
        setSelectedWorkspace(updated[0] || null);
        setNotes([]);
      }
    } catch (err) {
      showToast.error(err.message || 'Failed to delete workspace');
    }
  };

  const handleNoteDeleted = (noteId) => {
    setNotes((prev) => prev.filter((n) => n._id !== noteId));
    setSelectedNote(null);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes((prev) => prev.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
    if (selectedNote?._id === updatedNote._id) {
      setSelectedNote(updatedNote);
    }
  };

  const selectedTheme = selectedWorkspace
    ? getThemeById(resolveWorkspaceThemeId(selectedWorkspace))
    : null;

  if (loading) {
    return (
      <div className="text-center py-10 text-base text-text-secondary">Loading workspaces...</div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-5 min-h-[calc(100vh-64px)]">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 h-full">
        <aside className="bg-bg-surface rounded-xl shadow-sm p-4 overflow-y-auto flex flex-col max-h-[calc(100vh-100px)]">
          <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-200">
            <h3 className="m-0 text-base font-semibold text-text-primary flex items-center gap-2">
              <LayoutGrid size={18} />
              Workspaces
            </h3>
            <button
              type="button"
              className="w-8 h-8 rounded-md bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-all"
              onClick={() => setShowCreateModal(true)}
              title="Create workspace"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {workspaces.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">No workspaces</p>
            ) : (
              workspaces.map((workspace) => {
                const themeId = resolveWorkspaceThemeId(workspace);
                return (
                  <div
                    key={workspace._id}
                    className={`group p-3 rounded-md cursor-pointer transition-all flex items-center gap-2 ${
                      selectedWorkspace?._id === workspace._id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-bg-main border-2 border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => setSelectedWorkspace(workspace)}
                  >
                    <span
                      className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={getThemeSwatchStyle(themeId)}
                    >
                      Aa
                    </span>
                    <span className="text-sm font-semibold flex-1 truncate">{workspace.name}</span>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingWorkspace(workspace);
                        }}
                        title="Edit workspace"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        onClick={(e) => handleDeleteWorkspace(workspace._id, e)}
                        title="Delete workspace"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <main className="bg-bg-surface rounded-xl shadow-sm p-6 overflow-y-auto flex flex-col gap-5 min-h-[calc(100vh-100px)]">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg border border-red-300 text-sm">
              {error}
            </div>
          )}

          {selectedWorkspace ? (
            <>
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b-2 border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: selectedTheme?.background,
                        color: selectedTheme?.text,
                        border: `1px solid ${selectedTheme?.border}`,
                      }}
                    >
                      {selectedTheme?.name} theme
                    </span>
                  </div>
                  <h2 className="m-0 text-2xl text-text-primary">{selectedWorkspace.name}</h2>
                  {selectedWorkspace.description && (
                    <p className="m-0 mt-2 text-sm text-text-secondary">
                      {selectedWorkspace.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                    onClick={() => setEditingWorkspace(selectedWorkspace)}
                  >
                    <Pencil size={16} />
                    Edit Workspace
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent/90 transition-all"
                    onClick={() =>
                      onCreateNote(
                        selectedWorkspace._id,
                        selectedWorkspace.name,
                        resolveWorkspaceThemeId(selectedWorkspace)
                      )
                    }
                  >
                    <FilePlus size={18} />
                    Create New Note
                  </button>
                </div>
              </div>

              {notesLoading ? (
                <div className="text-center py-10 text-text-secondary">Loading notes...</div>
              ) : (
                <NoteList
                  notes={notes}
                  workspace={selectedWorkspace}
                  onNoteClick={setSelectedNote}
                  onNoteDeleted={handleNoteDeleted}
                  onNoteUpdated={handleNoteUpdated}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16 text-text-secondary">
              <LayoutGrid size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="m-0">Create or select a workspace to get started</p>
            </div>
          )}
        </main>
      </div>

      <WorkspaceFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWorkspace}
        mode="create"
        loading={submitting}
      />

      <WorkspaceFormModal
        isOpen={Boolean(editingWorkspace)}
        onClose={() => setEditingWorkspace(null)}
        onSubmit={handleEditWorkspace}
        initialData={
          editingWorkspace
            ? {
                name: editingWorkspace.name,
                description: editingWorkspace.description,
                colorTheme: resolveWorkspaceThemeId(editingWorkspace),
              }
            : null
        }
        mode="edit"
        loading={submitting}
      />

      <NoteDetailModal
        note={selectedNote}
        workspace={selectedWorkspace}
        workspaceName={selectedWorkspace?.name}
        isOpen={Boolean(selectedNote)}
        onClose={() => setSelectedNote(null)}
        onEdit={(note) => {
          setSelectedNote(null);
          onEditNote?.(note, selectedWorkspace?.name);
        }}
        onDelete={async (noteId) => {
          if (!window.confirm('Delete this note?')) return;
          try {
            await noteService.deleteNote(noteId);
            showToast.success('Note deleted');
            handleNoteDeleted(noteId);
          } catch (err) {
            showToast.error(err.message || 'Failed to delete note');
          }
        }}
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
