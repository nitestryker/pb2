import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Apply theme to document immediately
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);
          }
          return { theme: newTheme };
        });
      },
      
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document immediately
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(theme);
        }
      },
    }),
    {
      name: 'pasteforge-theme',
      onRehydrateStorage: () => (state) => {
        // Apply theme to document when store is rehydrated
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(state.theme);
        }
      },
    }
  )
);

// Initialize theme on store creation
if (typeof document !== 'undefined') {
  const store = useThemeStore.getState();
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(store.theme);
}