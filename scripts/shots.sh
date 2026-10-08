#!/usr/bin/env bash
# Visual QA screenshots — TH/EN × desktop/tablet/mobile, against the built static site.
# Serves dist/ under the GitHub Pages base path (/PlantDb/) so URLs match production layout.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVE=/tmp/c5-serve
OUT="${1:-$ROOT/screenshots}"
PORT=8099
CHROME=$(ls -d ~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome 2>/dev/null | tail -1 || true)

[ -n "$CHROME" ] || { echo "chromium not found"; exit 2; }

mkdir -p "$OUT" "$SERVE"
rm -rf "$SERVE/PlantDb"
ln -s "$ROOT/dist" "$SERVE/PlantDb"
( cd "$SERVE" && python3 -m http.server "$PORT" >/dev/null 2>&1 & echo $! > /tmp/c5-serve.pid )
sleep 2

shoot() { # $1 name  $2 path  $3 width  $4 height
  "$CHROME" --headless=new --no-sandbox --hide-scrollbars --disable-gpu --force-prefers-reduced-motion \
    --force-device-scale-factor=1 \
    --window-size="$3,$4" --screenshot="$OUT/$1.png" "http://127.0.0.1:$PORT/PlantDb$2" >/dev/null 2>&1
  printf '  %s (%sx%s)\n' "$1.png" "$3" "$4"
}

for locale in th en; do
  prefix=""; [ "$locale" = "en" ] && prefix="/en"
  shoot "$locale-home-desktop"     "$prefix/"                     1440 2600
  shoot "$locale-home-tablet"      "$prefix/"                      834 3000
  shoot "$locale-home-mobile"      "$prefix/"                      390 3200
  shoot "$locale-catalogue-desktop" "$prefix/plants/"              1440 2400
  shoot "$locale-catalogue-mobile"  "$prefix/plants/"               390 2800
  shoot "$locale-detail-desktop"    "$prefix/plants/rice-oryza/"    1440 2200
  shoot "$locale-detail-mobile"     "$prefix/plants/rice-oryza/"     390 2600
  shoot "$locale-search-mobile"     "$prefix/search/?q=oryza"        390 1600
  shoot "$locale-animals-desktop"   "$prefix/animals/"              1440 1800
  shoot "$locale-research-desktop"  "$prefix/research/"             1440 1600
  shoot "$locale-about-desktop"     "$prefix/about/"                1440 1800
done

shoot "th-404-desktop" "/404.html" 1440 1200

kill "$(cat /tmp/c5-serve.pid)" 2>/dev/null || true
echo "screenshots → $OUT"
ls "$OUT" | wc -l
