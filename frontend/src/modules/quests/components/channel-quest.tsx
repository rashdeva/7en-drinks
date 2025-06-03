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

export const ChannelQuest = (props: QuestProps) => {
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
        variant: 'destructive',
        title: t(error.message),
      });
    }
  });

  

  const handleComplete = useCallback(async () => {
    return completeMutation.mutate({
      id,
    });
  }, [completeMutation, id]);

  const handleOpen = useCallback(async () => {
    const questData = {
      name: name || "unknown",
      date: new Date().toISOString(),
      id: id,
    };

    const quests = JSON.parse(localStorage.getItem("quests") || "[]");

    quests.push(questData);
    localStorage.setItem("quests", JSON.stringify(quests));

    if (value.indexOf("t.me") > 0) {
      utils.openTelegramLink(value);
    } else {
      utils.openLink(value);
    }
  }, [utils, name, value, id]);

  return <Quest {...props} onOpen={handleOpen} onComplete={handleComplete} />;
};
