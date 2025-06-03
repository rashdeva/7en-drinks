import { Link, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EarnIcon } from "./icons/earn";
import { TasksIcon } from "./icons/tasks";
import { ProfileIcon } from "./icons/profile";
import { cn } from "~/lib/utils";
import { t } from "i18next";
import { LeaderboardIcon } from "./icons/leaderboard";

export const NavTabs = () => {
  const location = useLocation();

  const value =
    location.pathname.split("/")[1] === ""
      ? "tasks"
      : location.pathname.split("/")[1];

  return (
    <div className="navbar fixed bottom-0 left-0 right-0 z-10">
      <Tabs defaultValue="" value={value}>
        <TabsList className="grid w-full grid-cols-4 bg-card h-auto rounded-none pt-3 pb-4">
          <TabsTrigger
            className={cn(
              "bg-transparent transition-colors flex-col border-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:bg-transparent"
            )}
            value="tasks"
            asChild
          >
            <Link to="/">
              <TasksIcon className="h-6 w-6" />
              <span className="text-xs font-normal">{t("main")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              "bg-transparent transition-colors flex-col border-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:bg-transparent"
            )}
            value="leaderboard"
            asChild
          >
            <Link to="/leaderboard">
              <LeaderboardIcon className="w-6 h-6" />
              <span className="text-xs font-normal">{t("leaderboard")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              "bg-transparent transition-colors flex-col border-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:bg-transparent"
            )}
            value="earn"
            asChild
          >
            <Link to="/earn">
              <EarnIcon className="h-6 w-6" />
              <span className="text-xs font-normal">{t("earn_more")}</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger
            className={cn(
              "bg-transparent transition-colors flex-col border-none data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:bg-transparent"
            )}
            value="profile"
            asChild
          >
            <Link to="/profile">
              <ProfileIcon className="w-6 h-6" />
              <span className="text-xs font-normal">{t("profile")}</span>
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
