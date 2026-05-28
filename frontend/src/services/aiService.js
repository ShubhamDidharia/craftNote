const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const request = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`[aiService] ${endpoint} failed`, {
      status: response.status,
      error: data.error,
    });
    throw new Error(data.error || 'AI request failed');
  }

  return data;
};

export const aiService = {
  generateTitle: (context, content = '') =>
    request('/generate-title', { context, content }),

  writingHelp: (content, style) =>
    request('/writing-help', { content, style }),

  verifyContent: (content) =>
    request('/verify-content', { content }),
};
