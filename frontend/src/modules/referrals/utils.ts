import { config } from "~/config";
import { UserModel } from "~/db/models";

export function generateReferralTelegramUrl(userId: number, text: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(
    `https://t.me/${config.botName}/onboarding?startapp=${userId.toString()}`
  );
  return `https://t.me/share/url?text=${encodedText}&url=${encodedUrl}`;
}

export function generateNotifyFriendTelegramUrl(userId: number, text: string) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(
    `https://t.me/${config.botName}/onboarding?startapp=${userId.toString()}`
  );
  return `https://t.me/share/url?text=${encodedText}&url=${encodedUrl}`;
}

export function generateReferralUrl(user: UserModel) {
  return `https://t.me/${config.botName}/onboarding?startapp=${user.id.toString()}`;
}
