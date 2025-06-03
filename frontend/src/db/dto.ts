import { PassedCombo } from "./models";

export type UserDto = {
  _id?: string;
  id?: number | null;
  first_name: string;
  last_name?: string;
  username?: string;
  avatar?: string;
  language_code?: string;
  thumbnail_url?: string;
  name?: string;
  balance: number;
  quests: Array<any>;

  role: "user" | "admin";

  telegram?: any;
  last_drink_time?: string | undefined;
  drinks?: any[];
  drink_count: number;
  total_drink: number;

  is_onboarded?: boolean;

  referrals: Array<any>;
  referrer_id?: number;
  referrer_wallet?: string;
  referrer_mint_price?: string;
  quests_completed_timestamps: Record<string, number>;
  passed_combos: PassedCombo[];
};

export type ReferralDto = {
  _id: string;
  username?: string;
  first_name: string;
  last_name?: string;
  balance: number;
};
