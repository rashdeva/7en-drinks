import { Copy } from "lucide-react";
import { useUserStore } from "~/db/userStore";
import { useCallback } from "react";
import { toast } from "../../../components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { generateReferralTelegramUrl, generateReferralUrl } from "../utils";
import { getUserFullName } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export const InviteFriend = () => {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();

  const referralLink = generateReferralUrl(user);
  const referralShare = generateReferralTelegramUrl(
    user.id,
    t("invite_friend_text", { name: getUserFullName(user) })
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(referralLink);

    toast({
      title: t("referral_link_copied"),
      duration: 2000,
    });
  }, [referralLink, t]);

  return (
    <div className="bg-white/10 rounded-md overflow-hidden flex w-full items-center gap-3 transition-all active:scale-95">
      <Link to={referralShare} target="_blank" className="flex-1 truncate p-3 ">
        {referralLink.replace("https://", "")}
      </Link>
      <Button variant="ghost" onClick={handleCopy} className="px-3">
        <Copy className="text-white" />
      </Button>
    </div>
  );
};
