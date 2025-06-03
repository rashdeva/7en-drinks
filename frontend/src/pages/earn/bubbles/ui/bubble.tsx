import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "./tooltip";

// List of water drop images
const waterDropImages: string[] = [
  "/assets/drop1.svg",
  "/assets/drop2.svg",
  "/assets/drop3.svg",
  "/assets/drop4.svg",
  "/assets/drop5.svg",
  "/assets/drop6.svg",
  "/assets/drop7.svg",
];

// Define the props for the Bubble component
interface BubbleProps {
  pop: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
  style: React.CSSProperties;
  onOutOfView: () => void;
}

export const Bubble: React.FC<BubbleProps> = ({ pop, style, onOutOfView }) => {
  const [randomImage, setRandomImage] = useState<string>("");
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Generate a random speed between 5 and 10 seconds for the animation
  const randomSpeed = Math.random() * (10 - 5) + 15;

  useEffect(() => {
    setRandomImage(
      waterDropImages[Math.floor(Math.random() * waterDropImages.length)]
    );
  }, []);

  useEffect(() => {
    const bubbleElement = bubbleRef.current;

    // Intersection Observer to detect when bubble is out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          onOutOfView();
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );

    if (bubbleElement) {
      observer.observe(bubbleElement);
    }

    return () => {
      if (bubbleElement) {
        observer.unobserve(bubbleElement);
      }
    };
  }, [onOutOfView]);

  return (
    <motion.div
      className="bubble-box"
      onClick={pop}
      style={style}
      onTouchStart={pop}
      ref={bubbleRef}
      initial={{ y: 0 }} // Start from the bottom
      animate={{ y: -window.innerHeight - 200 }} // Move to the top of the screen
      transition={{ duration: randomSpeed, ease: "linear" }} // Random speed for animation
      onAnimationEnd={() => onOutOfView()} // Trigger when animation ends
    >
      <div
        className="bubble"
        style={{
          backgroundImage: `url(${randomImage})`, // Set the background image
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      ></div>
      <Tooltip message={"+1H20"} />
    </motion.div>
  );
};
