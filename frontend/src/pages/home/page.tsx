import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "~/components/ui/card";
import { drinkWaterCup } from "~/db/api";
import { useUserStore } from "~/db/userStore";
import { CheckIcon } from "lucide-react";
import { useBackButton } from "@telegram-apps/sdk-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn, getPluralForm } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Vortex } from "~/components/ui/vortex";
import { InviteFriend } from "~/modules/referrals/components/invite-friend";
import { useQuestStore } from "~/db/questStore";
import { QuestList } from "~/modules/quests/components/quest-list";

const MAX_COUNT = 7;

// Mapping of drink counts to background positions for the sprite sheet
const drinkPositions = {
  0: "-24px 0%", // First cup state
  1: "-202px 0%", // Second cup state
  2: "-380px 0%", // Third cup state
  3: "-556px 0%", // Fourth cup state
  4: "-732px 0%", // Fifth cup state
  5: "-906px 0%", // Sixth cup state
  6: "-1080px 0%", // Seventh cup state
  7: "-1080px 0%", // Seventh cup state
};

export const DrinkPage = () => {
  const bb = useBackButton();
  const { t } = useTranslation();
  const [user, patchUser] = useUserStore((state) => [
    state.user,
    state.patchUser,
  ]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isOnboarded) {
      navigate("/onboarding");
    }
  }, [user.isOnboarded, navigate]);

  const drinkMutation = useMutation({
    mutationFn: drinkWaterCup,
    onSuccess: (data) => {
      patchUser({
        drinkCount: data.drink_count,
        lastDrinkTime: data.last_drink_time
          ? new Date(data.last_drink_time)
          : undefined,
        balance: data.balance,
      });
      setShowPoints(true);
      setTimeout(() => {
        setShowPoints(false);
      }, 3000);
    },
  });

  const canDrink = user.drinkCount < MAX_COUNT;

  const handleDrink = useCallback(async () => {
    if (!canDrink || isButtonDisabled) {
      return;
    }

    // Add delay before making API call
    await new Promise((resolve) => setTimeout(resolve, 150));
    await drinkMutation.mutateAsync();
  }, [drinkMutation, canDrink, isButtonDisabled]);

  useEffect(() => {
    if (user.lastDrinkTime) {
      const currentDate = new Date().toDateString();
      const lastDate = new Date(user.lastDrinkTime).toDateString();

      if (lastDate !== currentDate) {
        patchUser({
          drinkCount: 0,
          lastDrinkTime: user.lastDrinkTime,
        });
        setButtonDisabled(false);
      }
    }
  }, [user.lastDrinkTime, patchUser]);

  useEffect(() => {
    if (bb) {
      bb.hide();
    }
  }, [bb]);

  const quests = useQuestStore((state) => state.quests);

  return (
    <>
      <Card
        ref={cardRef}
        className="pt-5 z-20 bg-transparent text-white pb-2 flex-1 flex flex-col justify-center items-center relative overflow-hidden"
      >
        <div className="space-y-6 relative flex flex-col items-center z-10">
          <header className="text-center">
            <h2 className="text-2xl font-bold">
              {user.drinkCount === MAX_COUNT
                ? t("drink_water_success", {
                    cups: getPluralForm(
                      user.drinkCount,
                      t("cup"),
                      t("cup_few"),
                      t("cup_many")
                    ),
                  })
                : t("drink_water")}
            </h2>
            {user.drinkCount !== MAX_COUNT && (
              <span className="text-sm text-muted-foreground">
                {t("drink_water_times", {
                  value: MAX_COUNT,
                  cups: getPluralForm(
                    user.drinkCount,
                    t("cup"),
                    t("cup_few"),
                    t("cup_many")
                  ),
                })}
              </span>
            )}
          </header>
          {/* Current cup that scales and fades out when clicked */}
          <Button
            className="w-[190px] p-0 bg-transparent border-none h-[280px] relative mx-auto"
            onClick={handleDrink}
          >
            {Array.from({ length: MAX_COUNT + 1 }).map((_, index) => (
              <div
                key={`cup-${index}`}
                className={cn(
                  "w-[190px] h-[280px] mx-auto absolute top-0 opacity-0 left-0 transition-all duration-700 cursor-pointer",
                  index === user.drinkCount && "opacity-100",
                  index === user.drinkCount + 1 && "opacity-0 scale-50",
                  index === user.drinkCount - 1 &&
                    "opacity-0 scale-[200%] duration-500"
                )}
                style={{
                  backgroundImage: `url(/assets/cups.avif)`,
                  backgroundSize: "1300px",
                  backgroundPosition:
                    drinkPositions[index as keyof typeof drinkPositions],
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            ))}
          </Button>

          <div className="flex justify-center items-center gap-3">
            {user.drinkCount === MAX_COUNT && (
              <CheckIcon className=" top-3.5 left-3" />
            )}
            <div className="text-xl font-bold">
              {user.drinkCount || 0}/{MAX_COUNT}{" "}
              {getPluralForm(
                user.drinkCount,
                t("cup"),
                t("cup_few"),
                t("cup_many")
              )}
            </div>
          </div>
        </div>
        <footer className="text-primary-foreground text-xl font-medium flex flex-col items-center relative z-10">
          {user.drinkCount === MAX_COUNT ? (
            <img src="/assets/goggles.webp" width={132} alt="" />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                showPoints
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.5 }}
            >
              <strong>+50 {t("points")}</strong>
            </motion.div>
          )}
        </footer>
      </Card>
      <Card className="space-y-3 bg-blue-600/20 backdrop-blur-lg mt-6 z-20 p-3 w-full overflow-hidden flex flex-col justify-start">
        <h2 className="text-base font-bold">{t("referral_link")}</h2>
        <InviteFriend />
        <p className="text-sm">
          {t("invited_already", {
            value: user.referrals.length,
            friends: getPluralForm(
              user.referrals.length,
              t("friend"),
              t("friend_few"),
              t("friend_many")
            ),
          })}
          <br />
          <span>{t("invite_info", { value: 7 })}</span>
        </p>
      </Card>

      <QuestList quests={quests.filter((q) => q.hidden !== true)} />
      <div className="fixed top-0 bottom-0 z-10 right-0 left-0">
        <Vortex className="" />
      </div>
    </>
  );
};
