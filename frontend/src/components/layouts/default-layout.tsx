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
        <header className="flex items-center relative bg-blue-600/20 backdrop-blur-lg px-3 rounded-md z-20 text-white gap-4 py-2 mt-4 justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.webp" width={36} alt="" />
            <h1 className="text-xl font-semibold">{t("7EN_drinks")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Coins
              disablePlus
              className="text-base text-white"
              value={balance}
            />
            <Avatar className="w-[28px] h-[28px]">
              <AvatarImage src={`https://unavatar.io/telegram/${username}`} />
              <AvatarFallback>
                <img src="/assets/goggles.webp" alt="" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className={cn("flex flex-col flex-1 py-4", isOnboarded && "pb-4")}>
          {children}
        </div>
      </div>
    </>
  );
};
