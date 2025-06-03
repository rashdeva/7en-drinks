import { useUtils } from "@telegram-apps/sdk-react";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { completeQuest } from "~/db/api";
import { useQuestStore } from "~/db/questStore";
import { Quest } from "./quest";
import { useTranslation } from "react-i18next";
import { useCompleteConfetti } from "~/hooks/useConfetti";
import { QuestDto } from "../models";
import { toast } from "~/components/ui/use-toast";
import { generateNotifyFriendTelegramUrl } from "~/modules/referrals/utils";
import { getUserFullName } from "~/lib/utils";
import { useUserStore } from "~/db/userStore";

export type QuestProps = QuestDto & {};

export const NotifyFriendQuest = (props: QuestProps) => {
  const { t } = useTranslation();
  const { name, _id: id, tokens } = props;
  const user = useUserStore((state) => state.user);
  const patchQuest = useQuestStore((state) => state.patchQuest);
  const confetti = useCompleteConfetti();
  const utils = useUtils();

  const completeMutation = useMutation({
    mutationFn: completeQuest,
    onSuccess: () => {
      patchQuest(id, {
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

    const notifyShare = generateNotifyFriendTelegramUrl(
      user.id,
      t("notify_friend_text", { name: getUserFullName(user) })
    );

    let quests = JSON.parse(localStorage.getItem("quests") || "[]");
    quests = quests.filter((q: any) => q.id !== id);
    quests.push(questData);
    localStorage.setItem("quests", JSON.stringify(quests));

    utils.openTelegramLink(notifyShare);
  }, [utils, name, id, completeMutation, user]);

  const handleComplete = useCallback(() => {
    const quests = JSON.parse(localStorage.getItem("quests") || "[]");
    const quest = quests.find((q: any) => q.id === id);

    if (quest) {
      completeMutation.mutate({
        id,
      });

      localStorage.setItem(
        "quests",
        JSON.stringify(quests.filter((q: any) => q.id !== id))
      );
    } else {
      toast({
        variant: "destructive",
        title: t("quest_error_failed"),
      });
    }
  }, [completeMutation, id]);

  useEffect(() => {
    patchQuest(id, {
      completed: false,
    });
  }, [id]);

  return (
    <Quest
      {...props}
      onOpen={handleOpen}
      onComplete={handleComplete}
      actionText="quests.action_notify_friend"
      checkText="quests.check"
    />
  );
};
