import { create } from 'zustand';
import { Paste, Project, Issue, Notification, Message } from '../types';
import { apiService } from '../services/api';

interface AppState {
  pastes: Paste[];
  projects: Project[];
  issues: Issue[];
  notifications: Notification[];
  messages: Message[];
  isLoading: boolean;
  
  // Pastes
  loadRecentPastes: () => Promise<void>;
  addPaste: (paste: Omit<Paste, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | null>;
  updatePaste: (id: string, updates: Partial<Paste>) => void;
  deletePaste: (id: string) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Issues
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  pastes: [],
  projects: [],
  issues: [],
  notifications: [],
  messages: [],
  isLoading: false,

  loadRecentPastes: async () => {
    set({ isLoading: true });
    try {
      const pastes = await apiService.getRecentPastes();
      set({ pastes, isLoading: false });
    } catch (error) {
      console.error('Failed to load recent pastes:', error);
      set({ isLoading: false });
    }
  },

  addPaste: async (pasteData) => {
    try {
      const response = await apiService.createPaste({
        title: pasteData.title,
        content: pasteData.content,
        language: pasteData.language,
        isPrivate: !pasteData.isPublic && !pasteData.isUnlisted,
        tags: pasteData.tags,
        expiration: pasteData.expiresAt
      });
      
      // Reload recent pastes to include the new one
      get().loadRecentPastes();
      
      return response.id;
    } catch (error) {
      console.error('Failed to create paste:', error);
      throw error; // Re-throw to let the component handle the error
    }
  },

  updatePaste: (id, updates) => {
    set((state) => ({
      pastes: state.pastes.map((paste) =>
        paste.id === id
          ? { ...paste, ...updates, updatedAt: new Date().toISOString() }
          : paste
      ),
    }));
  },

  deletePaste: (id) => {
    set((state) => ({
      pastes: state.pastes.filter((paste) => paste.id !== id),
    }));
  },

  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stars: 0,
      forks: 0,
      issues: [],
      milestones: [],
    };
    set((state) => ({ projects: [newProject, ...state.projects] }));
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      ),
    }));
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    }));
  },

  addIssue: (issueData) => {
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    set((state) => ({ issues: [newIssue, ...state.issues] }));
  },

  updateIssue: (id, updates) => {
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id
          ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
          : issue
      ),
    }));
  },

  deleteIssue: (id) => {
    set((state) => ({
      issues: state.issues.filter((issue) => issue.id !== id),
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  },
}));