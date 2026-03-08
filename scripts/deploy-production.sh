#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PRODUCT_NAME="Desktop App Starter"
APPLICATIONS_PATH="/Applications/${PRODUCT_NAME}.app"
DESKTOP_LINK="$HOME/Desktop/${PRODUCT_NAME}.app"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script is intended to run on macOS." >&2
  exit 1
fi

require_command npm

cd "$PROJECT_ROOT"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building production installers..."
npm run make

APP_BUNDLE="$(find "$PROJECT_ROOT/out" -maxdepth 2 -type d -name "${PRODUCT_NAME}.app" | head -n 1)"

if [[ -z "$APP_BUNDLE" ]]; then
  echo "Built app bundle was not found under out/." >&2
  exit 1
fi

echo "Deploying app bundle to /Applications..."
rm -rf "$APPLICATIONS_PATH"
cp -R "$APP_BUNDLE" "$APPLICATIONS_PATH"

ln -sfn "$APPLICATIONS_PATH" "$DESKTOP_LINK"

echo
echo "Production build and install completed."
echo "Installed app: $APPLICATIONS_PATH"
echo "Desktop shortcut: $DESKTOP_LINK"