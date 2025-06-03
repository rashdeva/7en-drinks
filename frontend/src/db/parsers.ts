import { ReferralDto, UserDto } from "./dto";
import {
  ParticipantDto,
  ParticipantModel,
  ProfessionModel,
  ReferralModel,
  UserModel,
} from "./models";

export const parseReferral = (referral: ReferralDto): ReferralModel => {
  return {
    _id: referral._id,
    username: referral.username,
    firstName: referral.first_name,
    lastName: referral.last_name,
    balance: referral.balance,
  };
};

export const parsePracice = (practice: any): any => {
  return {
    id: practice._id,
    name: practice.name,
    category: practice.category,
    i18n: practice.i18n,
  };
};

export const parseCategory = (category: any): any => {
  return {
    id: category._id,
    name: category.name,
    i18n: category.i18n,
  };
};

export const parseProfession = (profession: any): ProfessionModel => {
  return {
    id: profession._id,
    name: profession.name,
    category: profession.category,
    i18n: profession.i18n,
  };
};

export const parseCity = (city: any): any => {
  return {
    id: city.id,
    city: city.city,
    coordinates: city.coordinates,
  };
};

export const parseUser = (user: UserDto): UserModel => {
  return {
    ...user,
    id: user.id || 0,
    _id: user._id || undefined,
    firstName: user.first_name || "",
    lastName: user.last_name,
    languageCode: user.language_code,
    username: user.username,
    thumbnailUrl: user.thumbnail_url,

    balance: user.balance || 0,
    drinkCount: user.drink_count || 0,
    totalDrink: user.total_drink || 0,

    isOnboarded: user.is_onboarded || false,

    lastDrinkTime: user.last_drink_time
      ? new Date(user.last_drink_time)
      : undefined,

    drinks: user.drinks,
    referrals: user.referrals.map(parseReferral),
    quests: user.quests,
    questsCompletedTimestamps: user.quests_completed_timestamps,
    passedCombos: user.passed_combos
  };
};

export const parseParticipant = (
  participant: ParticipantDto
): ParticipantModel => {
  return {
    userId: participant.user_id,
    eventId: participant.event_id,
  };
};
