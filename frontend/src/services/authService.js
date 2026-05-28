const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth`;

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    console.error('[authService] Non-JSON response', {
      status: response.status,
      body: text.slice(0, 200),
    });
    throw new Error(
      response.ok
        ? 'Invalid response from server'
        : `Server error (${response.status}). Is the backend running on port 5000?`
    );
  }
};

export const authService = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  signin: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Signin failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),

  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('[authService] Corrupt user data in localStorage', error);
      authService.logout();
      return null;
    }
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem('token') && authService.getUser());
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      if (response.status === 401) {
        authService.logout();
      }
      throw new Error(data.error || 'Failed to fetch user');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  deleteAccount: async (password) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete account');
    }

    authService.logout();
    return data;
  },
};
