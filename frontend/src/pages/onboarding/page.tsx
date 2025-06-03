import { Button } from "~/components/ui/button";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { completeOnboarding } from "~/db/api";
import { useUserStore } from "~/db/userStore";
import { UserDto } from "~/db/dto";
import { parseUser } from "~/db/parsers";
import { Loader2 } from "lucide-react";

const OnboardingPage = () => {
  const { t } = useTranslation();
  const patchUser = useUserStore((state) => state.patchUser);
  const navigate = useNavigate();
  const [props] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  const updateUserMutation = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (userData: UserDto) => {
      const { balance } = parseUser(userData);

      patchUser({
        balance,
      });
    },
  });

  const handleComplete = useCallback(() => {
    patchUser({
      isOnboarded: true,
    });
    navigate("/");

    updateUserMutation.mutate();
  }, [updateUserMutation]);

  return (
    <animated.div
      style={props}
      className="flex-1 flex flex-col items-center justify-between text-center py-4"
    >
      <main className="space-y-6">
        <h1 className="text-4xl">{t("onboarding_title")}</h1>
        <p>{t("onboarding_content")}</p>
      </main>
      <Button
        onClick={handleComplete}
        disabled={updateUserMutation.isPending}
        className="w-full"
      >
        {updateUserMutation.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary-foreground" />
        ) : (
          t("onboarding_action")
        )}
      </Button>
    </animated.div>
  );
};

export default OnboardingPage;
