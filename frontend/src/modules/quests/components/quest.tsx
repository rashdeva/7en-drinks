import { CheckCircle, XIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useHapticFeedback } from "@telegram-apps/sdk-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { Coins } from "~/components/coins";
import { QuestDto } from "../models";

export type QuestProps = QuestDto & {
  onOpen: () => void;
  onComplete?: () => void;
  tokens: number;
  actionText?: string;
  checkText?: string;
};

export const Quest = ({
  tokens,
  completed,
  disabled,
  name,
  description,
  actionText = "quests.action_subscribe",
  checkText = "quests.action_subscribe_check",
  onOpen,
  onComplete,
}: QuestProps) => {
  const { t } = useTranslation();
  const haptic = useHapticFeedback();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = useCallback(() => {
    haptic.impactOccurred("light");
    setDrawerOpen(true);
  }, [haptic, setDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    haptic.impactOccurred("light");
    setDrawerOpen(false);
  }, [haptic]);

  const handleComplete = useCallback(async () => {
    if (onComplete) {
      try {
        await onComplete();
        setDrawerOpen(false);
      } catch (e) {
        console.log(e);
      }
    }
  }, [onComplete]);

  return (
    <>
      <Card
        className={cn(
          completed &&
            "opacity-50 pointer-events-none border-2 border-primary shadow-none",
          disabled && "opacity-50 pointer-events-none",
          'bg-black/20 px-3 pt-1.5 pb-1'
        )}
        onClick={handleDrawerOpen}
      >
        <div className="flex-1">{t(name)}</div>

        {!completed && (
          <span className="text-white/50">
            <Coins value={tokens} />
          </span>
        )}
        {completed && <CheckCircle className="w-4 h-4 text-primary" />}
      </Card>
      <Drawer open={drawerOpen} onClose={handleDrawerClose}>
        <DrawerContent>
          <DrawerClose
            onClick={handleDrawerClose}
            className="rounded-full bg-white/10 w-7 h-7 flex items-center justify-center absolute top-4 right-4"
          >
            <XIcon className="w-4 h-4" />
          </DrawerClose>
          <DrawerHeader className="flex flex-col items-center">
            <img src="/assets/goggles.webp" width={150} alt="" />
            <DrawerTitle>{t(name)}</DrawerTitle>
            <p className="text-sm">{t(description)}</p>
            <Coins value={tokens} />
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4 pt-0">
            <Button className="" onClick={onOpen}>
              {t(actionText)}
            </Button>
            {onComplete !== undefined && (
              <Button className="" variant="secondary" onClick={handleComplete}>
                {t(checkText)}
              </Button>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
