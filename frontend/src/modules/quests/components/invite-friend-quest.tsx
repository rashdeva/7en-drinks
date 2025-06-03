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
import { useUserStore } from "~/db/userStore";
import { generateReferralTelegramUrl } from "~/modules/referrals/utils";
import { getUserFullName } from "~/lib/utils";

export type QuestProps = QuestDto & {};

export const InviteFriendQuest = (props: QuestProps) => {
  const { t } = useTranslation();
  const { name, _id: id, tokens } = props;
  const patchQuest = useQuestStore((state) => state.patchQuest);
  const user = useUserStore((state) => state.user);
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

  const handleComplete = useCallback(() => {
    completeMutation.mutate({
      id,
    });
  }, [completeMutation, id]);

  const handleOpen = useCallback(async () => {
    const questData = {
      name: name || "unknown",
      date: new Date().toISOString(),
      id: id,
    };

    const referralShare = generateReferralTelegramUrl(
      user.id,
      t("invite_friend_text", { name: getUserFullName(user) })
    );

    const quests = JSON.parse(localStorage.getItem("quests") || "[]");

    quests.push(questData);
    localStorage.setItem("quests", JSON.stringify(quests));

    utils.openTelegramLink(referralShare);
  }, [utils, name, id]);

  return (
    <Quest
      {...props}
      onOpen={handleOpen}
      onComplete={handleComplete}
      actionText="quests.action_invite_friend"
      checkText="quests.action_invite_friend_check"
    />
  );
};
