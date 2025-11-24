#!/usr/bin/env python3
"""
Interactive packwiz mod scanner + downloader.

- Scans a folder for *.toml (per-mod files).
- Reads:
    name = "..."
    side = "client" | "server" | "both"   # or "site" if typo
    [download]
        url = "https://..."
        mode = "metadata:curseforge"
- Classifies mods by side.
- Then asks if you want to download all server/both mods into a directory.
- Direct-URL mods are downloaded immediately.
- CurseForge-metadata mods are written to a helper file + shell script.

Tested with Python 3.10+ (uses tomllib if available, else falls back to a tiny parser).
"""

import argparse
import os
import sys
import urllib.request
from pathlib import Path

# ---------- TOML LOADING ----------

def load_toml(path: Path) -> dict:
    """
    Try to load TOML properly (Python 3.11+: tomllib).
    Fall back to a very small line-based parser for the simple packwiz files.
    """
    text = path.read_text(encoding="utf-8")

    # try tomllib first
    try:
        import tomllib  # py3.11+
        return tomllib.loads(text)
    except Exception:
        pass

    # minimal fallback — good enough for key="value" and [section]
    data = {}
    current_section = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("[") and line.endswith("]"):
            current_section = line.strip("[]").strip()
            # nested sections like update.curseforge → create nested dicts
            parts = current_section.split(".")
            d = data
            for p in parts:
                d = d.setdefault(p, {})
            continue

        if "=" in line:
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip()
            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            if current_section:
                d = data
                for p in current_section.split("."):
                    d = d.setdefault(p, {})
                d[key] = val
            else:
                data[key] = val
    return data

# ---------- CLASSIFICATION ----------

def classify_side(toml_data: dict) -> str:
    """
    Return "client", "server", "both", or "unknown".
    Accept both 'side' and typo 'site'.
    """
    side = toml_data.get("side") or toml_data.get("site")
    if not side:
        return "unknown"
    side = str(side).lower().strip()
    if side in ("client", "server", "both"):
        return side
    return "unknown"

def get_mod_name(toml_data: dict, fallback: str) -> str:
    return toml_data.get("name") or fallback

def get_download_info(toml_data: dict) -> dict:
    """
    Returns a dict with:
    {
        "type": "url" | "curseforge" | "none",
        "url": ...,
        "project_id": ...,
        "file_id": ...
    }
    """
    dl = toml_data.get("download")
    if not isinstance(dl, dict):
        return {"type": "none"}

    # direct URL (e.g. Modrinth CDN)
    url = dl.get("url")
    mode = dl.get("mode")
    if url:
        return {"type": "url", "url": url}

    # CurseForge-style
    if mode and str(mode).lower().startswith("metadata:curseforge"):
        # packwiz usually stores update info in [update.curseforge]
        upd_cf = toml_data.get("update", {}).get("curseforge", {})
        return {
            "type": "curseforge",
            "project_id": upd_cf.get("project-id"),
            "file_id": upd_cf.get("file-id"),
        }

    return {"type": "none"}

# ---------- DOWNLOADING ----------

def download_file(url: str, target: Path):
    """
    Simple urllib download. You could replace this with curl/wget calls via subprocess.
    """
    print(f"  -> downloading {url} -> {target.name}")
    try:
        with urllib.request.urlopen(url) as r, target.open("wb") as f:
            f.write(r.read())
    except Exception as e:
        print(f"  !! failed to download {url}: {e}")

# ---------- MAIN LOGIC ----------

