# Repository Guidelines

## Project Structure & Module Organization

- Root manifest: `modpack/pack.toml`; regenerate `modpack/index.toml` via `packwiz refresh` only—never edit it manually.
- Mods: `modpack/mods/*.pw.toml`, one file per dependency named after its Modrinth/Curse slug.
- Configs/assets: everything under `modpack/configs/` and mod-specific folders mirrors the shipped client; edit files in place.
- Tooling: `modpack/scripts/` hosts Bash installers and Python analyzers for repeatable automation.

## Build, Test, and Development Commands

- `./modpack/scripts/install-packwiz.sh`: install the pinned `packwiz` binary into `$HOME/.local/bin`.
- `cd modpack && packwiz refresh`: relock `index.toml` after editing mods or configs.
- `cd modpack && packwiz cf export --output dist/Winterlands.zip`: build the CurseForge zip.
- `cd modpack && packwiz modrinth export --output Winterlands.mrpack`: update the checked-in `.mrpack`.
- `python modpack/scripts/analyze_mods.py modpack/mods`: list client/server mods and (optionally) predownload server-required jars.
- `modpack/scripts/manual-download.sh`: seed cache-only jars when network CDNs deny packwiz.

## Coding Style & Naming Conventions

- TOML: lowercase keys, double quotes, `[download]` before `[update]`, alphabetize entries to limit merge churn.
- Always set `side = "client" | "server" | "both"` so automation stays accurate.
- Bash: `#!/usr/bin/env bash`, `set -euo pipefail`, lower_snake_case helpers, env overrides for tunables (e.g., `INSTALL_DIR`).
- Python: target 3.10+, prefer type hints and `pathlib`, include a short module docstring describing the automation.

## Testing Guidelines

- Always run `packwiz refresh`, `packwiz cf export`, and `packwiz modrinth export` before pushing; this surfaces hash drift early.
- Re-run `python modpack/scripts/analyze_mods.py modpack/mods` whenever mods change and include its server/both list in the PR.
- With no automated coverage, document every manual verification (world load, JEI view, script output) in the PR body.

## Commit & Pull Request Guidelines
Use Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) and branch names from `.github/CONTRIBUTING.md`. Keep commits scoped to one mod/config family and justify any version bump (major/minor/patch) in the PR body. Link the driving issue, attach testing notes or analyzer output, add screenshots for visual tweaks, and mention if `manual-download.sh` or other cache steps were required so reviewers can reproduce the export.

## Security & Configuration Tips
Follow `.github/SECURITY.md` for disclosure—never post tokenized URLs publicly. Keep proprietary jars out of git by relying on the cache scripts. When configs reference private endpoints or keys, externalize them to env vars or explain the redaction process so exports remain safe.
