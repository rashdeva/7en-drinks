import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Countdown from "react-countdown";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { drinkWaterCup } from "~/db/api";
import { useUserStore } from "~/db/userStore";
import { CheckIcon } from "lucide-react";
import { useBackButton } from "@telegram-apps/sdk-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn, getPluralForm } from "~/lib/utils";

const MAX_COUNT = 7;

// Mapping of drink counts to background images
const drinkImages = {
  1: '/assets/cup-filled.webp',
  2: '/assets/cup-filled.webp',
  3: '/assets/cup-filled.webp',
  4: '/assets/cup-filled.webp',
  5: '/assets/cup-filled.webp',
  6: '/assets/cup-filled.webp',
  7: '/assets/cup-filled.webp'
};
const getNextDrinkTime = (
  lastDrinkTime: Date | undefined,
  drinkCount: number
) => {
  if (!lastDrinkTime) return undefined;
  if (drinkCount < 2) return undefined;

  const currentDate = new Date();
  const isNewDay = lastDrinkTime.toDateString() !== currentDate.toDateString();

  if (isNewDay) {
    return undefined;
  }

  const nextDrinkTime = new Date(lastDrinkTime.getTime() + 2 * 60 * 60 * 1000);
  return nextDrinkTime > new Date() ? nextDrinkTime : undefined;
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
  }, [user.isOnboarded]);

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

  const handleDrink = useCallback(async () => {
    setButtonDisabled(true);
    await drinkMutation.mutateAsync();
    setButtonDisabled(false);
  }, []);

  const nextDrinkTime = useMemo(
    () => getNextDrinkTime(user.lastDrinkTime, user.drinkCount),
    [user.lastDrinkTime]
  );
  const canDrink = user.drinkCount < 4 && !nextDrinkTime;

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

  const handleComplete = () => {
    patchUser({
      drinkCount: 0,
      lastDrinkTime: undefined,
    });
    setButtonDisabled(false);
  };

  return (
    <Card
      ref={cardRef}
      className="pt-5 pb-2 flex-1 flex flex-col justify-between items-center relative overflow-hidden"
      style={{
        backgroundImage: "url(/assets/cup.webp)",
        backgroundSize: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {user.drinkCount > 0 && (
        <motion.div
          className={cn("absolute top-0 left-0 right-0 bottom-0")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `url(${drinkImages[user.drinkCount as keyof typeof drinkImages] || drinkImages[1]})`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></motion.div>
      )}
      <div className="space-y-6 relative z-10">
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
        <div className="flex flex-col items-center gap-3 mt-10">
          <div className="relative">
            {user.drinkCount === MAX_COUNT && (
              <CheckIcon className="absolute top-3.5 left-3" />
            )}
          </div>
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
        <Button
          className="bg-[#71C8FF] text-xl px-12 h-12 font-normal text-foreground w-44"
          onClick={handleDrink}
          disabled={!canDrink || isButtonDisabled}
        >
          {nextDrinkTime ? (
            <Countdown
              date={nextDrinkTime}
              onComplete={handleComplete}
              renderer={({ hours, minutes, seconds }) => (
                <span>
                  {String(hours).padStart(2, "0")}:
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              )}
            />
          ) : (
            <span>{t("drink")}</span>
          )}
        </Button>
        {user.drinkCount === 4 ? (
          <img src="/assets/goggles.webp" width={132} alt="" />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              showPoints ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.5 }}
          >
            <strong>+50 {t("points")}</strong>
          </motion.div>
        )}
      </footer>
    </Card>
  );
};
