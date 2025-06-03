import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { drinkWaterDrop } from "~/db/api";
import { useUserStore } from "~/db/userStore";
import { useBack } from "~/hooks/useBack";
import { Game } from "./ui/game";
import { motion } from "framer-motion";
import { useAuthStore } from "~/db/authStore";

export const BubblePage: React.FC = () => {
  useBack("/");

  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [patchUser] = useUserStore((state) => [state.patchUser]);
  const [popQueue, setPopQueue] = useState<number[]>([]); // Queue for storing pop values
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for storing the interval
  const [isVisible, setIsVisible] = useState(true);
  const bubbleGameToken = useAuthStore((state) => state.bubbleGameToken);
  const setBubbleGameToken = useAuthStore((state) => state.setBubbleGameToken);

  const drinkDropMutation = useMutation({
    mutationFn: drinkWaterDrop,
    onSuccess: (data) => {
      setBubbleGameToken(data.token);
      patchUser({
        balance: data.balance,
      });
    },
  });

  // Function to add pops to the queue
  const handlePop = (value: number) => {
    setPopQueue((prevQueue) => [...prevQueue, value]);
  };

  // Process the pop queue
  const processQueue = () => {
    if (popQueue.length > 10 && bubbleGameToken) {
      const totalPops = popQueue.reduce((sum, pop) => sum + pop, 0); // Sum all pops
      drinkDropMutation.mutate({
        amount: totalPops,
        token: bubbleGameToken,
      }); // Send to backend
      setPopQueue([]); // Clear the queue after sending
    }
  };

  useEffect(() => {
    // Set up the interval only once
    intervalRef.current = setInterval(processQueue, 5000);

    // Cleanup function to clear the interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Process the queue immediately if there are items in it
    processQueue();
  }, [popQueue]); // Run every time popQueue changes

  useEffect(() => {
    document.body.classList.add("bg-none");
    document.body.classList.add("select-none");

    return () => {
      document.body.classList.remove("bg-none");
      document.body.classList.remove("select-none");
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <>
      <main
        className="relative overflow-hidden w-full select-none pt-4"
        ref={containerRef}
      >
        <motion.h1
          className="text-4xl text-center font-semibold"
          initial={{ opacity: 1 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("earn_more_title")}
        </motion.h1>
      </main>
      <Game onPop={handlePop} />
    </>
  );
};
