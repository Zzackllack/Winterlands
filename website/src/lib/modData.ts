import type { ModEntry } from '../data/mods.generated';

export function featuredMods(mods: ModEntry[], limit = 3) {
  return mods.slice(0, limit);
}

export interface LicenseRow {
  name: string;
  license: string;
  sourceUrl?: string;
  allowByModrinth: boolean;
  noteId?: number;
  noteText?: string;
  noteLinks?: string[];
}

export interface LicenseOverrides {
  [modName: string]:
    | {
        note?: string;
        allowByModrinth?: boolean;
        license?: string;
        sourceUrl?: string;
        proofLinks?: string[];
      }
    | undefined;
}

export function buildLicenseRows(mods: ModEntry[], overrides: LicenseOverrides = {}): LicenseRow[] {
  const rows = mods
    .map((mod) => ({
      name: mod.name,
      license: overrides[mod.name]?.license ?? mod.license.name ?? mod.license.id ?? 'Unknown',
      sourceUrl: overrides[mod.name]?.sourceUrl ?? mod.links.site ?? mod.links.source,
      allowByModrinth:
        overrides[mod.name]?.allowByModrinth ?? mod.license.allowModrinthRedistribution ?? false,
      noteText: overrides[mod.name]?.note,
      noteLinks: overrides[mod.name]?.proofLinks,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  let noteCounter = 1;
  rows.forEach((row) => {
    if (row.noteText) {
      row.noteId = noteCounter++;
    }
  });

  return rows;
}
