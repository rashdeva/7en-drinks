import { ReactNode } from "react";
import { useUserStore } from "~/db/userStore";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslation } from "react-i18next";
import { Coins } from "../coins";

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { isOnboarded, username, balance } = useUserStore(
    (state) => state.user
  );
  const { t } = useTranslation();

  return (
    <>
      <div className={cn("container max-w-lg h-dvh flex flex-col")}>
        <header className="flex items-center gap-4 p-4 justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-[40px] h-[40px]">
              <AvatarImage src={`https://unavatar.io/telegram/${username}`} />
              <AvatarFallback>
                <img src="/assets/goggles.webp" alt="" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-semibold">{t("7EN_drinks")}</h1>
          </div>
          <Coins
            disablePlus
            className="text-base text-foreground"
            value={balance}
          />
        </header>
        <div
          className={cn(
            "flex flex-col flex-1 py-4",
            isOnboarded && "pb-[78px]"
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};
