#!/usr/bin/env bash
set -euo pipefail

# Where to install the 'packwiz' binary (override with INSTALL_DIR=/some/path)
INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/bin}"

OS="$(uname -s)"
ARCH="$(uname -m)"

# Pick a nightly.link artifact for supported combos; otherwise we'll build with Go.
URL=""
case "$OS" in
  Linux)
    if [[ "$ARCH" = "x86_64" || "$ARCH" = "amd64" ]]; then
      URL="https://nightly.link/packwiz/packwiz/workflows/go/main/Linux%2064-bit%20x86.zip"
    fi
    ;;
  Darwin)
    if [[ "$ARCH" = "x86_64" ]]; then
      URL="https://nightly.link/packwiz/packwiz/workflows/go/main/macOS%2064-bit%20x86.zip"
    fi
    ;;
esac

mkdir -p "$INSTALL_DIR"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

have() { command -v "$1" >/dev/null 2>&1; }

download() {
  local url="$1" out="$2"
  if have curl; then curl -fsSL "$url" -o "$out"
  elif have wget; then wget -qO "$out" "$url"
  else echo "Error: need curl or wget" >&2; exit 1; fi
}

install_from_zip() {
  local zip="$1"
  if have unzip; then unzip -q "$zip" -d "$TMPDIR"
  elif have bsdtar; then bsdtar -xf "$zip" -C "$TMPDIR"
  else echo "Error: need 'unzip' or 'bsdtar' to extract" >&2; exit 1; fi

  # Find the built binary inside the artifact
  local bin
  bin="$(find "$TMPDIR" -type f -perm -u+x -name 'packwiz*' ! -name '*.zip' | head -n1 || true)"
  [[ -n "$bin" ]] || { echo "Error: packwiz binary not found in artifact" >&2; exit 1; }

  chmod +x "$bin"
  mv "$bin" "$INSTALL_DIR/packwiz"
}

install_with_go() {
  if ! have go; then
    echo "No prebuilt for $OS/$ARCH and Go toolchain not found."
    echo "Install Go 1.19+ and re-run (or use Rosetta on macOS/Apple Silicon)." >&2
    exit 1
  fi
  GO111MODULE=on go install github.com/packwiz/packwiz@latest
  local gobin gopath src
  gobin="$(go env GOBIN || true)"
  gopath="$(go env GOPATH || true)"
  if [[ -n "$gobin" && -x "$gobin/packwiz" ]]; then src="$gobin/packwiz"
  elif [[ -x "$gopath/bin/packwiz" ]]; then src="$gopath/bin/packwiz"
  else echo "go install succeeded but packwiz not found in GOBIN/GOPATH" >&2; exit 1; fi
  cp "$src" "$INSTALL_DIR/packwiz"
  chmod +x "$INSTALL_DIR/packwiz"
}

echo "▶ Installing packwiz to: $INSTALL_DIR"
if [[ -n "$URL" ]]; then
  ZIP="$TMPDIR/packwiz.zip"
  echo "• Downloading latest artifact for $OS/$ARCH..."
  download "$URL" "$ZIP"
  install_from_zip "$ZIP"
else
  echo "• No prebuilt artifact for $OS/$ARCH; building from source with Go..."
  install_with_go
fi

# Add completions if requested
if [[ "${INSTALL_COMPLETIONS:-0}" = "1" ]]; then
  SHELL_NAME="${SHELL##*/}"
  case "$SHELL_NAME" in
    bash)
      mkdir -p "$HOME/.local/share/bash-completion/completions"
      "$INSTALL_DIR/packwiz" completion bash > "$HOME/.local/share/bash-completion/completions/packwiz"
      ;;
    zsh)
      mkdir -p "$HOME/.zfunc"
      "$INSTALL_DIR/packwiz" completion zsh > "$HOME/.zfunc/_packwiz"
      # ensure zsh sees the dir
      grep -q 'fpath+=~/.zfunc' "$HOME/.zshrc" 2>/dev/null || {
        {
          echo 'fpath+=~/.zfunc'
          echo 'autoload -Uz compinit; compinit'
        } >> "$HOME/.zshrc"
      }
      ;;
    fish)
      mkdir -p "$HOME/.config/fish/completions"
      "$INSTALL_DIR/packwiz" completion fish > "$HOME/.config/fish/completions/packwiz.fish"
      ;;
  esac
fi

# PATH hint
case ":$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *) echo "ℹ Add to PATH:  export PATH=\"$INSTALL_DIR:\$PATH\"" ;;
esac

echo "✅ Done. Version: $("$INSTALL_DIR/packwiz" --version 2>/dev/null || echo installed)"
