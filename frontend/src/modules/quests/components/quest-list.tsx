import { QuestDto } from "../models";
import { ChannelQuest } from "./channel-quest";
import { InviteFriendQuest } from "./invite-friend-quest";
import { LinkQuest } from "./link-quest";
import { NotifyFriendQuest } from "./notify-friend-quest";

const questByType = {
  channel: ChannelQuest,
  link: LinkQuest,
  inviteFriend: InviteFriendQuest,
  notifyFriend: NotifyFriendQuest,
  drinkWater: ChannelQuest,
};

export const QuestList = ({ quests }: { quests: QuestDto[] }) => {
  return (
    <div className="space-y-3">
      {quests.map((quest: QuestDto) => {
        if (!quest.type) return <></>;

        const QuestByType = questByType[quest.type];
        return <QuestByType key={quest._id} {...quest} />;
      })}
    </div>
  );
};
