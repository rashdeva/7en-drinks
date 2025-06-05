import { useBack } from "~/hooks/useBack";
import { InviteFriend } from "~/modules/referrals/components/invite-friend";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUserStore } from "~/db/userStore";
import { getPluralForm, getUserFullName } from "~/lib/utils";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { Coins } from "~/components/coins";

export const ProfilePage = () => {
  useBack("/");
  const { t } = useTranslation();

  const { referrals } = useUserStore((state) => state.user);
  const user = useUserStore((state) => state.user);

  return (
    <main className="space-y-6 pb-8">
      <header className="space-y-3">
        <Avatar className="w-[60px] h-[60px]">
          <AvatarImage src={`https://unavatar.io/telegram/${user.username}`} />
          <AvatarFallback>
            <img src="/assets/goggles.webp" alt="" />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl -space-y-2 overflow-hidden pt-1 font-secimbold">
          <span className="text-primary-foreground">{t("hello")},</span>{" "}
          <span className="truncate inline-block max-w-full align-bottom">
            {getUserFullName(user)}
          </span>
        </h1>
        <Card>
          <CardContent className="pt-2">
            <span className="text-muted-foreground">{t("points_title")}</span>
            <h1>
              <Coins disablePlus className="text-3xl text-foreground" value={user.balance}></Coins>
            </h1>
            <p className="mt-7">
              {t("today_drank", {
                value: user.drinkCount,
                cups: getPluralForm(
                  user.drinkCount,
                  t("cup"),
                  t("cup_few"),
                  t("cup_many")
                ),
              })}
            </p>
            <p className="text-muted-foreground">
              {t("total_drank", {
                value: user.totalDrink,
                cups: getPluralForm(
                  user.totalDrink,
                  t("cup"),
                  t("cup_few"),
                  t("cup_many")
                ),
              })}
            </p>
          </CardContent>
        </Card>
      </header>
      <section className="space-y-3">
        <h2 className="text-3xl font-bold">{t("referral_link")}</h2>
        <InviteFriend />
        <p className="text-base">
          {t("invited_already", {
            value: referrals.length,
            friends: getPluralForm(
              referrals.length,
              t("friend"),
              t("friend_few"),
              t("friend_many")
            ),
          })}
          {referrals.length === 0 ? "(" : ""} <br />
          <span>{t("invite_info", { value: 7 })}</span>
        </p>
      </section>
      <section className="space-y-1">
        <h2 className="text-3xl font-bold">{t("airdrop_soon")}</h2>
        <div className="flex justify-center">
          <img
            src="/assets/flippers.webp"
            className="h-[287px] -mb-16 -mt-[90px]"
            alt=""
          />
        </div>
        <Link
          to={"/faq"}
          className="underline text-muted-foreground py-2 inline-block"
        >
          {t("airdrop_read")}
        </Link>
      </section>
      <section className="space-y-2">
        <Link to={"/faq"}>
          <h2 className="text-3xl font-bold flex justify-between items-center">
            <span>{t("faq")}</span>
            <ChevronRight
              className="h-8 w-8 shrink-0 transition-transform duration-200"
              strokeWidth={1}
            />
          </h2>
        </Link>
      </section>
    </main>
  );
};
