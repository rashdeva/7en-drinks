import { useMutation } from "@tanstack/react-query";
import { checkCombination } from "~/db/api";
import { parseUser } from "~/db/parsers";
import { useUserStore } from "~/db/userStore";

export const useCheckMutation = () => {
  const { patchUser } = useUserStore();

  return useMutation({
    mutationFn: checkCombination,
    onSettled: (result) => {
      const user = parseUser(result.user);
      patchUser(user);
    },
  });
};
