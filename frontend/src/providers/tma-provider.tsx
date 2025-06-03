import { mockTelegramEnv, parseInitData, SDKProvider } from "@telegram-apps/sdk-react";
import { ReactNode } from "react";


if (import.meta.env.DEV) {
  const initDataRaw = new URLSearchParams([
    [
      "user",
      JSON.stringify({
        id: 48361363,
        first_name: "rashdeva",
        last_name: "",
        username: "rashdeva",
        language_code: "en",
        is_premium: true,
        allows_write_to_pm: true,
      }),
    ],
    [
      "hash",
      "66ba5d498c2938af9f135c696e8382795fb9e5b1444b6422f26083878cfe86da",
    ],
    ["auth_date", "172011859"],
    ["start_param", "debug"],
    ["chat_type", "sender"],
    ["chat_instance", "8428209589180549439"],
  ]).toString();

  mockTelegramEnv({
    themeParams: {
      accentTextColor: "#0077cc",
      bgColor: "#dddddd",
      buttonColor: "#0077cc",
      buttonTextColor: "#ffffff",
      destructiveTextColor: "#ff4d4d",
      headerBgColor: "#f0f4f7",
      hintColor: "#99aabb",
      linkColor: "#0077cc",
      secondaryBgColor: "#e6f2ff",
      sectionBgColor: "#f0f4f7",
      sectionHeaderTextColor: "#0077cc",
      subtitleTextColor: "#666666",
      textColor: "#333333",
    },
    initData: parseInitData(initDataRaw),
    initDataRaw,
    version: "7.2",
    platform: "tdesktop",
  });
}

export const TmaProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SDKProvider debug acceptCustomStyles>
      {children}
    </SDKProvider>
  );
};
