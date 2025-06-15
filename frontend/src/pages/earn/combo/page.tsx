import React, { useCallback, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { ComboItem } from "./ui/item";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { XIcon } from "lucide-react";
import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { Coins } from "~/components/coins";
import { useCheckMutation } from "./hooks/useCheckMutation";
import { useUserStore } from "~/db/userStore";
import { isToday } from "date-fns"; // Utility function to check if date is today
import confetti from "canvas-confetti";
import { toast } from "~/components/ui/use-toast";

export const ComboPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [failOpen, setFailOpen] = useState<boolean>(false);
  const [userCombo, setUserCombo] = useState<number[]>([0, 0, 0]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false); // State to manage button disable
  const haptic = useHapticFeedback();
  const tokens = 500;
  const itemsCount = 10;

  const checkCombination = useCheckMutation();

  // Function to check if the user has passed today's combo
  const hasPassedToday = (passedCombos: { date: Date; status: string }[]) => {
    return passedCombos.some((combo) => isToday(new Date(combo.date)));
  };

  // Disable the button if the user has passed today
  useEffect(() => {
    if (user && user.passedCombos) {
      setIsButtonDisabled(hasPassedToday(user.passedCombos));
    }
  }, [user]);

  const handleItemChange = (
    blockIndex: number,
    direction: "up" | "down"
  ): void => {
    setUserCombo((prevCombo) => {
      const newCombo = [...prevCombo];
      if (direction === "up") {
        newCombo[blockIndex] = (newCombo[blockIndex] + 1) % itemsCount;
      } else {
        newCombo[blockIndex] =
          (newCombo[blockIndex] - 1 + itemsCount) % itemsCount;
      }
      return newCombo;
    });
  };

  const handleConfirm = useCallback(async () => {
    haptic.impactOccurred("light");
    const { success } = await checkCombination.mutateAsync(userCombo);

    if (success) {
      confetti();
      toast({
        title: t("combo_completed"),
      });

      setSuccessOpen(true);

      confetti();
      toast({
        title: t("combo_completed"),
      });
    } else {
      setFailOpen(true);
    }
  }, [haptic, userCombo]);

  const handleDrawerClose = useCallback(() => {
    haptic.impactOccurred("light");
    setSuccessOpen(false);
    setFailOpen(false);
  }, [haptic]);

  useEffect(() => {
    if (user && hasPassedToday(user.passedCombos)) {
      const lastCombo = user.passedCombos[user.passedCombos.length - 1];

      if (lastCombo?.combination) {
        setUserCombo(lastCombo?.combination);
      }
    }
  }, [user]);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-4 pb-8">
        {userCombo.map((value, index) => (
          <ComboItem
            key={index}
            value={value}
            onChange={(direction: "up" | "down") =>
              handleItemChange(index, direction)
            }
          />
        ))}
      </div>
      <Button
        onClick={handleConfirm}
        className="w-full"
        disabled={isButtonDisabled} // Disable the button if already passed today
      >
        {isButtonDisabled ? t("comboAlreadyPassed") : t("confirm")}
      </Button>

      <Drawer open={successOpen} onClose={handleDrawerClose}>
        <DrawerContent className="min-h-72">
          <DrawerClose
            onClick={handleDrawerClose}
            className="rounded-full bg-secondary w-7 h-7 flex items-center justify-center absolute top-4 right-4"
          >
            <XIcon className="w-4 h-4" />
          </DrawerClose>
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>
              <Coins value={tokens} className="text-foreground" />
            </DrawerTitle>
            <p className="text-sm">
              {t("comboSuccessDescription", { tokens })}
            </p>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleDrawerClose} className="w-full">
              {t("activateBonus")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={failOpen} onClose={handleDrawerClose}>
        <DrawerContent className="min-h-72">
          <DrawerClose
            onClick={handleDrawerClose}
            className="rounded-full bg-secondary w-7 h-7 flex items-center justify-center absolute top-4 right-4"
          >
            <XIcon className="w-4 h-4" />
          </DrawerClose>
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle>{t("comboFailTitle")}</DrawerTitle>
            <p className="text-sm">{t("comboFailDescription")}</p>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </section>
  );
};