def main():
    parser = argparse.ArgumentParser(
        description="Scan packwiz mod .toml files, list server-needed mods, optionally download them."
    )
    parser.add_argument(
        "folder",
        help="Folder containing per-mod .toml files (e.g. your pack's mods/ dir).",
    )
    args = parser.parse_args()
    root = Path(args.folder)

    if not root.exists():
        print(f"Folder does not exist: {root}", file=sys.stderr)
        sys.exit(1)

    server_or_both = []  # [(name, path, download_info)]
    client_only = []
    unknown = []

    # recursive, so nested dirs also work
    for toml_path in root.rglob("*.toml"):
        if toml_path.name in ("pack.toml", "index.toml"):  # global files
            continue

        toml_data = load_toml(toml_path)
        side = classify_side(toml_data)
        name = get_mod_name(toml_data, fallback=toml_path.stem)
        dl_info = get_download_info(toml_data)

        if side in ("server", "both"):
            server_or_both.append((name, toml_path, dl_info))
        elif side == "client":
            client_only.append((name, toml_path, dl_info))
        else:
            unknown.append((name, toml_path, dl_info))

    # ---------- PRINT RESULTS ----------
    print("=== MODS NEEDED / ALLOWED ON SERVER (side = server|both) ===")
    for name, _, _ in sorted(server_or_both, key=lambda x: x[0].lower()):
        print(" -", name)

    print("\n=== CLIENT-ONLY MODS (side = client) ===")
    for name, _, _ in sorted(client_only, key=lambda x: x[0].lower()):
        print(" -", name)

    print("\n=== UNKNOWN / NO side FIELD ===")
    for name, _, _ in sorted(unknown, key=lambda x: x[0].lower()):
        print(" -", name)
    print()

    # ---------- INTERACTIVE PART ----------
    ans = input("Do you want to download/bundle the server-needed mods into a new directory? [y/N]: ").strip().lower()
    if ans not in ("y", "yes"):
        print("Okay, not downloading anything.")
        return

    target_dir_input = input("Enter target directory without quotes (will be created if missing) [server_mods]: ").strip()
    if not target_dir_input:
        target_dir_input = "server_mods"
    target_dir = Path(target_dir_input)
    target_dir.mkdir(parents=True, exist_ok=True)
    print(f"Using target directory: {target_dir.resolve()}")

    # We'll also collect CurseForge-only ones to a helper file
    cf_missing = []
    cf_script_lines = ["#!/bin/sh", "# helper script for CurseForge metadata mods", "set -e"]

    for name, toml_path, dl_info in server_or_both:
        filename = None

        # try to read filename from toml
        td = load_toml(toml_path)
        filename = td.get("filename")
        if not filename:
            # fallback to a safe name
            filename = name.replace(" ", "_") + ".jar"

        if dl_info["type"] == "url":
            url = dl_info["url"]
            dest = target_dir / filename
            download_file(url, dest)

        elif dl_info["type"] == "curseforge":
            project_id = dl_info.get("project_id")
            file_id = dl_info.get("file_id")
            print(f"  -> {name}: CurseForge metadata; cannot directly download without CF API / URL pattern.")
            cf_missing.append((name, project_id, file_id, filename))

            # make a curl template line
            # user can fill in actual URL or use packwiz to fetch
            cf_script_lines.append(
                f'# {name} (project={project_id}, file={file_id})'
            )
            cf_script_lines.append(
                f'echo "Download {name} manually (CF) to {target_dir}/{filename}"'
            )
        else:
            print(f"  -> {name}: no download info found; skipping.")

    # write helper files if we had CurseForge ones
    if cf_missing:
        cf_txt = target_dir / "curseforge_missing.txt"
        with cf_txt.open("w", encoding="utf-8") as f:
            for (name, proj, fid, filename) in cf_missing:
                f.write(f"{name} | project-id={proj} | file-id={fid} | filename={filename}\n")
        print(f"\nWrote CurseForge mods list to: {cf_txt}")

        cf_sh = target_dir / "download_curseforge.sh"
        with cf_sh.open("w", encoding="utf-8") as f:
            f.write("\n".join(cf_script_lines) + "\n")
        os.chmod(cf_sh, 0o755)
        print(f"Wrote helper shell script (fill in real URLs): {cf_sh}")

    print("\nDone.")

if __name__ == "__main__":
    main()