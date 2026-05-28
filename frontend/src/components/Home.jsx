import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';
import { NoteList } from './NoteList';

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
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <div className="mb-10 text-center">
        <h2 className="m-0 mb-2 text-3xl font-bold text-text-primary">Welcome back, {user.firstName}!</h2>
        <p className="m-0 text-base text-text-secondary">Your latest notes from all workspaces</p>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg border border-red-300 text-sm mb-5">{error}</div>}

      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="text-center py-16 text-base text-text-secondary">Loading your notes...</div>
        ) : allNotes.length > 0 ? (
          <div className="flex flex-col gap-5">
            <h3 className="m-0 text-lg font-semibold text-text-primary py-3 border-b-2 border-gray-200">📝 All Your Notes</h3>
            <NoteList
              notes={allNotes}
              onNoteDeleted={handleNoteDeleted}
              onNoteUpdated={handleNoteUpdated}
            />
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-surface rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📝</div>
            <p className="m-0 mb-2 text-base text-text-secondary">No notes yet</p>
            <p className="text-sm text-gray-400">
              Go to Workspaces to create your first note!
            </p>
          </div>
        )}

        {!loading && allNotes.length === 0 && (
          <div className="bg-bg-surface rounded-xl p-8 shadow-sm">
            <h3 className="m-0 mb-6 text-xl font-semibold text-text-primary">How to Get Started</h3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent to-accent/80 text-white rounded-full text-base font-bold flex-shrink-0">1</span>
                <div className="flex-1">
                  <h4 className="m-0 mb-1.5 text-base font-semibold text-text-primary">Create a Workspace</h4>
                  <p className="m-0 text-sm text-text-secondary leading-relaxed">Go to the Workspace tab to create your first workspace</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent to-accent/80 text-white rounded-full text-base font-bold flex-shrink-0">2</span>
                <div className="flex-1">
                  <h4 className="m-0 mb-1.5 text-base font-semibold text-text-primary">Add Notes</h4>
                  <p className="m-0 text-sm text-text-secondary leading-relaxed">Click "Create New Note" to start writing in your workspace</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent to-accent/80 text-white rounded-full text-base font-bold flex-shrink-0">3</span>
                <div className="flex-1">
                  <h4 className="m-0 mb-1.5 text-base font-semibold text-text-primary">Organize & View</h4>
                  <p className="m-0 text-sm text-text-secondary leading-relaxed">All your notes will appear here sorted by latest activity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
