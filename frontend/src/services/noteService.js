import axios from 'axios';

// Note service to communicate with backend
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/notes`;

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

export const noteService = {
  // Create a new note
  createNote: async (noteData) => {
    try {
      const response = await api.post('', noteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create note');
    }
  },

  // Get all notes (with optional workspace filter)
  getNotes: async (workspaceId = null) => {
    try {
      const params = workspaceId ? { workspaceId } : {};
      const response = await api.get('', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch notes');
    }
  },

  // Get a specific note
  getNote: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch note');
    }
  },

  // Update a note
  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update note');
    }
  },

  // Delete a note
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete note');
    }
  },

  // Toggle pin status
  togglePinNote: async (id) => {
    try {
      const response = await api.put(`/${id}/pin`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to pin note');
    }
  },
};
