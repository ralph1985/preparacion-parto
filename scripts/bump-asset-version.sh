#!/bin/sh
set -eu

HTML_FILES="index.html curso.html"

for HTML_FILE in $HTML_FILES; do
  if [ ! -f "$HTML_FILE" ]; then
    echo "No se encuentra $HTML_FILE"
    exit 1
  fi
done

# Timestamp-based version to ensure a fresh asset URL on each commit/deploy.
VERSION="$(date -u +%Y%m%d%H%M%S)"

for HTML_FILE in $HTML_FILES; do
  cp "$HTML_FILE" "${HTML_FILE}.bak"

  perl -pe 's{(\./assets/[^"?]+\.(?:css|js|png|jpg|jpeg|svg|webp|gif))(?:\?v=\d+)?}{$1 . "?v='"$VERSION"'"}ge' "${HTML_FILE}.bak" > "$HTML_FILE"

  rm -f "${HTML_FILE}.bak"
done

echo "Asset version updated to $VERSION in $HTML_FILES"
