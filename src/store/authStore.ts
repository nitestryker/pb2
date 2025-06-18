import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { apiService } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  verifyToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiService.login(email, password);
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await apiService.register(userData);
          set({ 
            user: response.user, 
            token: response.token,
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser });
        }
      },

      verifyToken: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const response = await apiService.verifyToken();
          set({ user: response.user, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Token verification failed:', error);
          set({ user: null, token: null, isAuthenticated: false });
          return false;
        }
      }
    }),
    {
      name: 'pasteforge-auth',
    }
  )
);