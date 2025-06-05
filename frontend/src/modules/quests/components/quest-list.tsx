import { QuestDto } from "../models";
import { ChannelQuest } from "./channel-quest";
import { InviteFriendQuest } from "./invite-friend-quest";
import { LinkQuest } from "./link-quest";
import { NotifyFriendQuest } from "./notify-friend-quest";
import { useTranslation } from "react-i18next";

const questByType = {
  channel: ChannelQuest,
  link: LinkQuest,
  inviteFriend: InviteFriendQuest,
  notifyFriend: NotifyFriendQuest,
  drinkWater: ChannelQuest,
};

export const QuestList = ({ quests }: { quests: QuestDto[] }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 relative mt-4 bg-blue-600/20 backdrop-blur-lg rounded-md p-3 z-20">
      <h2 className="text-base font-bold text-white">{t("quests.title")}</h2>
      {quests.map((quest: QuestDto) => {
        if (!quest.type) return <></>;

        const QuestByType = questByType[quest.type];
        return <QuestByType key={quest._id} {...quest} />;
      })}
    </div>
  );
};
