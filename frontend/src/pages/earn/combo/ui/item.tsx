import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export const images = [
  "/assets/combo0.webp",
  "/assets/combo1.webp",
  "/assets/combo2.webp",
  "/assets/combo3.webp",
  "/assets/combo4.webp",
  "/assets/combo5.webp",
  "/assets/combo6.webp",
  "/assets/combo7.webp",
  "/assets/combo8.webp",
  "/assets/combo9.webp",
];

export const ComboItem = ({
  value,
  onChange,
}: {
  value: number;
  onChange?: (direction: "up" | "down") => void;
}) => {
  const [animationDirection, setAnimationDirection] = useState<"up" | "down">(
    "up"
  );

  const handleChange = (direction: "up" | "down") => {
    setAnimationDirection(direction);

    if (onChange) {
      onChange(direction);
    }
  };

  const image = images[value];

  return (
    <div className="flex flex-col items-center gap-1">
      {onChange && (
        <Button
          onClick={() => handleChange("up")}
          className="py-0 h-6"
          variant="ghost"
        >
          <img src="/assets/arrow-up.svg" alt="up arrow" />
        </Button>
      )}

      <div className="bg-[#A9D1FF] rounded-lg overflow-hidden h-28 w-full flex justify-center">
        <motion.img
          key={value}
          src={image}
          alt="combo item"
          className="max-h-full"
          initial={{
            opacity: 0,
            y: animationDirection === "up" ? 100 : -100,
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: animationDirection === "up" ? -100 : 100,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {onChange && (
        <Button
          onClick={() => handleChange("down")}
          className="py-0 h-6"
          variant="ghost"
        >
          <img src="/assets/arrow-down.svg" alt="down arrow" />
        </Button>
      )}
    </div>
  );
};
