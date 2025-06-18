// Get the API base URL from environment variables
// In development: uses proxy or localhost:3001
// In production: uses the full Render backend URL
const getApiBaseUrl = () => {
  // Check if we're in production
  if (import.meta.env.PROD) {
    // In production, use the full backend URL from environment variable
    return import.meta.env.VITE_API_URL || 'https://your-render-backend-url.onrender.com/api';
  } else {
    // In development, use relative path (works with Vite proxy) or localhost
    return import.meta.env.VITE_API_URL || '/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('pasteforge-auth');
    if (token) {
      try {
        const authData = JSON.parse(token);
        return {
          'Authorization': `Bearer ${authData.state.token}`,
          'Content-Type': 'application/json'
        };
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return {
      'Content-Type': 'application/json'
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse(response);
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async register(userData: { username: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async verifyToken() {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  // Paste endpoints
  async getRecentPastes(limit = 20) {
    const response = await fetch(`${API_BASE_URL}/pastes/recent?limit=${limit}`);
    return this.handleResponse(response);
  }

  async getPasteArchive(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/pastes/archive?page=${page}&limit=${limit}`);
    return this.handleResponse(response);
  }

  async getPaste(id: string) {
    const response = await fetch(`${API_BASE_URL}/pastes/${id}`);
    return this.handleResponse(response);
  }

  async createPaste(pasteData: {
    title: string;
    content: string;
    language: string;
    isPrivate?: boolean;
    isZeroKnowledge?: boolean;
    encryptedContent?: string;
    expiration?: string;
    tags?: string[];
  }) {
    const response = await fetch(`${API_BASE_URL}/pastes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(pasteData)
    });
    return this.handleResponse(response);
  }

  async getRelatedPastes(id: string, limit = 6) {
    const response = await fetch(`${API_BASE_URL}/pastes/${id}/related?limit=${limit}`);
    return this.handleResponse(response);
  }

  async downloadPaste(id: string) {
    const response = await fetch(`${API_BASE_URL}/pastes/${id}/download`);
    if (!response.ok) {
      throw new Error('Failed to download paste');
    }
    return response.blob();
  }

  // User endpoints
  async getUser(username: string) {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    return this.handleResponse(response);
  }

  async getUserPastes(username: string, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/users/${username}/pastes?limit=${limit}`);
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getAdminStats() {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminUsers(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }

  async getLanguageStats() {
    const response = await fetch(`${API_BASE_URL}/admin/languages`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();

// Log the API base URL for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}