import { create } from "zustand";

export interface AuthStore {
  accessToken?: string;
  bubbleGameToken?: string;
  setAccessToken: (accessToken: string) => void;
  setBubbleGameToken: (bubbleGameToken: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: undefined,
  bubbleGameToken: undefined,

  setAccessToken: (accessToken) => {
    set(() => ({
      accessToken,
    }));
  },
  
  setBubbleGameToken: (bubbleGameToken) => {
    set(() => ({
      bubbleGameToken,
    }));
  },
}));
