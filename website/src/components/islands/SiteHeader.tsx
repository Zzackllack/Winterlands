"use client";

import Image from "astro/components/Image.astro";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { navLinks } from "../../lib/site";

interface Props {
  ctaHref: string;
}

export default function SiteHeader({ ctaHref }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = () => setOpen(false);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-6 md:px-6 md:py-8">
      <a
        href="/"
        className="flex items-center gap-3 text-lg font-semibold tracking-wide"
      >
        <Image
          src="/logo-winterlands.jpg"
          alt="Winterlands"
          width={48}
          height={48}
          loading="eager"
        />
        <span className="font-display text-xl text-glow md:text-2xl">
          Winterlands
        </span>
      </a>

      <nav className="hidden items-center gap-6 text-sm md:flex">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-white/80 transition hover:text-white"
            aria-label={`Go to ${link.label}`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href={ctaHref}
          className="modrinth-button shrink-0"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src="/modrinth.svg" alt="" className="modrinth-button__icon" />
          <span className="hidden sm:inline">
            Download on{" "}
            <span className="modrinth-button__accent">Modrinth</span>
          </span>
          <span className="inline sm:hidden modrinth-button__accent text-sm">
            Modrinth
          </span>
        </a>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-white/30 hover:bg-white/10 md:hidden focus:outline-none"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0, scale: open ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Menu size={22} strokeWidth={2.2} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mx-auto mt-2 w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-white/10 bg-[#0a172a]/95 p-4 shadow-2xl backdrop-blur"
          >
            <div className="flex flex-col divide-y divide-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-2 py-3 text-base text-white/80 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
