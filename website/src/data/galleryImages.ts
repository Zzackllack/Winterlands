const base = (url: string) =>
  `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=1920&h=1080&fit=cover&output=webp&q=80&we`;

export const galleryImages = [
  base(
    "https://raw.githubusercontent.com/Zzackllack/Winterlands/refs/heads/main/misc/images/christmas.png"
  ),
  base(
    "https://raw.githubusercontent.com/Zzackllack/Winterlands/refs/heads/main/misc/images/food.png"
  ),
  base(
    "https://raw.githubusercontent.com/Zzackllack/Winterlands/refs/heads/main/misc/images/menu.png"
  ),
  base(
    "https://raw.githubusercontent.com/Zzackllack/Winterlands/refs/heads/main/misc/images/mobs.png"
  ),
  base(
    "https://raw.githubusercontent.com/Zzackllack/Winterlands/refs/heads/main/misc/images/vanilla-backport.png"
  ),
];
