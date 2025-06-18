// Enhanced API service with comprehensive error handling and debugging
const getApiBaseUrl = () => {
  // Priority order for API URL determination:
  // 1. Explicit VITE_API_URL from environment
  // 2. Environment-based defaults
  // 3. Hardcoded fallbacks
  
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    console.log('🔧 Using API URL from environment:', envApiUrl);
    return envApiUrl;
  }
  
  // Environment-based fallbacks
  if (import.meta.env.PROD) {
    console.log('🚀 Production mode: using Render backend');
    return 'https://pb2-ahh9.onrender.com/api';
  } else {
    // Development mode logic
    if (import.meta.env.VITE_USE_LOCAL_BACKEND === 'true') {
      console.log('🔧 Development mode: using local backend via proxy');
      return '/api'; // Uses Vite proxy
    } else {
      console.log('🔧 Development mode: using production backend');
      return 'https://pb2-ahh9.onrender.com/api';
    }
  }
};

const API_BASE_URL = getApiBaseUrl();
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const ENABLE_FALLBACK = import.meta.env.VITE_ENABLE_API_FALLBACK !== 'false';

interface ApiError extends Error {
  status?: number;
  code?: string;
  retryable?: boolean;
}

class ApiService {
  private backendStatus: 'unknown' | 'healthy' | 'sleeping' | 'error' = 'unknown';
  private lastHealthCheck = 0;
  private healthCheckInterval = 5 * 60 * 1000; // 5 minutes
  private requestCount = 0;

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
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      
      const apiError: ApiError = new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      apiError.status = response.status;
      apiError.retryable = response.status >= 500 || response.status === 429;
      
