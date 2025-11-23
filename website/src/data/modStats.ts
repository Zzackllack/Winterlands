import { mods } from './mods.generated';

// Cached at module load so consumers don't recompute in multiple components.
export const modCount = mods.length;
