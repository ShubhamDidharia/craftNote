import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, LayoutGrid, ChevronRight } from 'lucide-react';
import { authService } from '../services/authService';
import { workspaceService } from '../services/workspaceService';
import { showToast } from '../utils/toast';
import { WorkspaceFormModal } from './WorkspaceFormModal';
import {
  getThemeById,
  getThemeSwatchStyle,
  resolveWorkspaceThemeId,
} from '../constants/colorThemes';

export const Profile = ({ user, onUserUpdated, onAccountDeleted }) => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [workspaceError, setWorkspaceError] = useState('');
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [workspaceSubmitting, setWorkspaceSubmitting] = useState(false);

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
      showToast.success('Account deleted');
      onAccountDeleted?.();
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditWorkspace = async (formData) => {
    if (!editingWorkspace) return;
    setWorkspaceSubmitting(true);
    try {
      const response = await workspaceService.updateWorkspace(editingWorkspace._id, {
        name: formData.name.trim(),
        description: formData.description,
        colorTheme: formData.colorTheme,
      });
      setWorkspaces((prev) =>
        prev.map((w) => (w._id === response.workspace._id ? response.workspace : w))
      );
      setEditingWorkspace(null);
      showToast.success('Workspace updated');
    } catch (err) {
      showToast.error(err.message || 'Failed to update workspace');
    } finally {
      setWorkspaceSubmitting(false);
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
      showToast.success('Workspace deleted');
    } catch (err) {
      showToast.error(err.message || 'Failed to delete workspace');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-5 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h2 className="m-0 text-2xl text-text-primary break-words">User Profile</h2>
      </div>

      <div className="bg-bg-surface rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-accent to-accent/80 p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-white text-center sm:text-left">
          <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-full bg-white/30 flex items-center justify-center text-3xl sm:text-[40px] font-bold flex-shrink-0">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="m-0 mb-2 text-xl font-bold break-words">
              {user.firstName} {user.lastName}
            </h3>
            <p className="m-0 text-sm opacity-90 break-words">{user.email}</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="m-0 mb-4 text-base font-semibold text-text-primary">Account Information</h4>
          <div className="flex flex-col sm:flex-row py-3 border-b border-gray-100 gap-1 sm:gap-0">
            <span className="w-full sm:w-[150px] font-medium text-text-secondary text-sm">First Name:</span>
            <span className="flex-1 text-text-primary text-sm break-words">{user.firstName}</span>
          </div>
          <div className="flex flex-col sm:flex-row py-3 border-b border-gray-100 gap-1 sm:gap-0">
            <span className="w-full sm:w-[150px] font-medium text-text-secondary text-sm">Last Name:</span>
            <span className="flex-1 text-text-primary text-sm break-words">{user.lastName}</span>
          </div>
          <div className="flex flex-col sm:flex-row py-3 gap-1 sm:gap-0">
            <span className="w-full sm:w-[150px] font-medium text-text-secondary text-sm">Email:</span>
            <span className="flex-1 text-text-primary text-sm break-words">{user.email}</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h4 className="m-0 text-base font-semibold text-text-primary flex items-center gap-2">
              <LayoutGrid size={18} />
              My Workspaces
            </h4>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm text-accent font-semibold hover:underline"
              onClick={() => navigate('/workspace')}
            >
              Manage in Workspace
              <ChevronRight size={16} />
            </button>
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
              {workspaces.map((workspace) => {
                const themeId = resolveWorkspaceThemeId(workspace);
                const theme = getThemeById(themeId);
                return (
                  <li
                    key={workspace._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-bg-main"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-9 h-9 rounded-md shrink-0 flex items-center justify-center text-[10px] font-bold"
                        style={getThemeSwatchStyle(themeId)}
                      >
                        Aa
                      </span>
                      <div className="min-w-0">
                        <p className="m-0 font-semibold text-text-primary truncate">{workspace.name}</p>
                        <p className="m-0 text-xs text-gray-500 mt-0.5">{theme.name} theme</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-1 text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                        onClick={() => setEditingWorkspace(workspace)}
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-1 text-xs px-3 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 w-full sm:w-auto"
                        onClick={() => handleDeleteWorkspace(workspace._id, workspace.name)}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <h4 className="m-0 mb-4 text-base font-semibold text-text-primary">Actions</h4>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-200 bg-bg-surface rounded-lg text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all w-full sm:w-auto"
              onClick={openEditModal}
            >
              <Pencil size={16} />
              Edit Details
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-red-200 bg-red-50 rounded-lg text-sm font-semibold hover:bg-red-100 hover:border-red-300 text-red-700 transition-all w-full sm:w-auto"
              onClick={() => {
                setDeletePassword('');
                setDeleteError('');
                setShowDeleteModal(true);
              }}
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content w-[calc(100vw-1.5rem)] sm:w-full p-4 sm:p-6 max-w-md mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
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
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost w-full sm:w-auto"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        loading={workspaceSubmitting}
      />

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content w-[calc(100vw-1.5rem)] sm:w-full p-4 sm:p-6 max-w-md mx-3 sm:mx-4" onClick={(e) => e.stopPropagation()}>
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
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  className="btn-ghost w-full sm:w-auto"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 w-full sm:w-auto"
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
