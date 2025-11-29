# The following mods have been categorized as only server but are actually required on the client as well

*So what we will need to do in order to tell the mrpack file to also bundle them for the client is to change their `side` from `server` to `both`.*

The following mods are affected and need to be changed even after an update:

```text
21 results - 21 files

modpack\mods\advancementdisable.pw.toml:
  2  filename = "advancementdisable-neoforge-1.0.1+1.21.jar"
  3: side = "server"
  4  

modpack\mods\async.pw.toml:
  2  filename = "async-neoforge-0.1.8+alpha.1-1.21.1.jar"
  3: side = "server"
  4  

modpack\mods\create-liquid-fuel.pw.toml:
  2  filename = "createliquidfuel-2.1.1-1.21.1.jar"
  3: side = "server"
  4  

modpack\mods\ct-overhaul-village.pw.toml:
  2  filename = "[neoforge]ctov-3.6.0b.jar"
  3: side = "server"
  4  

modpack\mods\formations-nether.pw.toml:
  2  filename = "formationsnether-1.0.5-mc1.21+.jar"
  3: side = "server"
  4  

modpack\mods\formations.pw.toml:
  2  filename = "formations-1.0.4-neoforge-mc1.21.jar"
  3: side = "server"
  4  

modpack\mods\immersive-optimization.pw.toml:
  2  filename = "immersive_optimization-neoforge-1.21-0.1.0.jar"
  3: side = "server"
  4  

modpack\mods\immersive-snow.pw.toml:
  2  filename = "immersivesnow-1.21.1-1.4.0.jar"
  3: side = "server"
  4  

modpack\mods\lithostitched.pw.toml:
  2  filename = "lithostitched-1.5.0-neoforge-1.21.1.jar"
  3: side = "server"
  4  

modpack\mods\mes-moogs-end-structures.pw.toml:
  2  filename = "mes-1.4.6-1.21.jar"
  3: side = "server"
  4  

modpack\mods\recipe-modification.pw.toml:
  2  filename = "recipe_modification-neoforge-1.21.1-0.1.2.jar"
  3: side = "server"
  4  

modpack\mods\rightclickharvest.pw.toml:
  2  filename = "rightclickharvest-neoforge-4.6.0+1.21.1.jar"
  3: side = "server"
  4  

modpack\mods\sparsestructures.pw.toml:
  2  filename = "sparsestructures-neoforge-1.21.1-3.0.jar"
  3: side = "server"
  4  

modpack\mods\wwoo.pw.toml:
  2  filename = "wwoo-2.3.4.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-dungeons.pw.toml:
  2  filename = "YungsBetterDungeons-1.21.1-NeoForge-5.1.4.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-jungle-temples.pw.toml:
  2  filename = "YungsBetterJungleTemples-1.21.1-NeoForge-3.1.2.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-mineshafts.pw.toml:
  2  filename = "YungsBetterMineshafts-1.21.1-NeoForge-5.1.1.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-nether-fortresses.pw.toml:
  2  filename = "YungsBetterNetherFortresses-1.21.1-NeoForge-3.1.5.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-ocean-monuments.pw.toml:
  2  filename = "YungsBetterOceanMonuments-1.21.1-NeoForge-4.1.2.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-strongholds.pw.toml:
  2  filename = "YungsBetterStrongholds-1.21.1-NeoForge-5.1.3.jar"
  3: side = "server"
  4  

modpack\mods\yungs-better-witch-huts.pw.toml:
  2  filename = "YungsBetterWitchHuts-1.21.1-NeoForge-4.1.1.jar"
  3: side = "server"
  4  
```
