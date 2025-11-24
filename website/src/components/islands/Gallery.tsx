'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { galleryImages } from '../../data/galleryImages';

const makeMarquee = (images: string[]) => [...images, ...images];

export default function Gallery() {
  const hero = galleryImages.slice(0, 6);
  const rowA = useMemo(() => makeMarquee(galleryImages.slice(0, 6)), []);
  const rowB = useMemo(() => makeMarquee(galleryImages.slice(6, 12)), []);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {hero.map((src, idx) => (
          <motion.div
            key={src + idx}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_35px_70px_rgba(1,8,16,0.45)]"
          >
            <img
              src={src}
              alt={`Winterlands gallery ${idx + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      <div className="space-y-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
        <Marquee images={rowA} duration={26} />
        <Marquee images={rowB} duration={30} reverse />
      </div>
    </div>
  );
}

function Marquee({ images, duration, reverse = false }: { images: string[]; duration: number; reverse?: boolean }) {
  return (
    <div className="scroll-container relative w-full overflow-hidden">
      <motion.div
        className="flex min-w-full gap-4"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
      >
        {images.map((src, idx) => (
          <div
            key={src + idx}
            className="image-item relative h-40 w-60 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30 sm:h-52 sm:w-72 md:h-56 md:w-80"
          >
            <img src={src} alt={`Gallery scroll ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
