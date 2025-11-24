'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface FeatureCarouselProps {
  features: Array<{
    title: string;
    summary: string;
    icon?: string;
  }>;
}

export default function FeatureCarousel({ features }: FeatureCarouselProps) {
  const safeFeatures = useMemo(() => features.filter(Boolean), [features]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    if (safeFeatures.length <= 1) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % safeFeatures.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [safeFeatures.length]);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % safeFeatures.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + safeFeatures.length) % safeFeatures.length);
  };

  const current = safeFeatures[index];
  const nextIdx = (index + 1) % safeFeatures.length;
  const secondary = safeFeatures[nextIdx];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <CardSlot feature={current} direction={direction} primary />
        <CardSlot feature={secondary} direction={direction} />
      </div>
      {safeFeatures.length > 1 && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {safeFeatures.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition ${i === index ? 'w-8 bg-white' : 'w-3 bg-white/40'}`}
                aria-label={`Go to feature ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
              aria-label="Previous feature"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
              aria-label="Next feature"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CardSlot({
  feature,
  direction,
  primary = false,
}: {
  feature?: FeatureCarouselProps['features'][number];
  direction: 1 | -1;
  primary?: boolean;
}) {
  if (!feature) return <div className="h-full" />;

  const delta = primary ? 20 : 12;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={feature.title}
        initial={{ opacity: 0, x: direction === 1 ? delta : -delta }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction === 1 ? -delta : delta }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={`h-full rounded-3xl border border-white/10 bg-white/5 p-6 ${
          primary ? '' : 'opacity-85'
        }`}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">{feature.icon ?? '✽'}</p>
        <h3 className="mt-3 font-display text-2xl text-white">{feature.title}</h3>
        <p className="mt-2 text-white/70">{feature.summary}</p>
      </motion.div>
    </AnimatePresence>
  );
}
