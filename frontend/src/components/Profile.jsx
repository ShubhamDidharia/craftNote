import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { workspaceService } from '../services/workspaceService';

export const Profile = ({ user, onUserUpdated, onAccountDeleted, onNavigateToWorkspace }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [workspaceError, setWorkspaceError] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadWorkspaces = async () => {
    setLoadingWorkspaces(true);
    setWorkspaceError('');
    try {
      const data = await workspaceService.getWorkspaces();
      setWorkspaces(data.workspaces || []);
    } catch (err) {
      setWorkspaceError(err.message || 'Failed to load workspaces');
    } finally {
      setLoadingWorkspaces(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    });
  }, [user]);

  const openEditModal = () => {
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      const updatedUser = await authService.updateProfile(editForm);
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }
      setShowEditModal(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError('');

    try {
      await authService.deleteAccount(deletePassword);
      if (onAccountDeleted) {
        onAccountDeleted();
      }
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId, workspaceName) => {
    const confirmed = window.confirm(
      `Delete workspace "${workspaceName}"? All notes in this workspace will be removed.`
    );
    if (!confirmed) return;

    try {
      await workspaceService.deleteWorkspace(workspaceId);
      setWorkspaces((prev) => prev.filter((w) => w._id !== workspaceId));
    } catch (err) {
      setWorkspaceError(err.message || 'Failed to delete workspace');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-5 py-10">
      <div className="mb-8">
        <h2 className="m-0 text-2xl text-text-primary">User Profile</h2>
      </div>

      <div className="bg-bg-surface rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-accent to-accent/80 p-10 flex items-center gap-6 text-white">
          <div className="w-[100px] h-[100px] rounded-full bg-white/30 flex items-center justify-center text-[40px] font-bold flex-shrink-0">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="m-0 mb-2 text-xl font-bold">
              {user.firstName} {user.lastName}
            </h3>
            <p className="m-0 text-sm opacity-90">{user.email}</p>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <h4 className="m-0 mb-4 text-base font-semibold text-text-primary">Account Information</h4>
          <div className="flex py-3 border-b border-gray-100">
            <span className="w-[150px] font-medium text-text-secondary text-sm">First Name:</span>
            <span className="flex-1 text-text-primary text-sm break-words">{user.firstName}</span>
          </div>
          <div className="flex py-3 border-b border-gray-100">
            <span className="w-[150px] font-medium text-text-secondary text-sm">Last Name:</span>
            <span className="flex-1 text-text-primary text-sm break-words">{user.lastName}</span>
          </div>
          <div className="flex py-3">
            <span className="w-[150px] font-medium text-text-secondary text-sm">Email:</span>
            <span className="flex-1 text-text-primary text-sm break-words">{user.email}</span>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="m-0 text-base font-semibold text-text-primary">My Workspaces</h4>
            {onNavigateToWorkspace && (
              <button
                type="button"
                className="text-sm text-accent font-semibold hover:underline"
                onClick={onNavigateToWorkspace}
              >
                Manage in Workspace →
              </button>
            )}
          </div>

          {workspaceError && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-300">
              {workspaceError}
            </div>
          )}

          {loadingWorkspaces ? (
            <p className="text-sm text-gray-500">Loading workspaces...</p>
          ) : workspaces.length === 0 ? (
            <p className="text-sm text-gray-500 m-0">
              No workspaces yet. Create one from the Workspace tab.
            </p>
          ) : (
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {workspaces.map((workspace) => (
                <li
                  key={workspace._id}
                  className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-bg-main"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: workspace.color || '#667eea' }}
                    />
                    <div className="min-w-0">
                      <p className="m-0 font-semibold text-text-primary truncate">{workspace.name}</p>
                      {workspace.description && (
                        <p className="m-0 text-xs text-gray-500 truncate mt-1">
                          {workspace.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs px-3 py-1.5 text-red-600 border border-red-200 rounded-md hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDeleteWorkspace(workspace._id, workspace.name)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6">
          <h4 className="m-0 mb-4 text-base font-semibold text-text-primary">Actions</h4>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-5 py-2.5 border-2 border-gray-200 bg-bg-surface rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              onClick={openEditModal}
            >
              Edit Details
            </button>
            <button
              type="button"
              className="px-5 py-2.5 border-2 border-red-200 bg-red-50 rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-red-100 hover:border-red-300 text-red-700"
              onClick={() => {
                setDeletePassword('');
                setDeleteError('');
                setShowDeleteModal(true);
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="m-0 mb-4 text-lg font-bold text-text-primary">Edit Details</h3>

            {editError && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-300">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  required
                  disabled={editLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  required
                  disabled={editLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                  disabled={editLoading}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="m-0 mb-2 text-lg font-bold text-red-700">Delete Account</h3>
            <p className="m-0 mb-4 text-sm text-text-secondary">
              This permanently deletes your account, all workspaces, and all notes. This cannot be
              undone.
            </p>

            {deleteError && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-300">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm with your password
                </label>
                <input
                  type="password"
                  className="input w-full"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={deleteLoading}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
