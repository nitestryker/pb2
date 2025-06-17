import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AISummary } from '../types';

interface AIState {
  summaries: AISummary[];
  settings: {
    enabled: boolean;
    dailyLimit: number;
    autoGenerate: boolean;
    requireApproval: boolean;
    preferredModel: string;
  };
  usage: {
    dailyRequests: number;
    totalTokens: number;
    lastReset: string;
  };
  
  // Actions
  addSummary: (summary: AISummary) => void;
  approveSummary: (id: string) => void;
  rejectSummary: (id: string) => void;
  updateSettings: (settings: Partial<AIState['settings']>) => void;
  incrementUsage: (tokens: number) => void;
  resetDailyUsage: () => void;
  getPendingSummaries: () => AISummary[];
  getApprovedSummaries: () => AISummary[];
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      summaries: [],
      settings: {
        enabled: true,
        dailyLimit: 100,
        autoGenerate: false,
        requireApproval: true,
        preferredModel: 'GPT-4'
      },
      usage: {
        dailyRequests: 0,
        totalTokens: 0,
        lastReset: new Date().toISOString()
      },

      addSummary: (summary) => {
        set((state) => ({
          summaries: [summary, ...state.summaries]
        }));
      },

      approveSummary: (id) => {
        set((state) => ({
          summaries: state.summaries.map(summary =>
            summary.id === id ? { ...summary, approved: true } : summary
          )
        }));
      },

      rejectSummary: (id) => {
        set((state) => ({
          summaries: state.summaries.filter(summary => summary.id !== id)
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      incrementUsage: (tokens) => {
        const now = new Date();
        const { usage } = get();
        const lastReset = new Date(usage.lastReset);
        
        // Reset if it's a new day
        const shouldReset = now.getDate() !== lastReset.getDate() ||
                          now.getMonth() !== lastReset.getMonth() ||
                          now.getFullYear() !== lastReset.getFullYear();
        
        if (shouldReset) {
          set({
            usage: {
              dailyRequests: 1,
              totalTokens: tokens,
              lastReset: now.toISOString()
            }
          });
        } else {
          set((state) => ({
            usage: {
              ...state.usage,
              dailyRequests: state.usage.dailyRequests + 1,
              totalTokens: state.usage.totalTokens + tokens
            }
          }));
        }
      },

      resetDailyUsage: () => {
        set({
          usage: {
            dailyRequests: 0,
            totalTokens: 0,
            lastReset: new Date().toISOString()
          }
        });
      },

      getPendingSummaries: () => {
        return get().summaries.filter(summary => !summary.approved);
      },

      getApprovedSummaries: () => {
        return get().summaries.filter(summary => summary.approved);
      }
    }),
    {
      name: 'pasteforge-ai'
    }
  )
);