import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useMiniApp,
  useThemeParams,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";
import { useUserStore } from "./db/userStore";
import { ProfilePage } from "./pages/profile/page";
import { useTheme } from "./providers/shadcn-provider";
import { useQuests } from "./modules/quests/useQuests";
import { useReroute } from "./hooks/useReroute";
import { Loader2Icon } from "lucide-react";
import { DrinkPage } from "./pages/home/page";
import { DefaultLayout } from "./components/layouts/default-layout";
import { EarnPage } from "./pages/earn/page";
import { FaqPage } from "./pages/faq/page";
import { AdminAddQuestPage } from "./pages/admin/quests/add/page";
import { AdminQuestsPage } from "./pages/admin/quests/page";
import { AdminEditQuestPage } from "./pages/admin/quests/edit/page";
import OnboardingPage from "./pages/onboarding/page";
import { BubblePage } from "./pages/earn/bubbles/page";
import { ComboPage } from "./pages/earn/combo/page";
import { LeaderboardPage } from "./pages/leaderboard/page";
import { address } from "@ton/ton";

function App() {
  useAuth();
  useReroute();
  useQuests();

  const ad = address('EQBKqs18aqbhjUbsfLeKryi8PzvryKIye1jznbg0MxHBn6aI');

  console.log(ad.toRawString(), ad.toString(), ad.toStringBuffer())

  const theme = useTheme();
  const themeParams = useThemeParams();
  const miniApp = useMiniApp();
  const isUserLoading = useUserStore((state) => state.isLoading);

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    theme.setTheme("light");
    miniApp.setHeaderColor("#A9D2FF");
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    document.documentElement.classList.add("twa");
    miniApp.ready();
    miniApp.requestWriteAccess();
  }, []);

  if (isUserLoading) {
    return (
      <div className="h-dvh flex flex-col justify-center items-center py-4">
        <Loader2Icon className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<DrinkPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/earn" element={<EarnPage />}>
            <Route path="" element={<ComboPage />} />
            <Route path="bubble" element={<BubblePage />} />
          </Route>
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/admin" element={<AdminQuestsPage />} />
          <Route path="/admin/tasks/add" element={<AdminAddQuestPage />} />
          <Route
            path="/admin/tasks/:questId"
            element={<AdminEditQuestPage />}
          />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </DefaultLayout>
      <Toaster />
    </>
  );
}

export default App;
