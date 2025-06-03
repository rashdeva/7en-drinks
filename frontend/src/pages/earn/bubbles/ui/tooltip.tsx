import React from "react";

interface TooltipProps {
  message: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ message }) => {
  return <div className="bubble-tooltip text-base w-full flex justify-center">{message}</div>;
};
