import { create } from "zustand";
import { useUserStore } from "./userStore";
import { QuestDto } from "~/modules/quests/models";

export interface QuestStore {
  quests: QuestDto[];

  getQuest: (questId: string) => QuestDto | undefined;
  setQuests: (quests: QuestDto[]) => void;
  patchQuest: (questId: string, questPartial: Partial<QuestDto>) => void;
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: [],
  getQuest: (questId) => {
    return get().quests.find((q) => q._id === questId);
  },

  patchQuest: (questId, questPartial) => {
    set((state) => {
      const quests = [...state.quests];
      const index = quests.findIndex((q) => q._id === questId);
      
      if (index !== -1) {
        quests[index] = {
          ...quests[index],
          ...questPartial,
        };

        useUserStore.getState().updateBalance(questPartial.tokens!);
      }

      return {
        ...state,
        quests
      };
    });
  },

  setQuests: (quests) => {
    set(() => ({
      quests: quests,
    }));
  },
}));
