import { useMemo } from "react";

interface WaterFillAnimationProps {
  width: number;
  height: number;
  ratio: number;
}

export const WaterFillAnimation: React.FC<WaterFillAnimationProps> = ({
  width,
  height,
  ratio,
}) => {
  const offsetY = useMemo(() => ratio === 0 ? (height - (height/267)*100) : 264 - 264 * (ratio / 100), [ratio, height]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 267 267`}
      className="water-fill"
    >
      <g>
        <rect
          width={width}
          height={height}
          style={{
            transform: `translate(0, ${offsetY}px)`,
          }}
          className="text-primary"
          fill="currentColor"
        />

        <g
          className="water-container"
          style={{
            transform: `translate(0, ${offsetY - 19}px)`,
          }}
        >
          <path
            className="water"
            d="M420 20.0047C441.5 19.6047 458.8 17.5047 471.1 15.5047C484.5 13.3047 497.6 10.3047 498.4 10.1047C514 6.50474 518 4.70474 528.5 2.70474C535.6 1.40474 546.4 -0.0952561 560 0.00474393V20.0047H420ZM420 20.0047C398.5 19.6047 381.2 17.5047 368.9 15.5047C355.5 13.3047 342.4 10.3047 341.6 10.1047C326 6.50474 322 4.70474 311.5 2.70474C304.3 1.40474 293.6 -0.0952561 280 0.00474393V20.0047H420ZM140 20.0047C118.5 19.6047 101.2 17.5047 88.9 15.5047C75.5 13.3047 62.4 10.3047 61.6 10.1047C46 6.50474 42 4.70474 31.5 2.70474C24.3 1.40474 13.6 -0.0952561 0 0.00474393V20.0047H140ZM140 20.0047C161.5 19.6047 178.8 17.5047 191.1 15.5047C204.5 13.3047 217.6 10.3047 218.4 10.1047C234 6.50474 238 4.70474 248.5 2.70474C255.6 1.40474 266.4 -0.0952561 280 0.00474393V20.0047H140Z"
          />
        </g>
      </g>
    </svg>
  );
};
