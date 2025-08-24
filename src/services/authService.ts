import axios from 'axios';
import { AuthUser, AuthResponse, LoginCredentials, RegisterData, AuthToken } from '../types/data';

// API base URL - would be environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'daycare_access_token',
  REFRESH_TOKEN: 'daycare_refresh_token',
  USER: 'daycare_user',
} as const;

// Token management
class TokenManager {
  static setTokens(tokens: AuthToken): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

// HTTP client with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { tokens } = response.data as { tokens: AuthToken };
          TokenManager.setTokens(tokens);
          
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        authService.logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Mock data for development (remove when backend is ready)
const MOCK_USERS = [
  {
    id: '1',
    email: 'jobseeker@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Seeker',
    role: 'SEEKER',
  },
  {
    id: '2',
    email: 'daycare@example.com',
    password: 'password123',
    firstName: 'David',
    lastName: 'Manager',
    role: 'DAYCARE',
  },
  {
    id: '3',
    email: 'recruiter@example.com',
    password: 'password123',
    firstName: 'Rachel',
    lastName: 'Recruiter',
    role: 'RECRUITER',
  },
];

// Generate mock JWT token
const generateMockToken = (user: any): AuthToken => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };
  
  // Simple base64 encoding for mock token
  const token = `mock.${btoa(JSON.stringify(payload))}.signature`;
  
  return {
    accessToken: token,
    refreshToken: `refresh_${token}`,
    expiresIn: 24 * 60 * 60,
  };
};

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService.login called with:', credentials);
      // Mock implementation - replace with real API call
      const mockUser = MOCK_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      console.log('Found mock user:', mockUser);

      if (!mockUser) {
        throw new Error('Invalid email or password');
      }

      const user: AuthUser = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role as any,
      };

      const tokens = generateMockToken(mockUser);
      
      // Store tokens and user
      TokenManager.setTokens(tokens);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return { user, tokens };

      // Real API implementation would be:
      // const response = await apiClient.post('/auth/login', credentials);
      // TokenManager.setTokens(response.data.tokens);
      // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      // return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check if user already exists (mock)
      const existingUser = MOCK_USERS.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user (mock)
      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      };

      const user: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      };

      const tokens = generateMockToken(newUser);
      
      // Store tokens and user
      TokenManager.setTokens(tokens);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      return { user, tokens };

      // Real API implementation would be:
      // const response = await apiClient.post('/auth/register', data);
      // TokenManager.setTokens(response.data.tokens);
      // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      // return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  },

  // Get current user from storage
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = TokenManager.getAccessToken();
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);

      if (!token || !userStr) {
        return null;
      }

      if (TokenManager.isTokenExpired(token)) {
        // Try to refresh token
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          // In real app, call refresh endpoint
          // For now, just clear expired session
          this.logout();
          return null;
        }
      }

      return JSON.parse(userStr);
    } catch (error) {
      this.logout();
      return null;
    }
  },

  // Logout user
  logout(): void {
    TokenManager.clearTokens();
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    // In real app, call logout endpoint to invalidate server-side session
    // apiClient.post('/auth/logout');
  },

  // Refresh access token
  async refreshToken(): Promise<AuthToken> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Real API implementation:
      // const response = await apiClient.post('/auth/refresh', {
      //   refreshToken,
      // });
      // TokenManager.setTokens(response.data.tokens);
      // return response.data.tokens;

      // Mock implementation
      throw new Error('Token refresh not implemented in mock mode');
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = TokenManager.getAccessToken();
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    
    return !!(token && user && !TokenManager.isTokenExpired(token));
  },

  // Get API client with auth headers
  getApiClient() {
    return apiClient;
  },
};

export default authService;
