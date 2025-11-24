const FALLBACKS = {
  modrinthUrl: 'https://modrinth.com/modpack/winterlands',
  githubSupportUrl: 'https://github.com/Zzackllack/Winterlands/issues',
};

export const env = {
  modrinthUrl: import.meta.env.PUBLIC_MODRINTH_URL ?? FALLBACKS.modrinthUrl,
  githubSupportUrl: import.meta.env.PUBLIC_GITHUB_SUPPORT_URL ?? FALLBACKS.githubSupportUrl,
};
