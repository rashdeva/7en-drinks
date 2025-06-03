import {
  ImpactHapticFeedbackStyle,
  useHapticFeedback,
} from "@telegram-apps/sdk-react";
import confetti from "canvas-confetti";

const getRandomHapticIntensity = (): ImpactHapticFeedbackStyle => {
  const intensities: ImpactHapticFeedbackStyle[] = [
    "soft",
    "light",
    "medium",
    "rigid",
  ];
  return intensities[Math.floor(Math.random() * intensities.length)];
};

export const useCompleteConfetti = () => {
  const haptics = useHapticFeedback();
  const end = Date.now() + 2 * 500;
  const colors = ["#049EFE", "#FFFFFF"];

  return function frame() {
    if (Date.now() > end) return;

    haptics.impactOccurred(getRandomHapticIntensity());

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };
};
