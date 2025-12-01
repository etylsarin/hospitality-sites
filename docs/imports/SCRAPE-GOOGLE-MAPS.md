# Scraping Google Maps to NDJSON

This guide explains how to scrape place data directly from Google Maps search results or lists.

> ⚠️ **Important:** Web scraping may violate Google's Terms of Service. Consider using the official [Google Places API](https://developers.google.com/maps/documentation/places/web-service) or [Google Takeout](./GOOGLE-TAKEOUT-CONVERSION.md) for legitimate data extraction.

## Overview

**When to use this approach:**
- You want to discover new places (not just your saved places)
- You need data from a specific area or search query
- You want to scrape competitor research data

**Better alternatives:**
- [Google Takeout](./GOOGLE-TAKEOUT-CONVERSION.md) - For your saved places (legal, easy)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service) - For programmatic access (legal, paid)

---

## Option 1: Google Places API (Recommended)

The legal and reliable way to get Google Maps data.

### Setup

1. Create a project at [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Places API**
3. Create an API key
4. Set up billing (free tier: $200/month credit)

### API Endpoints

| Endpoint | Purpose | Cost |
|----------|---------|------|
| Nearby Search | Find places near a location | $32/1000 |
| Text Search | Search by query string | $32/1000 |
| Place Details | Get full place info | $17/1000 |

### Script: Search and Convert

```bash
GOOGLE_PLACES_API_KEY=AIzaSy... npx tsx scripts/scrape-google-places-api.ts \
  --query "coffee shops in Prague" \
  --output places.ndjson \
  --domain coffee
```

### Usage

```bash
npx tsx scripts/scrape-google-places-api.ts [options]

Options:
  --query       Search query (e.g., "breweries in Berlin")
  --location    Center point as "lat,lng" (e.g., "50.0755,14.4378")
  --radius      Search radius in meters (default: 5000)
  --type        Google place type (e.g., cafe, bar, restaurant)
  --output      Output NDJSON file path
  --domain      Domain: beer, coffee, vino, guide
  --max         Maximum results (default: 60, max: 60 per search)
```

### Examples

```bash
# Search by query
GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts \
  --query "craft beer bars" \
  --output beer-bars-prague.ndjson \
  --domain beer

# Search by location and type
GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts \
  --location "52.5200,13.4050" \
  --radius 10000 \
  --type cafe \
  --output cafes-berlin.ndjson \
  --domain coffee

# Search multiple areas (run multiple times)
for city in "Prague" "Berlin" "Vienna"; do
  GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts \
    --query "specialty coffee in $city" \
    --output "coffee-${city,,}.ndjson" \
    --domain coffee
done
```

---

## Option 2: Browser Extension Export

Several browser extensions can export Google Maps data:

### Recommended Extensions

1. **Instant Data Scraper** (Chrome)
   - Works on Google Maps list views
   - Exports to CSV/JSON
   - Free

2. **Data Miner** (Chrome/Firefox)
   - Custom scraping recipes
   - Export to various formats
   - Free tier available

### Workflow

1. Install extension
2. Go to Google Maps
3. Search for places (e.g., "coffee shops Prague")
4. Let results load fully
5. Activate scraper extension
6. Export as JSON/CSV
7. Convert to NDJSON using our script:

```bash
npx tsx scripts/convert-scraped-places.ts \
  --input exported-data.json \
  --source google-maps \
  --output places.ndjson \
  --domain coffee
```

---

## Option 3: Manual Curation + API Enrichment

The most reliable approach for quality data:

1. **Manually create a list** of place names/addresses
2. **Use Google Places API** to get full details
3. **Convert to NDJSON** with enrichment

### Input Format (CSV)

```csv
name,address,domain
"Café Savoy","Vítězná 5, Prague",coffee
"Pivovarský Dům","Ječná 16, Prague",beer
"Můj šálek kávy","Křižíkova 105, Prague",coffee
```

### Convert with Enrichment

```bash
GOOGLE_PLACES_API_KEY=... npx tsx scripts/enrich-place-list.ts \
  --input places.csv \
  --output places.ndjson
```

---

## Data Mapping

### Google Places Type → Our Categories

| Google Type | Our Category |
|-------------|--------------|
| `cafe` | `cafe` |
| `bar` | `pub` |
| `night_club` | `pub` |
| `brewery` | `brewery` |
| `bakery` | `bakery` |
| `restaurant` | `restaurant` |
| `meal_takeaway` | `bistro` |

### Google Price Level → Our Price

| Google Level | Our Value |
|--------------|-----------|
| 0 | `low` |
| 1 | `low` |
| 2 | `average` |
| 3 | `high` |
| 4 | `very-high` |

---

## API Cost Estimation

| Places | Nearby Search | Place Details | Total Cost |
|--------|---------------|---------------|------------|
| 20 | $0.64 | $0.34 | ~$1 |
| 100 | $3.20 | $1.70 | ~$5 |
| 500 | $16.00 | $8.50 | ~$25 |
| 1000 | $32.00 | $17.00 | ~$50 |

**Free tier:** $200/month credit covers ~4000 places/month

---

## Legal Considerations

### ✅ Legal Methods
- Google Places API (with API key)
- Google Takeout (your own data)
- Manual data entry

### ⚠️ Gray Area
- Browser extensions on public data
- Personal use scraping

### ❌ Avoid
- Automated scraping at scale
- Circumventing rate limits
- Reselling scraped data
- Violating robots.txt

---

## Next Steps

→ [Import NDJSON to Sanity](./SANITY-IMPORT.md)
