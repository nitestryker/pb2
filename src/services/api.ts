// Get the API base URL from environment variables
// In development: uses production backend by default (no local backend required)
// In production: uses the full Render backend URL
const getApiBaseUrl = () => {
  // Check if we have an explicit API URL set
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    console.log('Using API URL from environment:', envApiUrl);
    return envApiUrl;
  }
  
  // Fallback logic based on environment
  if (import.meta.env.PROD) {
    // In production, use the full backend URL
    console.log('Production mode: using Render backend');
    return 'https://pb2-ahh9.onrender.com/api';
  } else {
    // In development, check if we should use local backend
    if (import.meta.env.VITE_USE_LOCAL_BACKEND === 'true') {
      console.log('Development mode: using local backend via proxy');
      return '/api'; // Uses Vite proxy
    } else {
      console.log('Development mode: using production backend');
      return 'https://pb2-ahh9.onrender.com/api';
    }
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
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  private async makeRequest(url: string, options: RequestInit = {}) {
    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error(`Request failed for ${url}:`, error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest(`${API_BASE_URL}/health`);
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.makeRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.makeRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async verifyToken() {
    return this.makeRequest(`${API_BASE_URL}/auth/verify`);
  }

  // Paste endpoints
  async getRecentPastes(limit = 20) {
    return this.makeRequest(`${API_BASE_URL}/pastes/recent?limit=${limit}`);
  }

  async getPasteArchive(page = 1, limit = 20) {
    return this.makeRequest(`${API_BASE_URL}/pastes/archive?page=${page}&limit=${limit}`);
  }

  async getPaste(id: string) {
    return this.makeRequest(`${API_BASE_URL}/pastes/${id}`);
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
    return this.makeRequest(`${API_BASE_URL}/pastes`, {
      method: 'POST',
      body: JSON.stringify(pasteData)
    });
  }

  async getRelatedPastes(id: string, limit = 6) {
    return this.makeRequest(`${API_BASE_URL}/pastes/${id}/related?limit=${limit}`);
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
    return this.makeRequest(`${API_BASE_URL}/users/${username}`);
  }

  async getUserPastes(username: string, limit = 20) {
    return this.makeRequest(`${API_BASE_URL}/users/${username}/pastes?limit=${limit}`);
  }

  // Admin endpoints
  async getAdminStats() {
    return this.makeRequest(`${API_BASE_URL}/admin/stats`);
  }

  async getAdminUsers(page = 1, limit = 20) {
    return this.makeRequest(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`);
  }

  async getLanguageStats() {
    return this.makeRequest(`${API_BASE_URL}/admin/languages`);
  }
}

export const apiService = new ApiService();

// Log the API configuration for debugging
console.log('🔧 API Configuration:');
console.log('  Base URL:', API_BASE_URL);
console.log('  Environment:', import.meta.env.MODE);
console.log('  Production mode:', import.meta.env.PROD);
console.log('  Use local backend:', import.meta.env.VITE_USE_LOCAL_BACKEND === 'true');