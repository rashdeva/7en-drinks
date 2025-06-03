import React, { useState, useEffect, useRef } from "react";
import { Bubble } from "./bubble"; // Ensure this file is in your directory
import { useHapticFeedback } from "@telegram-apps/sdk-react";

interface BubbleType {
  id: string;
  x: number;
  y: number;
  duration: number;
}

export const Game: React.FC<{
  onPop: (value: number) => void;
}> = ({ onPop }) => {
  const [bubbles, setBubbles] = useState<BubbleType[]>([]); // Array of bubbles
  const [ready, setReady] = useState<boolean>(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const maxBubbleCount = 50; // Set the maximum number of bubbles
  const initialBubbleCount = 10;
  const haptic = useHapticFeedback();

  const addBubble = (id: string) => {
    if (bubbles.length < maxBubbleCount) {
      const randomX = Math.floor(Math.random() * window.innerWidth);
      const randomY = Math.floor(Math.random() * window.innerHeight);
      const randomDuration = Math.floor(Math.random() * 15 + 15);

      setBubbles((prevBubbles) => [
        ...prevBubbles,
        { id, x: randomX, y: randomY, duration: randomDuration },
      ]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < 2; i++) {
        addBubble(`${i}-${Date.now()}`);
      }
    }, 550);

    for (let i = 0; i < initialBubbleCount; i++) {
      addBubble(`${i}-${Date.now()}`);
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleAnimationEnd = (bubbleId: string) => {
    setBubbles((prevBubbles) => {
      return prevBubbles.filter((bubble) => bubble.id !== bubbleId);
    });
  };

  const popBubble =
    (bubbleId: string) =>
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      haptic.impactOccurred("light");
      const bubble = e.currentTarget as HTMLDivElement; // Use currentTarget instead of target
      bubble.classList.add("popped");
      onPop(1);

      setTimeout(() => {
        bubble.style.display = "none";
        setBubbles((prevBubbles) =>
          prevBubbles.filter((bubble) => bubble.id !== bubbleId)
        );
      }, 1500);
    };

  return (
    <div className="stage" id="stage" ref={stageRef}>
      {ready ? (
        bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            pop={popBubble(bubble.id)}
            style={{
              top: `${bubble.y}px`, // Adjust to use y for vertical position
              left: `${bubble.x}px`, // Adjust to use x for horizontal position
              animationDuration: `${bubble.duration}s`,
            }}
            onOutOfView={() => handleAnimationEnd(bubble.id)} // Remove bubble after animation ends
          />
        ))
      ) : (
        <button onClick={() => setReady(true)}>Ready</button>
      )}
    </div>
  );
};
