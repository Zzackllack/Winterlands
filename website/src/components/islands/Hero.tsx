'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { animate } from 'animejs';
import { heroHighlights, stats } from '../../lib/site';
import SnowfallCanvas from './SnowfallCanvas';

interface HeroProps {
  modrinthUrl: string;
}

export default function Hero({ modrinthUrl }: HeroProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    const animation = animate(buttonRef.current, {
      backgroundPositionX: ['0%', '120%'],
      easing: 'linear',
      duration: 4500,
      direction: 'alternate',
      iterations: Infinity,
    });
    return () => {
      animation.cancel();
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden px-6 pb-16 pt-12 sm:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_minmax(0,_0.9fr)]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.35, 0.12, 0.25, 1] }}
          className="space-y-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm uppercase tracking-[0.35em] text-white/70">
            NeoForge 1.21.1
          </p>
          <h1 className="font-display text-5xl leading-tight text-white sm:text-6xl">
            Winterlands
            <span className="block text-4xl text-white/70 sm:text-5xl">A cinematic frozen odyssey</span>
          </h1>
          <p className="max-w-2xl text-lg text-white/75">
            Built with packwiz precision, our snow-dusted modpack layers ambience, automation, and story-driven
            events across every biome. Ship it to Modrinth, sync it to servers, and chase the next aurora.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.a
              ref={buttonRef}
              href={modrinthUrl}
              className="glass-button bg-[length:200%_200%] px-6 py-3 text-base"
              target="_blank"
              rel="noreferrer noopener"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download on Modrinth
            </motion.a>
            <a href="/mods" className="inline-flex items-center text-white/70 transition hover:text-white" data-swup-preload>
              Explore the mod list →
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="font-display text-3xl text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                <p className="text-sm text-white/60">{stat.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="gradient-border relative aspect-square overflow-hidden">
            <SnowfallCanvas />
          </div>
          <ul className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            {heroHighlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(91,213,255,0.8)]" />
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
