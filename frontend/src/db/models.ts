import { User } from "@telegram-apps/sdk-react";

export type ParticipantDto = {
  user_id: number;
  event_id: number;
};

export type ProfessionModel = {
  id: number;
  name: string;
  category: string;
  i18n: string;
};

export type PassedCombo = {
  date: Date;
  status: "success" | "fail";
  combination?: number[];
};

export type UserModel = User & {
  _id?: string;
  thumbnailUrl?: string;
  name?: string;
  balance: number;

  role: "user" | "admin";

  isOnboarded?: boolean;

  drinks?: any[];
  drinkCount: number;
  totalDrink: number;
  quests: Array<number>;
  referrals: Array<any>;

  lastCheckIn?: Date | undefined;
  lastDrinkTime?: Date | undefined;
  questsCompletedTimestamps?: Record<string, number>;
  passedCombos: PassedCombo[];
};

export type UserRank = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  balance: number;
  rank: number;
}

export type ReferralModel = {
  _id: string;
  username?: string;
  firstName: string;
  lastName?: string;
  balance: number;
};

export type ParticipantModel = {
  userId: number;
  eventId: number;
};


export enum PaymentStatus {
  NEW = 'NEW',
  AUTHORIZED = 'AUTHORIZED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
  PARTIAL_REFUNDED = 'PARTIAL_REFUNDED',
  PENDING = 'PENDING',
}

export interface PaymentModel {
  _id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  user: string;
  masterAddress: string;
  userAddress: string;
  createdAt: string;
  updatedAt: string;
}
