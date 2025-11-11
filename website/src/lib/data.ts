import type { CollectionEntry } from 'astro:content';

type ModEntry = CollectionEntry<'mods'>;

type LicenseEntry = CollectionEntry<'licenses'>;

export function groupModsBySide(mods: ModEntry[]) {
  return mods.reduce<Record<'client' | 'server' | 'both', ModEntry[]>>(
    (acc, mod) => {
      acc[mod.data.side].push(mod);
      return acc;
    },
    { client: [], server: [], both: [] },
  );
}

export function featuredMods(mods: ModEntry[]) {
  return mods.filter((mod) => mod.data.featured);
}

export function sortLicenses(entries: LicenseEntry[]) {
  return [...entries].sort((a, b) => a.data.mod.localeCompare(b.data.mod));
}
