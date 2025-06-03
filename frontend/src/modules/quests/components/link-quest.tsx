import { useUtils } from "@telegram-apps/sdk-react";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { completeQuest } from "~/db/api";
import { useQuestStore } from "~/db/questStore";
import { Quest } from "./quest";
import { useTranslation } from "react-i18next";
import { useCompleteConfetti } from "~/hooks/useConfetti";
import { QuestDto } from "../models";
import { toast } from "~/components/ui/use-toast";

export type QuestProps = QuestDto & {};

export const LinkQuest = (props: QuestProps) => {
  const { t } = useTranslation();
  const { value, name, _id: id, tokens } = props;
  const patchQuest = useQuestStore((state) => state.patchQuest);
  const confetti = useCompleteConfetti();
  const utils = useUtils();

  const completeMutation = useMutation({
    mutationFn: completeQuest,
    onSuccess: () => {
      patchQuest(id, {
        completed: true,
        tokens,
      });
      confetti();
      toast({
        title: t("quest_completed"),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: t(error.message),
      });
    },
  });

  const handleOpen = useCallback(async () => {
    const questData = {
      name: name || "unknown",
      date: new Date().toISOString(),
      id: id,
    };

    let quests = JSON.parse(localStorage.getItem("quests") || "[]");
    quests = quests.filter((q: any) => q.id !== id);
    quests.push(questData);
    localStorage.setItem("quests", JSON.stringify(quests));

    if (value.indexOf("t.me") > 0) {
      utils.openTelegramLink(value);
    } else {
      utils.openLink(value);
    }
  }, [utils, value, name, id, completeMutation, id]);

  const handleComplete = useCallback(() => {
    const quests = JSON.parse(localStorage.getItem("quests") || "[]");
    const quest = quests.find((q: any) => q.id === id);

    if (quest) {
      completeMutation.mutate({
        id,
      });
    } else {
      toast({
        variant: "destructive",
        title: t("quest_error_failed"),
      });
    }
  }, [completeMutation, id]);

  return (
    <Quest
      {...props}
      onOpen={handleOpen}
      onComplete={handleComplete}
      actionText="quests.action_open_link"
      checkText="quests.check"
    />
  );
};
