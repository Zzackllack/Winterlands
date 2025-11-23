import type { LicenseOverrides } from "../lib/modData";

// Document special permissions or non-Modrinth distribution notes here.
// Keyed by the exact mod name from mods.generated.ts.
export const licenseOverrides: LicenseOverrides = {
  /*
  'Example Mod Name': {
    note: 'Only distributed on CurseForge; author granted direct permission via email on 2024-12-01.',
    allowByModrinth: false,
    license: 'Custom Permission',
    sourceUrl: 'https://www.curseforge.com/minecraft/mc-mods/example',
  },
  */
  Catalogue: {
    note: "Only distributed on CurseForge; license allows inclusion in modpacks.",
    allowByModrinth: false,
    license: "MIT License",
    sourceUrl: "https://www.curseforge.com/minecraft/mc-mods/catalogue",
  },
  "Christmas Culinary & Decorations ": {
    note: "Only distributed on CurseForge; author granted direct permission via description on project page.",
    allowByModrinth: false,
    license: "All Rights Reserved (with permission for inclusion in modpacks)",
    sourceUrl:
      "https://www.curseforge.com/minecraft/mc-mods/christmas-culinary-decorations",
  },
  "Christmas Delight (Farmers Delight Addon)": {
    note: "Only distributed on CurseForge; author granted direct permission via private message, see website/public/Permission-ThePoupyBuTers.png.",
    allowByModrinth: false,
    license: "All Rights Reserved",
    sourceUrl:
      "https://www.curseforge.com/minecraft/mc-mods/christmas-delight-farmers-delight-addon",
  },
  "Christmas Music Discs": {
    note: "Only distributed on CurseForge; author granted direct permission via private message, see website/public/Permission-ThePoupyBuTers.png.",
    allowByModrinth: false,
    license: "All Rights Reserved",
    sourceUrl:
      "https://www.curseforge.com/minecraft/mc-mods/christmas-music-discs",
  },
  Configured: {
    note: "Only distributed on CurseForge; license allows inclusion in modpacks.",
    allowByModrinth: false,
    license: "GNU GPLv3",
    sourceUrl: "https://www.curseforge.com/minecraft/mc-mods/configured",
  },
  Framework: {
    note: "Only distributed on CurseForge; license allows inclusion in modpacks.",
    allowByModrinth: false,
    license: "GNU GPLv3",
    sourceUrl: "https://www.curseforge.com/minecraft/mc-mods/framework",
  },
  "Mama's Herbs and Harvest": {
    note: "Only distributed on CurseForge; author granted direct permission via private message, see website/public/Permission-Mama_Michelle.png.",
    allowByModrinth: false,
    license: "All Rights Reserved",
    sourceUrl:
      "https://www.curseforge.com/minecraft/mc-mods/mamas-herbs-and-harvest",
  },
  "Mama's Merrymaking - A Minecraft Christmas and Winter Holiday Mod": {
    note: "Only distributed on CurseForge; author granted direct permission via private message, see website/public/Permission-Mama_Michelle.png and changed license to MIT License.",
    allowByModrinth: false,
    license: "MIT License",
    sourceUrl:
      "https://www.curseforge.com/minecraft/mc-mods/maidens-merry-making",
  },
};
