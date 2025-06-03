import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "~/db/userStore";

export const REDIRECT_KEY = "redirect-after-onboarding";

export const useReroute = () => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (launchParams.startParam) {
      if (launchParams.startParam?.includes("quest")) {
        const questId = launchParams.startParam.split("quest-")[1];

        if (user.isOnboarded) {
          navigate(`/quests/${questId}`);
        } else {
          window.localStorage.setItem(REDIRECT_KEY, `/quests/${questId}`);
        }
      }

      if (launchParams.startParam?.includes("profile")) {
        const profileId = launchParams.startParam.split("profile-")[1];

        if (user.isOnboarded) {
          navigate(`/p/${profileId}`);
        } else {
          window.localStorage.setItem(REDIRECT_KEY, `/p/${profileId}`);
        }
      }
    }
  }, [user]);
};
