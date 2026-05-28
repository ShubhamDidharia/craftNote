import React, { useState, useEffect } from 'react';
import { workspaceService } from '../services/workspaceService';
import { noteService } from '../services/noteService';
import { NoteList } from './NoteList';

export const Workspace = ({ onCreateNote }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#667eea',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Fetch notes when workspace is selected
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
      setWorkspaces(data.workspaces || []);
      // Select first workspace by default
      if (data.workspaces && data.workspaces.length > 0) {
        setSelectedWorkspace(data.workspaces[0]);
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
      setError('');
      const data = await noteService.getNotes(workspaceId);
      setNotes(data.notes || []);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!formData.name.trim()) {
        setError('Workspace name is required');
        setSubmitting(false);
        return;
      }

      const response = await workspaceService.createWorkspace(formData);
      
      // Add new workspace to list
      setWorkspaces([...workspaces, response.workspace]);
      setSelectedWorkspace(response.workspace);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        color: '#667eea',
      });
      setShowCreateForm(false);
    } catch (err) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      try {
        setError('');
        await workspaceService.deleteWorkspace(id);
        const updatedWorkspaces = workspaces.filter((w) => w._id !== id);
        setWorkspaces(updatedWorkspaces);
        
        // Select another workspace or clear if no more workspaces
        if (selectedWorkspace._id === id) {
          if (updatedWorkspaces.length > 0) {
            setSelectedWorkspace(updatedWorkspaces[0]);
          } else {
            setSelectedWorkspace(null);
            setNotes([]);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to delete workspace');
      }
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  const handleNoteDeleted = (noteId) => {
    setNotes(notes.filter((n) => n._id !== noteId));
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(
      notes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  };

  if (loading) {
    return <div className="text-center py-10 text-base text-text-secondary">Loading workspaces...</div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto p-5 h-[calc(100vh-60px)] overflow-hidden">
      <div className="grid grid-cols-[280px_1fr] gap-5 h-full">
        {/* Workspace Sidebar */}
        <aside className="bg-bg-surface rounded-xl shadow-sm p-4 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-gray-200">
            <h3 className="m-0 text-base font-semibold text-text-primary">Workspaces</h3>
            <button
              className="w-7 h-7 rounded-md bg-green-500 text-white border-none text-base font-semibold cursor-pointer transition-all hover:bg-green-600 hover:scale-105 flex items-center justify-center"
              onClick={() => setShowCreateForm(!showCreateForm)}
              title="Create new workspace"
            >
              +
            </button>
          </div>

          {/* Create Workspace Form */}
          {showCreateForm && (
            <div className="bg-bg-main rounded-lg p-3 mb-3 border-2 border-gray-200">
              <form onSubmit={handleCreateWorkspace} className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Workspace name"
                    required
                    className="px-2 py-2 border border-gray-300 rounded-md text-sm font-family-inherit focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows="2"
                    className="px-2 py-2 border border-gray-300 rounded-md text-sm font-family-inherit focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-center">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-10 h-8 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 mt-1">
                  <button
                    type="submit"
                    className="flex-1 px-1.5 py-1.5 bg-accent text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-all hover:bg-accent/90"
                    disabled={submitting}
                  >
                    {submitting ? '...' : '✓'}
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-1.5 py-1.5 bg-white text-text-secondary border border-gray-300 rounded-md text-sm cursor-pointer transition-all hover:bg-gray-100"
                    onClick={() => setShowCreateForm(false)}
                  >
                    ✕
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Workspaces List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {workspaces.length === 0 ? (
              <div className="text-center py-5 text-gray-400 text-sm">No workspaces</div>
            ) : (
              workspaces.map((workspace) => (
                <div
                  key={workspace._id}
                  className={`p-3 bg-bg-main border-2 border-transparent rounded-md cursor-pointer transition-all flex items-center gap-2.5 min-w-0 hover:bg-gray-100 hover:border-gray-200 ${selectedWorkspace?._id === workspace._id ? 'bg-blue-100 border-blue-300' : ''}`}
                  onClick={() => setSelectedWorkspace(workspace)}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: workspace.color }}
                  ></div>
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">{workspace.name}</span>
                    <span className="text-xs text-gray-400">
                      {workspace.notes?.length || 0} notes
                    </span>
                  </div>
                  <button
                    className="bg-none border-none text-base cursor-pointer p-1 opacity-0 transition-all flex-shrink-0 hover:scale-120"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkspace(workspace._id);
                    }}
                    title="Delete workspace"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="bg-bg-surface rounded-xl shadow-sm p-6 overflow-y-auto flex flex-col gap-5">
          {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg border border-red-300 text-sm">{error}</div>}

          {selectedWorkspace ? (
            <>
              <div className="flex justify-between items-start gap-4 pb-4 border-b-2 border-gray-200">
                <div className="flex-1">
                  <div
                    className="w-full h-[60px] rounded-lg mb-3"
                    style={{ backgroundColor: selectedWorkspace.color }}
                  ></div>
                  <h2 className="m-0 mb-2 text-2xl text-text-primary">{selectedWorkspace.name}</h2>
                  {selectedWorkspace.description && (
                    <p className="m-0 text-sm text-text-secondary leading-relaxed">
                      {selectedWorkspace.description}
                    </p>
                  )}
                </div>
                <button
                  className="px-6 py-3 bg-accent text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
                  onClick={() => onCreateNote(selectedWorkspace._id, selectedWorkspace.name)}
                >
                  + Create New Note
                </button>
              </div>

              {notesLoading ? (
                <div className="text-center py-10 text-base text-text-secondary">Loading notes...</div>
              ) : (
                <NoteList
                  notes={notes}
                  workspaceId={selectedWorkspace._id}
                  onNoteDeleted={handleNoteDeleted}
                  onNoteUpdated={handleNoteUpdated}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="m-0 mb-2 text-base text-text-secondary">No workspace selected</p>
              <p className="text-sm text-gray-400">
                Create or select a workspace to get started
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
