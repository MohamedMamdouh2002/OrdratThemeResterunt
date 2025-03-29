#!/bin/bash

echo "🚀 Starting Warm-Up Requests..."

ATTEMPTS=0
MAX_ATTEMPTS=50
DELAY=1

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
  SITEMAP=$(curl -s http://localhost:3001/sitemap.xml)

  if [ -n "$SITEMAP" ]; then
    echo "✅ Sitemap fetched successfully!"
    break
  fi

  ATTEMPTS=$((ATTEMPTS+1))
  echo "⏳ Waiting for sitemap... attempt $ATTEMPTS/$MAX_ATTEMPTS"
  sleep $DELAY
done

if [ -z "$SITEMAP" ]; then
  echo "❌ Sitemap is still empty after $MAX_ATTEMPTS attempts. Exiting."
  exit 1
fi

echo "$SITEMAP" | grep -oP '(?<=<loc>)[^<]+' | sed 's|https://theme.ordrat.com|http://localhost:3001|' | while read url; do
  echo "🔥 Warming $url"
  curl -o /dev/null -s -w "%{http_code} - %{url_effective}\n" "$url"
done

echo "✅ Warm-Up Completed!"

