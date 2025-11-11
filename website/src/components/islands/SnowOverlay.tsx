'use client';

import { useEffect, useRef } from 'react';

interface Flake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
}

const createFlake = (width: number, height: number): Flake => ({
  x: Math.random() * width,
  y: Math.random() * height,
  size: 1 + Math.random() * 2.5,
  speed: 0.3 + Math.random() * 1.2,
  drift: -0.3 + Math.random() * 0.6,
});

export default function SnowOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const flakes: Flake[] = [];
    let frame = 0;

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio = 1 } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      flakes.length = 0;
      const count = Math.min(350, Math.floor((innerWidth * innerHeight) / 3500));
      for (let i = 0; i < count; i += 1) {
        flakes.push(createFlake(innerWidth, innerHeight));
      }
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(245, 251, 255, 0.9)';

      flakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
        flake.y += flake.speed;
        flake.x += flake.drift;
        if (flake.y > height) {
          flake.y = -flake.size;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
