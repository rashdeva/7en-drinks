import { useBack } from "~/hooks/useBack";
import { useUserStore } from "~/db/userStore";
import { useTranslation } from "react-i18next";
import { Coins } from "~/components/coins";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { fetchMyRank, fetchTop25 } from "~/db/api";
import { useQuery } from "@tanstack/react-query";

export const LeaderboardPage = () => {
  useBack("/");
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  // Fetch leaderboard and user's rank
  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard", "top"],
    queryFn: fetchTop25,
  });

  const { data: myRank } = useQuery({
    queryKey: ["leaderboard", "my"],
    queryFn: fetchMyRank,
  });

  // Separate top 3 and the rest of the users from the leaderboard data
  const topThree = leaderboard?.slice(0, 3);
  const restOfUsers = leaderboard?.slice(3);

  return (
    <main className="space-y-3 pb-8">
      <header className="flex items-center justify-between relative z-10">
        <h1 className="text-4xl font-semibold">{t("leaderboard")}</h1>
      </header>

      {/* Top 3 Users Section */}
      <section>
        <div className="grid grid-cols-3">
          {topThree &&
            [
              { user: topThree[2], rank: 3 }, // Third user (rank 3) in the first place
              { user: topThree[0], rank: 1 }, // First user (rank 1) in the second place
              { user: topThree[1], rank: 2 }, // Second user (rank 2) in the third place
            ].map(({ user, rank }, index) => (
              <div
                key={user._id}
                className={`flex flex-col items-center ${
                  index === 1 ? "" : "mt-10"
                }`}
              >
                <div className="relative mb-2">
                  <img
                    src={`https://unavatar.io/telegram/${user.username}`}
                    alt={user.firstName}
                    className={`${
                      index === 1 ? "w-20 h-20" : "w-[60px] h-[60px]"
                    } rounded-full bg-white`}
                  />
                  <div className="absolute left-0 right-0 -bottom-2 flex justify-center">
                    <Badge className="bg-white text-[10px] text-black w-4 h-4 p-0 justify-center">
                      {rank} {/* Show correct rank */}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm truncate overflow-hidden w-full text-center">
                  {user.firstName}
                </div>
                <Coins
                  disablePlus
                  value={user.balance}
                  className="text-xs text-foreground"
                />
              </div>
            ))}
        </div>
      </section>

      {/* User's Rank Section */}
      {myRank && (
        <section>
          <Card className="flex items-center px-5 py-3 gap-2">
            <img
              src={`https://unavatar.io/telegram/${user.username}`}
              alt={user.username}
              className="rounded-full w-10 h-10 bg-white"
            />
            <div>
              <div className="truncate overflow-hidden w-full font-bold -mb-1.5">
                {t("me")}
              </div>
              <Coins disablePlus value={user.balance} className="text-xs" />
            </div>
            <div className="ml-auto">{myRank}</div>
          </Card>
        </section>
      )}

      {/* Boost Button Section */}
      {/* <section>
        <Button variant="secondary" className="w-full gap-2" size="sm">
          <img src="/assets/rocket.svg" alt="" />
          Boost
        </Button>
      </section> */}

      {/* Rest of Users Section (4-25) */}
      <section>
        <Card className="px-5 py-3 space-y-6">
          <h2 className="text-2xl font-bold">{t("top25")}</h2>
          <div className="space-y-4">
            {restOfUsers?.map((user, index) => (
              <div key={user._id} className="flex items-center gap-2">
                <img
                  src={`https://unavatar.io/telegram/${user.username}`}
                  alt={user.username}
                  className="rounded-full w-10 h-10 bg-white"
                />
                <div>
                  <div className="truncate overflow-hidden w-full font-bold -mb-1.5">
                    {user.firstName}
                  </div>
                  <Coins disablePlus value={user.balance} className="text-xs" />
                </div>
                <div className="ml-auto">{index + 4}</div>{" "}
                {/* Rank from 4 to 25 */}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
};
