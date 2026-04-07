import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gistService } from './services/gistService';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';

export interface Quest {
  id: string;
  title: string;
  difficulty: Difficulty;
  completed: boolean;
  createdAt: number;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
}

export interface UserStats {
  level: number;
  xp: number;
  gold: number;
  questsCompleted: number;
  completedDates: Record<string, number>;
}

interface QuestStore {
  quests: Quest[];
  rewards: Reward[];
  stats: UserStats;
  
  token: string | null;
  gistId: string | null;
  githubUser: any | null;
  isSyncing: boolean;
  isLoaded: boolean;

  login: (token: string) => Promise<void>;
  logout: () => void;
  triggerSync: () => void;
  
  addQuest: (title: string, difficulty: Difficulty) => void;
  completeQuest: (id: string) => void;
  deleteQuest: (id: string) => void;
  addReward: (title: string, cost: number) => void;
  buyReward: (id: string) => void;
  deleteReward: (id: string) => void;
}

export const DIFFICULTY_MULTIPLIER: Record<Difficulty, { xp: number; gold: number }> = {
  Easy: { xp: 10, gold: 5 },
  Medium: { xp: 25, gold: 15 },
  Hard: { xp: 50, gold: 30 },
  Epic: { xp: 100, gold: 75 },
};

export const getXpForNextLevel = (level: number) => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

const debouncedSync = debounce(async (token: string, gistId: string, data: any) => {
  useQuestStore.setState({ isSyncing: true });
  try {
    await gistService.updateSaveGist(token, gistId, data);
  } catch (e) {
    console.error("Failed to sync", e);
  } finally {
    useQuestStore.setState({ isSyncing: false });
  }
}, 2000);

const defaultState = {
  quests: [],
  rewards: [],
  stats: {
    level: 1,
    xp: 0,
    gold: 0,
    questsCompleted: 0,
    completedDates: {},
  },
  gistId: null,
  githubUser: null,
  isSyncing: false,
  isLoaded: false,
};

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      token: null,

      login: async (token: string) => {
        try {
          const user = await gistService.authenticate(token);
          set({ token, githubUser: user, isLoaded: false });
          
          const savedData = await gistService.getSaveData(token);
          if (savedData) {
            set({
              gistId: savedData.gistId,
              quests: savedData.data.quests || [],
              rewards: savedData.data.rewards || [],
              stats: { ...defaultState.stats, ...savedData.data.stats },
              isLoaded: true
            });
          } else {
            const initialData = {
              quests: defaultState.quests,
              rewards: defaultState.rewards,
              stats: defaultState.stats
            };
            const newGistId = await gistService.createSaveGist(token, initialData);
            set({ gistId: newGistId, isLoaded: true });
          }
        } catch (error) {
          console.error("Login failed", error);
          set({ token: null, githubUser: null });
          throw error;
        }
      },

      logout: () => {
        set({ ...defaultState, token: null });
      },

      triggerSync: () => {
        const state = get();
        if (state.token && state.gistId && state.isLoaded) {
          debouncedSync(state.token, state.gistId, {
            quests: state.quests,
            rewards: state.rewards,
            stats: state.stats
          });
        }
      },

      addQuest: (title, difficulty) => {
        set((state) => ({
          quests: [
            ...state.quests,
            {
              id: crypto.randomUUID(),
              title,
              difficulty,
              completed: false,
              createdAt: Date.now(),
            },
          ],
        }));
        get().triggerSync();
      },

      completeQuest: (id) => {
        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (!quest || quest.completed) return state;

          const rewards = DIFFICULTY_MULTIPLIER[quest.difficulty];
          let newXp = state.stats.xp + rewards.xp;
          let newLevel = state.stats.level;
          let xpForNextLevel = getXpForNextLevel(newLevel);

          while (newXp >= xpForNextLevel) {
            newXp -= xpForNextLevel;
            newLevel++;
            xpForNextLevel = getXpForNextLevel(newLevel);
          }

          const today = new Date().toISOString().split('T')[0];
          const newCompletedDates = { ...state.stats.completedDates };
          newCompletedDates[today] = (newCompletedDates[today] || 0) + 1;

          return {
            quests: state.quests.map((q) =>
              q.id === id ? { ...q, completed: true } : q
            ),
            stats: {
              ...state.stats,
              level: newLevel,
              xp: newXp,
              gold: state.stats.gold + rewards.gold,
              questsCompleted: state.stats.questsCompleted + 1,
              completedDates: newCompletedDates,
            },
          };
        });
        get().triggerSync();
      },

      deleteQuest: (id) => {
        set((state) => ({
          quests: state.quests.filter((q) => q.id !== id),
        }));
        get().triggerSync();
      },

      addReward: (title, cost) => {
        set((state) => ({
          rewards: [
            ...state.rewards,
            {
              id: crypto.randomUUID(),
              title,
              cost,
            },
          ],
        }));
        get().triggerSync();
      },

      buyReward: (id) => {
        set((state) => {
          const reward = state.rewards.find((r) => r.id === id);
          if (!reward || state.stats.gold < reward.cost) return state;

          return {
            stats: {
              ...state.stats,
              gold: state.stats.gold - reward.cost,
            },
          };
        });
        get().triggerSync();
      },

      deleteReward: (id) => {
        set((state) => ({
          rewards: state.rewards.filter((r) => r.id !== id),
        }));
        get().triggerSync();
      },
    }),
    {
      name: 'questlog-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
