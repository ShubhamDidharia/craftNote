// Workspace service to communicate with backend
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/workspaces`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const workspaceService = {
  // Create a new workspace
  createWorkspace: async (workspaceData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(workspaceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workspace');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all workspaces for current user
  getWorkspaces: async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workspaces');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific workspace
  getWorkspace: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workspace');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update a workspace
  updateWorkspace: async (id, workspaceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(workspaceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update workspace');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a workspace
  deleteWorkspace: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete workspace');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Set a workspace as default
  setDefaultWorkspace: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/default`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set default workspace');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};
