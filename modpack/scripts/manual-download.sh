#!/usr/bin/env bash
set -euo pipefail

# Detect OS and resolve correct packwiz cache path dynamically
case "$OSTYPE" in
  msys*|cygwin*|win32*)
    CACHE_DIR="${LOCALAPPDATA:-$HOME/AppData/Local}/packwiz/cache/import"
    ;;
  darwin*)
    CACHE_DIR="$HOME/Library/Caches/packwiz/cache/import"
    ;;
  linux*)
    CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/packwiz/cache/import"
    ;;
  *)
    echo "Unsupported OS: $OSTYPE" >&2
    exit 1
    ;;
esac

mkdir -p "$CACHE_DIR"
echo "Downloading mods to: $CACHE_DIR"

URL1="https://edge.forgecdn.net/files/5936/162/christmasmusicdiscs-1.21.1-v1.3.jar"
URL2="https://edge.forgecdn.net/files/6073/163/farmers_delight_christmas_edition-V1.0.2-neoforge-1.20.1.jar"

OUT1="christmasmusicdiscs-1.21.1-v1.3.jar"
OUT2="farmers_delight_christmas_edition-V1.0.2-neoforge-1.20.1.jar"

if command -v curl >/dev/null 2>&1; then
  DL="curl -L -o"
elif command -v wget >/dev/null 2>&1; then
  DL="wget -O"
else
  echo "Error: neither curl nor wget found!" >&2
  exit 1
fi

$DL "$CACHE_DIR/$OUT1" "$URL1"
$DL "$CACHE_DIR/$OUT2" "$URL2"

echo "✅ Downloads complete!"
echo "Now re-run: packwiz modrinth export"
