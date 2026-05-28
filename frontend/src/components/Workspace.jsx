import React, { useState, useEffect } from 'react';
import { workspaceService } from '../services/workspaceService';
import { noteService } from '../services/noteService';
import { NoteList } from './NoteList';
import '../styles/Workspace.css';

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
    return <div className="loading-state">Loading workspaces...</div>;
  }

  return (
    <div className="workspace-container">
      <div className="workspace-layout">
        {/* Workspace Sidebar */}
        <aside className="workspace-sidebar">
          <div className="sidebar-header">
            <h3>Workspaces</h3>
            <button
              className="add-workspace-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
              title="Create new workspace"
            >
              +
            </button>
          </div>

          {/* Create Workspace Form */}
          {showCreateForm && (
            <div className="create-workspace-form">
              <form onSubmit={handleCreateWorkspace}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Workspace name"
                    required
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <div className="color-picker">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? '...' : '✓'}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowCreateForm(false)}
                  >
                    ✕
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Workspaces List */}
          <div className="workspaces-list-sidebar">
            {workspaces.length === 0 ? (
              <div className="empty-sidebar">No workspaces</div>
            ) : (
              workspaces.map((workspace) => (
                <div
                  key={workspace._id}
                  className={`workspace-item ${
                    selectedWorkspace?._id === workspace._id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedWorkspace(workspace)}
                >
                  <div
                    className="workspace-color-dot"
                    style={{ backgroundColor: workspace.color }}
                  ></div>
                  <div className="workspace-item-info">
                    <span className="workspace-name">{workspace.name}</span>
                    <span className="workspace-count">
                      {workspace.notes?.length || 0} notes
                    </span>
                  </div>
                  <button
                    className="delete-workspace-btn"
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
        <main className="workspace-content">
          {error && <div className="error-message">{error}</div>}

          {selectedWorkspace ? (
            <>
              <div className="content-header">
                <div className="workspace-info">
                  <div
                    className="workspace-banner"
                    style={{ backgroundColor: selectedWorkspace.color }}
                  ></div>
                  <h2>{selectedWorkspace.name}</h2>
                  {selectedWorkspace.description && (
                    <p className="workspace-description">
                      {selectedWorkspace.description}
                    </p>
                  )}
                </div>
                <button
                  className="create-note-btn"
                  onClick={() => onCreateNote(selectedWorkspace._id, selectedWorkspace.name)}
                >
                  + Create New Note
                </button>
              </div>

              {notesLoading ? (
                <div className="loading-state">Loading notes...</div>
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
            <div className="empty-state">
              <p>No workspace selected</p>
              <p className="empty-state-hint">
                Create or select a workspace to get started
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
