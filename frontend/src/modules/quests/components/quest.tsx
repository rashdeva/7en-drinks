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
  actionText?: string,
  checkText?: string
};

export const Quest = ({
  tokens,
  completed,
  disabled,
  name,
  nameEn,
  description,
  descriptionEn,
  actionText = 'quests.action_subscribe',
  checkText = 'quests.action_subscribe_check',
  onOpen,
  onComplete,
}: QuestProps) => {
  const { t, i18n } = useTranslation();
  const haptic = useHapticFeedback();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = useCallback(() => {
    haptic.impactOccurred("light");
    setDrawerOpen(true);
  }, [haptic, setDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    haptic.impactOccurred("light");
    setDrawerOpen(false);
  }, [haptic, drawerOpen]);

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
          "overflow-hidden border-none flex p-2.5 items-center flex-row active:scale-95 shadow-none hover:shadow-xl transition-all cursor-pointer",
          completed &&
            "opacity-50 pointer-events-none border-2 border-primary shadow-none",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={handleDrawerOpen}
      >
        <div className="flex-1">{i18n.language === 'en' ? nameEn : name}</div>

        {!completed && (
          <span className="text-muted-foreground">
            <Coins value={tokens} />
          </span>
        )}
        {completed && <CheckCircle className="w-4 h-4 text-primary" />}
      </Card>
      <Drawer open={drawerOpen} onClose={handleDrawerClose}>
        <DrawerContent>
          <DrawerClose onClick={handleDrawerClose} className="rounded-full bg-secondary w-7 h-7 flex items-center justify-center absolute top-4 right-4">
            <XIcon className="w-4 h-4" />
          </DrawerClose>
          <DrawerHeader className="flex flex-col items-center">
            <img src="/assets/goggles.webp" width={150} alt="" />
            <DrawerTitle>{i18n.language === 'en' ? nameEn : name}</DrawerTitle>
            <p className="text-sm">{i18n.language === 'en' ? descriptionEn : description}</p>
            <Coins value={tokens} />
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4 pt-0">
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
