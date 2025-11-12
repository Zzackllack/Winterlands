import type { ModEntry } from '../data/mods.generated';

export function featuredMods(mods: ModEntry[], limit = 3) {
  return mods.slice(0, limit);
}

export interface LicenseRow {
  name: string;
  license: string;
  sourceUrl?: string;
  allowByModrinth: boolean;
}

export function buildLicenseRows(mods: ModEntry[]): LicenseRow[] {
  return mods
    .map((mod) => ({
      name: mod.name,
      license: mod.license.name ?? mod.license.id ?? 'Unknown',
      sourceUrl: mod.links.site ?? mod.links.source,
      allowByModrinth: mod.license.allowModrinthRedistribution,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
