import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import API from '../api/axios'; 
import { User } from '../types/auth';

const initialState = {
  accessToken: null as string | null, 
  refreshToken: null as string | null,
  user: null as User | null,
};

type WebState = {
  accessToken: string | null; 
  refreshToken: string | null;
  user: User | null;
  setAccessToken: (accessToken: string | null) => void; 
  setRefreshToken: (refreshToken: string | null) => void;
  clearAccessToken: () => void; 
  clearRefreshToken: () => void;
  getAccessToken: () => string | null; 
  getRefreshToken: () => string | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  getUser: () => User | null;
  fetchUser: () => Promise<void>;
  clearAuth: () => void;
};

export const useWebStore = create<WebState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAccessToken: (accessToken) => set({ accessToken }), 
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearAccessToken: () => set({ accessToken: null }), 
      clearRefreshToken: () => set({ refreshToken: null }),
      getAccessToken: () => get().accessToken, 
      getRefreshToken: () => get().refreshToken,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      getUser: () => get().user,

      fetchUser: async () => {
        const accessToken = get().accessToken; 
        if (!accessToken) return;

        try {
          const response = await API.get('/auth/me');
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          set({ user: null, accessToken: null }); 
        }
      },

      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }), 
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
