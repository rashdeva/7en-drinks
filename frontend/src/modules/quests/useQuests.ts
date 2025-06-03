import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchQuests } from "~/db/api";
import { useAuthStore } from "~/db/authStore";
import { useQuestStore } from "~/db/questStore";

export const useQuests = () => {
  const setQuests = useQuestStore((state) => state.setQuests);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isFetchingRef = useRef(false); // Ref to track if a fetch is in progress
  
  const { data: quests, isLoading } = useQuery({
    queryKey: ["quests", accessToken],
    queryFn: async () => {
      isFetchingRef.current = true;
      return fetchQuests();
    },
    enabled: !!accessToken && !isFetchingRef.current,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isLoading && quests) {
      setQuests(quests);
    }
  }, [quests, isLoading, setQuests]);
};
