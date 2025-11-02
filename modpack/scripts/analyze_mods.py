#!/usr/bin/env python3
import argparse
import os
from pathlib import Path

def load_toml_like(path: Path) -> dict:
    """
    Minimal TOML-ish reader for the simple packwiz mod files.
    We only care about top-level key = "value" lines.
    This avoids requiring external deps.
    """
    data = {}
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            # skip comments and empty lines
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip()
            # strip quotes if present
            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            data[key] = val
    return data

def classify_mod(toml_data: dict) -> tuple[str, str]:
    """
    Returns (name, classification)
    classification in: "server", "client", "both", "unknown"
    """
    name = toml_data.get("name") or "<no-name>"
    side = toml_data.get("side") or toml_data.get("site")

    if side is None:
        return name, "unknown"

    side = side.lower().strip()

    if side == "client":
        return name, "client"
    elif side == "server":
        # in packwiz this usually means "required on server"
        return name, "server"
    elif side == "both":
        # required/allowed on both
        return name, "both"
    else:
        # unexpected value
        return name, "unknown"

def main():
    parser = argparse.ArgumentParser(
        description="Analyze packwiz mod .toml files and list which ones must be on the server."
    )
    parser.add_argument(
        "folder",
        help="Folder containing per-mod .toml files (often something like pack/mods or the pack root).",
    )
    args = parser.parse_args()
    root = Path(args.folder)

    if not root.exists():
        raise SystemExit(f"Folder does not exist: {root}")

    server_needed = []   # side = server or both
    client_only = []     # side = client
    unknown = []         # no side / weird

    # walk only top-level .toml; if you want recursive, change to rglob("*.toml")
    for toml_path in root.glob("*.toml"):
        # skip packwiz main files
        if toml_path.name in ("pack.toml", "index.toml"):
            continue

        data = load_toml_like(toml_path)
        name, kind = classify_mod(data)

        if kind in ("server", "both"):
            server_needed.append(name)
        elif kind == "client":
            client_only.append(name)
        else:
            unknown.append(name)

    print("=== MODS NEEDED / ALLOWED ON SERVER (side = both|server) ===")
    for m in sorted(set(server_needed)):
        print(" -", m)

    print("\n=== CLIENT-ONLY MODS (side = client) ===")
    for m in sorted(set(client_only)):
        print(" -", m)

    print("\n=== UNKNOWN / NO side FIELD ===")
    for m in sorted(set(unknown)):
        print(" -", m)


if __name__ == "__main__":
    main()