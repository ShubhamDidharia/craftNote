import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';
import { NoteList } from './NoteList';
import '../styles/Home.css';

export const Home = ({ user }) => {
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllNotes();
  }, []);

  const fetchAllNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await noteService.getNotes();
      
      // Sort notes by latest timestamp (updatedAt if available, otherwise createdAt)
      const sortedNotes = (data.notes || []).sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt);
        const timeB = new Date(b.updatedAt || b.createdAt);
        return timeB - timeA; // Latest first
      });
      
      setAllNotes(sortedNotes);
    } catch (err) {
      setError(err.message || 'Failed to load notes');
      setAllNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteDeleted = (noteId) => {
    setAllNotes(allNotes.filter((n) => n._id !== noteId));
  };

  const handleNoteUpdated = (updatedNote) => {
    setAllNotes(
      allNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Welcome back, {user.firstName}!</h2>
        <p>Your latest notes from all workspaces</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="home-content">
        {loading ? (
          <div className="loading-state">Loading your notes...</div>
        ) : allNotes.length > 0 ? (
          <div className="all-notes-section">
            <h3 className="section-title">📝 All Your Notes</h3>
            <NoteList
              notes={allNotes}
              onNoteDeleted={handleNoteDeleted}
              onNoteUpdated={handleNoteUpdated}
            />
          </div>
        ) : (
          <div className="empty-state-full">
            <div className="empty-icon">📝</div>
            <p>No notes yet</p>
            <p className="empty-hint">
              Go to Workspaces to create your first note!
            </p>
          </div>
        )}

        {!loading && allNotes.length === 0 && (
          <div className="getting-started-guide">
            <h3>How to Get Started</h3>
            <div className="guide-steps">
              <div className="guide-step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Create a Workspace</h4>
                  <p>Go to the Workspace tab to create your first workspace</p>
                </div>
              </div>

              <div className="guide-step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Add Notes</h4>
                  <p>Click "Create New Note" to start writing in your workspace</p>
                </div>
              </div>

              <div className="guide-step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Organize & View</h4>
                  <p>All your notes will appear here sorted by latest activity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
