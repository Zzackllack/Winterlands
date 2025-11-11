'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ModLite {
  slug: string;
  name: string;
  side: 'client' | 'server' | 'both';
  version: string;
  tags: string[];
  summary: string;
  homepage?: string;
}

const tabs: Array<{ value: ModLite['side'] | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'client', label: 'Client' },
  { value: 'server', label: 'Server' },
  { value: 'both', label: 'Client + Server' },
];

export default function ModGrid({ mods }: { mods: ModLite[] }) {
  const [activeSide, setActiveSide] = useState<typeof tabs[number]['value']>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return mods.filter((mod) => {
      const matchesSide = activeSide === 'all' || mod.side === activeSide;
      const matchesQuery = mod.name.toLowerCase().includes(query.toLowerCase()) ||
        mod.summary.toLowerCase().includes(query.toLowerCase());
      return matchesSide && matchesQuery;
    });
  }, [mods, activeSide, query]);

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
      <p className="text-sm text-white/60">Showing {filtered.length} mods</p>
      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((mod) => (
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
                  v{mod.version}
                </span>
              </div>
              <p className="mt-4 text-white/70">{mod.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mod.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {tag}
                  </span>
                ))}
              </div>
              {mod.homepage && (
                <a
                  href={mod.homepage}
                  className="mt-4 inline-flex items-center text-sm text-white hover:text-white/90"
                  target="_blank"
                  rel="noreferrer"
                  data-no-swup
                >
                  Modrinth page →
                </a>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
