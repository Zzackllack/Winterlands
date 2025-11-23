'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { ModEntry } from '../../data/mods.generated';

const tabs: Array<{ value: ModEntry['side'] | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'client', label: 'Client' },
  { value: 'server', label: 'Server' },
  { value: 'both', label: 'Client + Server' },
];

const PAGE_SIZE = 24;

export default function ModGrid({ mods }: { mods: ModEntry[] }) {
  const [activeSide, setActiveSide] = useState<typeof tabs[number]['value']>('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(Math.min(PAGE_SIZE, mods.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return mods.filter((mod) => {
      const matchesSide = activeSide === 'all' || mod.side === activeSide;
      const haystack = [mod.name, mod.summary, mod.description, mod.categories.join(' ')].join(' ').toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesSide && matchesQuery;
    });
  }, [mods, activeSide, query]);

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, filtered.length));
  }, [filtered.length, activeSide, query]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length));
          }
        });
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  const visibleMods = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveSide(tab.value)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeSide === tab.value
                ? 'border-white/60 text-white'
                : 'border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <input
        type="search"
        placeholder="Search by name, tag, or summary"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus-ring"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p className="text-sm text-white/60">
        Showing {visibleMods.length} of {filtered.length} mods
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visibleMods.map((mod) => (
            <motion.article
              key={mod.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="frosted-panel p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl">{mod.name}</h3>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/50">{mod.side}</p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                  {mod.source === 'modrinth' ? 'Modrinth' : 'CurseForge'}
                </span>
              </div>
              <p className="mt-4 text-white/70">{mod.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mod.categories.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
              {mod.links.site && (
                <a
                  href={mod.links.site}
                  className="mt-4 inline-flex items-center text-sm text-white hover:text-white/90"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit project →
                </a>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10 focus-ring"
        >
          Load more mods
        </button>
      )}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />
    </div>
  );
}
