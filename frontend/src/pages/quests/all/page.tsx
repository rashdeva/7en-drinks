import { useBack } from "~/hooks/useBack";
import { useQuestStore } from "~/db/questStore";
import { QuestList } from "~/modules/quests/components/quest-list";

export const AllQuestsPage = () => {
  useBack("/");
  const quests = useQuestStore((state) => state.quests);

  return (
    <QuestList quests={quests.filter((q: any) => q.hidden !== true)} />
  );
};
