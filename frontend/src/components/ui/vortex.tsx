import { cn } from "~/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "motion/react";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
  isMobile?: boolean;
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    props.isMobile || window.innerWidth < 768
  );

  // Adjust particle count and parameters for mobile
  const particleCount = isMobile
    ? props.particleCount || 350
    : props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = isMobile ? props.rangeY || 60 : props.rangeY || 100;
  const baseTTL = isMobile ? 40 : 50;
  const rangeTTL = isMobile ? 100 : 150;
  const baseSpeed = isMobile ? props.baseSpeed || 0.1 : props.baseSpeed || 0.0;
  const rangeSpeed = isMobile
    ? props.rangeSpeed || 1.0
    : props.rangeSpeed || 1.5;
  const baseRadius = isMobile ? props.baseRadius || 0.8 : props.baseRadius || 1;
  const rangeRadius = isMobile
    ? props.rangeRadius || 1.5
    : props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const noiseSteps = isMobile ? 2 : 3;
  const xOff = isMobile ? 0.0015 : 0.00125;
  const yOff = isMobile ? 0.0015 : 0.00125;
  const zOff = isMobile ? 0.0007 : 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  const center: [number, number] = [0, 0];

  const TAU: number = 2 * Math.PI;
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  const setup = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        resize(canvas);
        initParticles();
        draw(canvas, ctx);
      }
    }
  };

  const initParticles = () => {
    tick = 0;
    // simplex = new SimplexNoise();
    particleProps = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const initParticle = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let x, y;

    // For mobile, distribute particles more vertically
    if (isMobile) {
      x = rand(canvas.width);
      // More vertical distribution for mobile
      y = rand(canvas.height);
    } else {
      x = rand(canvas.width);
      y = center[1] + randRange(rangeY);
    }

    const vx = 0;
    const vy = 0;
    const life = 0;
    const ttl = baseTTL + rand(rangeTTL);
    const speed = baseSpeed + rand(rangeSpeed);
    const radius = baseRadius + rand(rangeRadius);
    const hue = baseHue + rand(rangeHue);

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles(ctx);
    renderGlow(canvas, ctx);
    renderToScreen(canvas, ctx);

    window.requestAnimationFrame(() => draw(canvas, ctx));
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;
    let n, vx, vy;

    const x = particleProps[i];
    const y = particleProps[i2];

    // Adjust noise pattern for mobile - more vertical flow
    if (isMobile) {
      n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      // Adjust vertical movement to be stronger on mobile
      vx = lerp(particleProps[i3], Math.cos(n) * 0.8, 0.4);
      vy = lerp(particleProps[i4], Math.sin(n) * 1.2, 0.6); // More vertical movement
    } else {
      n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      vy = lerp(particleProps[i4], Math.sin(n), 0.5);
    }

    let life = particleProps[i5];
    const ttl = particleProps[i6];
    const speed = particleProps[i7];
    const x2 = x + vx * speed;
    const y2 = y + vy * speed;
    const radius = particleProps[i8];
    const hue = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const resize = (canvas: HTMLCanvasElement) => {
    const { innerWidth, innerHeight } = window;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  };

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    // Adjust glow for mobile devices (less intense to improve performance)
    if (isMobile) {
      ctx.save();
      ctx.filter = "blur(6px) brightness(180%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    } else {
      ctx.save();
      ctx.filter = "blur(8px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.filter = "blur(4px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
  };

  const renderToScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    setup();

    const handleResize = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        // Update mobile state based on screen width
        setIsMobile(window.innerWidth < 768);
        resize(canvas);
      }
    };

    window.addEventListener("resize", handleResize);

    // Check for mobile orientation changes
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 100); // Small delay to ensure dimensions are updated
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
