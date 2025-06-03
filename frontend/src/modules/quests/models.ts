export type QuestDto = {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  partner?: string;
  type: "channel" | "link" | "inviteFriend" | "notifyFriend" | "drinkWater";
  value: string;
  tokens: number;
  completed: boolean;
  disabled: boolean;
  order: number;
  hidden: boolean;
};
