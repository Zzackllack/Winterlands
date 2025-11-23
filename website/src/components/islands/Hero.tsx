'use client';

import { motion } from 'motion/react';
import { heroHighlights } from '../../lib/site';

interface HeroProps {
  modrinthUrl: string;
}

export default function Hero({ modrinthUrl }: HeroProps) {

  return (
    <section className="relative isolate overflow-hidden px-6 pb-20 pt-16 sm:pt-24">
      <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_minmax(0,_0.9fr)]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.35, 0.12, 0.25, 1] }}
          className="space-y-8"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm uppercase tracking-[0.35em] text-white/70">
            NeoForge 1.21.1
          </p>
          <h1 className="frozen-text text-3xl leading-snug sm:text-4xl">
            Winterlands Modpack
          </h1>
          <p className="font-display text-4xl text-white sm:text-5xl">
            Cozy camps, roaring blizzards, and holiday hunts in one download.
          </p>
          <p className="max-w-2xl text-lg text-white/75">
            220 carefully selected mods turn Minecraft into a frosty sandbox: glowing auroras, sled races, gourmet stews,
            and Create-powered cabins that actually stay warm. We are in open playtest, so hop in early and help sculpt
            the launch build.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.a
              href={modrinthUrl}
              className="modrinth-button"
              target="_blank"
              rel="noreferrer noopener"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src="/modrinth.svg" alt="" className="modrinth-button__icon" />
              <span>
                Download on <span className="modrinth-button__accent">Modrinth</span>
              </span>
            </motion.a>
            <a href="/mods" className="inline-flex items-center text-white/70 transition hover:text-white">
              Browse all 220 mods →
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <h3 className="font-display text-2xl text-white">What to expect</h3>
          <ul className="mt-4 space-y-4">
            {heroHighlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle,_white,_rgba(90,208,255,0.6))] shadow-[0_0_12px_rgba(90,208,255,0.8)]" />
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
