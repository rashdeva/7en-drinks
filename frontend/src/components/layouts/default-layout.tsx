import { ReactNode } from "react";
import { useUserStore } from "~/db/userStore";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Coins } from "../coins";
import { TonConnectButton } from "@tonconnect/ui-react";

export const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { isOnboarded, username, balance } = useUserStore(
    (state) => state.user
  );

  return (
    <>
      <div className={cn("container max-w-lg h-dvh flex flex-col")}>
        <header className="flex items-center relative bg-blue-600/20 backdrop-blur-lg px-3 rounded-md z-20 text-white gap-4 py-2 mt-4 justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.webp" width={36} alt="" />
            <Coins
              disablePlus
              className="text-base text-white"
              value={balance}
            />
          </div>

          <div className="flex items-center gap-2">
            <TonConnectButton />
            <Avatar className="w-[36px] h-[36px]">
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