      throw apiError;
    }
    return response.json();
  }

  private createTimeoutError(): ApiError {
    const error: ApiError = new Error(
      'Request timeout - the server may be sleeping or experiencing high load. Please try again in a moment.'
    );
    error.code = 'TIMEOUT';
    error.retryable = true;
    return error;
  }

  private createNetworkError(originalError: Error): ApiError {
    const error: ApiError = new Error(
      'Network error - unable to connect to server. The backend may be starting up, please wait a moment and try again.'
    );
    error.code = 'NETWORK_ERROR';
    error.retryable = true;
    return error;
  }

  private async makeRequest(url: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
    const maxRetries = 3;
    this.requestCount++;
    
    try {
      console.log(`🌐 [${this.requestCount}] Making request to: ${url} (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Enhanced request options
      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        },
        // Add credentials for CORS
        credentials: 'omit',
        // Add mode for CORS
        mode: 'cors',
        // Add cache control
        cache: 'no-cache'
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn(`⏰ Request timeout after ${API_TIMEOUT}ms for: ${url}`);
      }, API_TIMEOUT);
      
      requestOptions.signal = controller.signal;
      
      // Log request details for debugging
      console.log('📤 Request details:', {
        url,
        method: requestOptions.method || 'GET',
        headers: requestOptions.headers,
        hasBody: !!requestOptions.body
      });
      
      const response = await fetch(url, requestOptions);
      
      clearTimeout(timeoutId);
      
      console.log(`📥 Response received:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      // Update backend status on successful response
      if (response.ok) {
        this.backendStatus = 'healthy';
        this.lastHealthCheck = Date.now();
        console.log('✅ Backend status updated to healthy');
      }
      
      return this.handleResponse(response);
      
    } catch (error) {
      console.error(`❌ Request failed for ${url}:`, {
        error: error instanceof Error ? error.message : error,
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        retryCount,
        maxRetries
      });
      
      let apiError: ApiError;
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          apiError = this.createTimeoutError();
          this.backendStatus = 'sleeping';
          console.log('💤 Backend appears to be sleeping (timeout)');
        } else if (
          error.message.includes('fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('ERR_NETWORK') ||
          error.message.includes('ERR_INTERNET_DISCONNECTED')
        ) {
          apiError = this.createNetworkError(error);
          this.backendStatus = 'error';
          console.log('🌐 Network connectivity issue detected');
        } else {
          apiError = error as ApiError;
          this.backendStatus = 'error';
        }
      } else {
        apiError = new Error('Unknown error occurred');
        this.backendStatus = 'error';
      }
      
      // Enhanced retry logic for retryable errors
      if (apiError.retryable && retryCount < maxRetries && ENABLE_FALLBACK) {
        const delay = Math.min(Math.pow(2, retryCount) * 1000, 10000); // Exponential backoff, max 10s
        console.log(`🔄 Retrying request in ${delay}ms... (${retryCount + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(url, options, retryCount + 1);
      }
      
      // Log final failure
      console.error(`💥 Request permanently failed after ${retryCount + 1} attempts:`, {
        url,
        finalError: apiError.message,
        backendStatus: this.backendStatus
      });
      
      throw apiError;
    }
  }

  // Enhanced health check with comprehensive logging
  async healthCheck(): Promise<any> {
    try {
      console.log('🏥 Performing comprehensive health check...');
      console.log('🔧 Health check configuration:', {
        url: `${API_BASE_URL}/health`,
        timeout: API_TIMEOUT,
        fallbackEnabled: ENABLE_FALLBACK
      });
      
      const result = await this.makeRequest(`${API_BASE_URL}/health`);
      
      this.backendStatus = 'healthy';
      this.lastHealthCheck = Date.now();
      
      console.log('✅ Health check successful:', result);
      console.log('📊 Backend status:', {
        status: this.backendStatus,
        timestamp: new Date(this.lastHealthCheck).toISOString(),
        environment: result.environment || 'unknown',
        database: result.database || 'unknown'
      });
      
      return result;
      
    } catch (error) {
      console.warn('⚠️ Health check failed:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          this.backendStatus = 'sleeping';
          console.log('💤 Backend is likely sleeping (Render free tier)');
        } else if (error.message.includes('Network error')) {
          this.backendStatus = 'error';
          console.log('🌐 Network connectivity issue');
        } else {
          this.backendStatus = 'error';
          console.log('🔥 Backend error:', error.message);
        }
      }
      
      console.log('📊 Backend status after failed health check:', {
        status: this.backendStatus,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }

  // Get current backend status with detailed info
  getBackendStatus(): { 
    status: string; 
    lastCheck: number; 
    needsCheck: boolean;
    requestCount: number;
  } {
    const needsCheck = Date.now() - this.lastHealthCheck > this.healthCheckInterval;
    return {
      status: this.backendStatus,
      lastCheck: this.lastHealthCheck,
      needsCheck,
      requestCount: this.requestCount
    };
  }

  // Auth endpoints
  async login(email: string, password: string) {
    console.log('🔐 Attempting login for:', email);
    return this.makeRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData: { username: string; email: string; password: string }) {
    console.log('📝 Attempting registration for:', userData.username);
    return this.makeRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async verifyToken() {
    console.log('🔍 Verifying authentication token...');
    return this.makeRequest(`${API_BASE_URL}/auth/verify`);
  }

  // Paste endpoints with enhanced error handling
  async getRecentPastes(limit = 20) {
    try {
      console.log(`📋 Fetching ${limit} recent pastes...`);
      const result = await this.makeRequest(`${API_BASE_URL}/pastes/recent?limit=${limit}`);
      console.log(`✅ Successfully fetched ${result.length} recent pastes`);
      return result;
    } catch (error) {
      console.error('❌ Failed to fetch recent pastes:', error);
      
      // Return empty array as fallback for UI
      if (ENABLE_FALLBACK) {
        console.log('📋 Returning empty pastes array as fallback');
        return [];
      }
      
      throw error;
    }
  }

  async getPasteArchive(page = 1, limit = 20) {
    console.log(`📚 Fetching paste archive (page ${page}, limit ${limit})...`);
    return this.makeRequest(`${API_BASE_URL}/pastes/archive?page=${page}&limit=${limit}`);
  }

  async getPaste(id: string) {
    console.log(`📄 Fetching paste: ${id}`);
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
    console.log('📝 Creating new paste:', {
      title: pasteData.title,
      language: pasteData.language,
      isPrivate: pasteData.isPrivate,
      isZeroKnowledge: pasteData.isZeroKnowledge,
      hasContent: !!pasteData.content,
      hasEncryptedContent: !!pasteData.encryptedContent,
      tagsCount: pasteData.tags?.length || 0
    });
    
    return this.makeRequest(`${API_BASE_URL}/pastes`, {
      method: 'POST',
      body: JSON.stringify(pasteData)
    });
  }

  async getRelatedPastes(id: string, limit = 6) {
    try {
      console.log(`🔗 Fetching related pastes for: ${id}`);
      return await this.makeRequest(`${API_BASE_URL}/pastes/${id}/related?limit=${limit}`);
    } catch (error) {
      console.error('❌ Failed to fetch related pastes:', error);
      
      // Return empty array as fallback
      if (ENABLE_FALLBACK) {
        console.log('🔗 Returning empty related pastes array as fallback');
        return [];
      }
      
      throw error;
    }
  }

  async downloadPaste(id: string) {
    console.log(`⬇️ Downloading paste: ${id}`);
    const response = await fetch(`${API_BASE_URL}/pastes/${id}/download`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to download paste');
    }
    
    return response.blob();
  }

  // User endpoints
  async getUser(username: string) {
    console.log(`👤 Fetching user: ${username}`);
    return this.makeRequest(`${API_BASE_URL}/users/${username}`);
  }

  async getUserPastes(username: string, limit = 20) {
    console.log(`📋 Fetching pastes for user: ${username}`);
    return this.makeRequest(`${API_BASE_URL}/users/${username}/pastes?limit=${limit}`);
  }

  // Admin endpoints
  async getAdminStats() {
    console.log('📊 Fetching admin statistics...');
    return this.makeRequest(`${API_BASE_URL}/admin/stats`);
  }

  async getAdminUsers(page = 1, limit = 20) {
    console.log(`👥 Fetching admin users (page ${page})...`);
    return this.makeRequest(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`);
  }

  async getLanguageStats() {
    console.log('📈 Fetching language statistics...');
    return this.makeRequest(`${API_BASE_URL}/admin/languages`);
  }

  // Debug method to test connectivity
  async testConnectivity(): Promise<{
    canReachBackend: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing backend connectivity...');
      await this.healthCheck();
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ Connectivity test passed in ${responseTime}ms`);
      return {
        canReachBackend: true,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.log(`❌ Connectivity test failed in ${responseTime}ms:`, errorMessage);
      return {
        canReachBackend: false,
        responseTime,
        error: errorMessage
      };
    }
  }
}

export const apiService = new ApiService();

// Enhanced startup configuration logging
console.log('🔧 PasteForge API Configuration:');
console.log('  📍 Base URL:', API_BASE_URL);
console.log('  🌍 Environment:', import.meta.env.MODE);
console.log('  🚀 Production mode:', import.meta.env.PROD);
console.log('  🔧 Use local backend:', import.meta.env.VITE_USE_LOCAL_BACKEND === 'true');
console.log('  ⏰ API timeout:', API_TIMEOUT + 'ms');
console.log('  🔄 Fallback enabled:', ENABLE_FALLBACK);
console.log('  🌐 User agent:', navigator.userAgent);
console.log('  📱 Platform:', navigator.platform);
console.log('  🔗 Origin:', window.location.origin);

// Enhanced startup health check with detailed logging
console.log('🏥 Initiating startup health check...');
apiService.healthCheck()
  .then((result) => {
    console.log('✅ Startup health check successful!');
    console.log('📊 Backend details:', result);
    console.log('🎉 PasteForge is ready to use!');
  })
  .catch((error) => {
    console.warn('⚠️ Startup health check failed - this is normal if the server is sleeping');
    console.log('💡 Troubleshooting information:');
    console.log('  🔄 The backend will be automatically retried on first request');
    console.log('  💤 Render free tier servers sleep after 15 minutes of inactivity');
    console.log('  ⏰ First request may take 30-60 seconds to wake up the server');
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.log('  🎯 Likely cause: Server is sleeping (normal for Render free tier)');
        console.log('  ✅ Solution: Wait for server to wake up automatically');
      } else if (error.message.includes('Network error')) {
        console.log('  🎯 Likely cause: Network connectivity issue');
        console.log('  ✅ Solution: Check internet connection and try again');
      } else if (error.message.includes('CORS')) {
        console.log('  🎯 Likely cause: CORS configuration issue');
        console.log('  ✅ Solution: Check backend CORS settings');
      } else {
        console.log('  🎯 Error details:', error.message);
      }
    }
    
    console.log('🔍 Debug information:');
    console.log('  📍 Trying to reach:', API_BASE_URL);
    console.log('  🌐 From origin:', window.location.origin);
    console.log('  🔧 Environment:', import.meta.env.MODE);
  });

// Test connectivity after a short delay
setTimeout(() => {
  apiService.testConnectivity().then(result => {
    console.log('🧪 Connectivity test result:', result);
  });
}, 2000);