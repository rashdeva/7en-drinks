import { z, ZodTypeAny } from "zod";

const nullableToUndefined = <T extends ZodTypeAny>(schema: T) => {
  return schema
    .nullable()
    .transform((value) => (value === null ? undefined : value));
};

export const userSchema = z.object({
  created_at: z.string().optional(),
  first_name: nullableToUndefined(z.string().nullable()),
  id: z.number().optional(),
  language_code: nullableToUndefined(z.string().nullable()),
  last_name: nullableToUndefined(z.string().nullable()),
  photo: nullableToUndefined(z.string().nullable()),
  telegram_id: nullableToUndefined(z.number().nullable()),
  username: nullableToUndefined(z.string().nullable()),
});

export const eventSchema = z.object({
  id: z.number(),
  comment: z.string().optional(),
  description: z.string(),
  end_date: z.string(),
  event_type: z.string().optional(),
  location: z.string(),
  max_participants: z.preprocess((val) => Number(val), z.number()).optional(),
  owner_id: z.string(),
  price: z.preprocess((val) => Number(val), z.number()).optional(),
  start_date: z.string(),
  thumbnail_url: z.string().optional(),
  title: z.string(),
});

export const eventParticipateSchema = z.object({
  event_id: z.string(),
  user_id: z.string(),
  payment_method: z.string(),
});
