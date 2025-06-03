import { z } from "zod";

export const questSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  nameEn: z.string().min(1, "Название EN обязательно"),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  type: z.enum([
    "channel",
    "link",
    "inviteFriend",
    "notifyFriend",
    "drinkWater",
  ]).optional(),
  value: z.string().optional(),
  tokens: z.union([
    z.string().min(1, "Tokens must be greater than 0"),
    z.number().min(1, "Tokens must be greater than 0"),
  ]).optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
});

export type QuestFormData = z.infer<typeof questSchema>;
