import type { Variants } from 'motion/react';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const staggerContainer = (delay = 0.15): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: delay,
    },
  },
});
