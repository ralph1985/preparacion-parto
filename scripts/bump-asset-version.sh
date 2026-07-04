#!/bin/sh
set -eu

TARGET_FILES="$(find src -type f \( -name '*.astro' -o -name '*.ts' -o -name '*.js' -o -name '*.css' \) | sort)"

if [ -z "$TARGET_FILES" ]; then
  echo "No se han encontrado archivos fuente"
  exit 1
fi

# Timestamp-based version to ensure a fresh asset URL on each commit/deploy.
VERSION="$(date -u +%Y%m%d%H%M%S)"

for TARGET_FILE in $TARGET_FILES; do
  cp "$TARGET_FILE" "${TARGET_FILE}.bak"

  perl -pe 's{((?:/assets/|\./assets/)[^"?]+\.(?:css|js|png|jpg|jpeg|svg|webp|gif))(?:\?v=\d+)?}{$1 . "?v='"$VERSION"'"}ge' "${TARGET_FILE}.bak" > "$TARGET_FILE"

  rm -f "${TARGET_FILE}.bak"
done

echo "Asset version updated to $VERSION in Astro source files"
