import { create } from "zustand";
import { UserModel } from "./models";

export interface UserStore {
  user: UserModel;
  isLoading: boolean;
  isNewUser: boolean;

  updateBalance: (tokens: number) => void;
  setBalance: (tokens: number) => void;
  patchUser: (userPartial: any) => void;

  setUser: (user: UserModel) => void;
  completeOnboarding: () => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  user: {
    id: 0,
    firstName: "",
    username: "undefined",
    languageCode: "",
    role: "user",
    balance: 0,
    referrals: [],
    quests: [],
    lastDrinkTime: undefined,
    drinkCount: 0,
    totalDrink: 0,
    isOnboarded: false,
    passedCombos: [],
  },
  isLoading: true,
  isNewUser: true,
  setUser: (user) => {
    set((state) => ({
      ...state,
      user,
      isLoading: false,
    }));
  },
  updateBalance: (tokens: number) => {
    if (!tokens) return;

    const balance = get().user.balance + tokens;

    set((state) => ({
      ...state,
      user: {
        ...state.user,
        balance,
      },
    }));
  },
  patchUser: (userPartial: any) => {
    set((state) => {
      return {
        ...state,
        user: {
          ...state.user,
          ...userPartial,
        },
      };
    });
  },
  setBalance: (tokens: number) => {
    if (!tokens) return;

    const balance = tokens;

    set((state) => ({
      ...state,
      user: {
        ...state.user,
        balance,
      },
    }));
  },
  completeOnboarding: () =>
    set((state) => ({
      ...state,
      isNewUser: false,
    })),
}));
