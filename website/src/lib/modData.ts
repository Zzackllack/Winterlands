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
}

export interface LicenseOverrides {
  [modName: string]:
    | {
        note?: string;
        allowByModrinth?: boolean;
        license?: string;
        sourceUrl?: string;
      }
    | undefined;
}

export function buildLicenseRows(mods: ModEntry[], overrides: LicenseOverrides = {}): LicenseRow[] {
  const noteNumbers = new Map<string, number>();
  let nextNoteId = 1;

  return mods
    .map((mod) => {
      const override = overrides[mod.name];
      const noteText = override?.note;
      let noteId: number | undefined;

      if (noteText) {
        if (!noteNumbers.has(noteText)) {
          noteNumbers.set(noteText, nextNoteId++);
        }
        noteId = noteNumbers.get(noteText);
      }

      return {
        name: mod.name,
        license: override?.license ?? mod.license.name ?? mod.license.id ?? 'Unknown',
        sourceUrl: override?.sourceUrl ?? mod.links.site ?? mod.links.source,
        allowByModrinth:
          override?.allowByModrinth ?? mod.license.allowModrinthRedistribution ?? false,
        noteId,
        noteText,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
