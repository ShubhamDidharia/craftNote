// Note service to communicate with backend
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/notes`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const noteService = {
  // Create a new note
  createNote: async (noteData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create note');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all notes (with optional workspace filter)
  getNotes: async (workspaceId = null) => {
    try {
      const url = workspaceId 
        ? `${API_BASE_URL}?workspaceId=${workspaceId}`
        : API_BASE_URL;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notes');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific note
  getNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch note');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update a note
  updateNote: async (id, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update note');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a note
  deleteNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete note');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Toggle pin status
  togglePinNote: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/pin`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to pin note');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};
