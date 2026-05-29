import axios from 'axios';

// Workspace service to communicate with backend
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/workspaces`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const workspaceService = {
  // Create a new workspace
  createWorkspace: async (workspaceData) => {
    try {
      const response = await api.post('', workspaceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create workspace');
    }
  },

  // Get all workspaces for current user
  getWorkspaces: async () => {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch workspaces');
    }
  },

  // Get a specific workspace
  getWorkspace: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch workspace');
    }
  },

  // Update a workspace
  updateWorkspace: async (id, workspaceData) => {
    try {
      const response = await api.put(`/${id}`, workspaceData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update workspace');
    }
  },

  // Delete a workspace
  deleteWorkspace: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete workspace');
    }
  },

  // Set a workspace as default
  setDefaultWorkspace: async (id) => {
    try {
      const response = await api.put(`/${id}/default`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to set default workspace');
    }
  },
};
