# Data Import Guide

This directory contains documentation and scripts for importing place data into Sanity CMS.

## Quick Start

```bash
# 1. Export from Google Takeout (your saved places)
# 2. Convert to NDJSON
npx tsx scripts/convert-google-places.ts ~/Downloads/Saved\ Places.json places.ndjson beer

# 3. Import to Sanity
npx tsx scripts/import-to-sanity.ts places.ndjson production --replace
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [GOOGLE-TAKEOUT-CONVERSION.md](./GOOGLE-TAKEOUT-CONVERSION.md) | Convert Google Maps saved places (GeoJSON) to NDJSON |
| [SANITY-IMPORT.md](./SANITY-IMPORT.md) | Import NDJSON files to Sanity CMS |
| [SCRAPE-GOOGLE-MAPS.md](./SCRAPE-GOOGLE-MAPS.md) | Get data from Google Maps (API + alternatives) |
| [SCRAPE-TRIPADVISOR.md](./SCRAPE-TRIPADVISOR.md) | Get data from TripAdvisor (legal options) |

---

## Scripts

| Script | Purpose | Requires | Status |
|--------|---------|----------|--------|
| `scripts/convert-google-places.ts` | Basic GeoJSON → NDJSON conversion | - | ✅ Ready |
| `scripts/enrich-google-places.ts` | Enriched conversion with Places API | `GOOGLE_PLACES_API_KEY` | ⚠️ Limited |
| `scripts/import-to-sanity.ts` | Import NDJSON to Sanity | Sanity CLI | ✅ Ready |
| `scripts/scrape-google-places-api.ts` | Search Google Places API | `GOOGLE_PLACES_API_KEY` | ✅ Ready |

### Enrichment Script Limitations

The `enrich-google-places.ts` script has the following **known limitations**:

1. **Requires valid coordinates** - The script uses Google Places Nearby Search API which requires latitude/longitude coordinates to find places reliably. Places with `[0, 0]` coordinates cannot be enriched.

2. **Name-only lookup is unreliable** - Looking up places by name alone (Text Search) risks matching wrong places globally (e.g., "The Brewhouse" exists in many cities).

3. **Data source compatibility**:
   - ✅ **Google Takeout exports** - Have valid coordinates, work well
   - ❌ **Google Maps "Want to go" scrapes** - Often have `[0, 0]` placeholder coordinates

**Recommended workflow for places without coordinates:**
- Import basic data without API enrichment
- Manually enrich in Sanity Studio
- Or use Google Places Text Search API with location bias (future enhancement)

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│ Google Takeout  │ Google Places   │ Manual Curation             │
│ (Your saved     │ API (Search     │ (Spreadsheet)               │
│ places)         │ results)        │                             │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         ▼                 ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CONVERSION SCRIPTS                           │
├─────────────────────────────────────────────────────────────────┤
│ convert-google-places.ts    enrich-google-places.ts             │
│ scrape-google-places-api.ts convert-manual-places.ts            │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │      NDJSON File       │
                    │  (Sanity format)       │
                    └───────────┬────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      IMPORT SCRIPT                               │
├─────────────────────────────────────────────────────────────────┤
│                  import-to-sanity.ts                             │
│            (validates + imports to Sanity)                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │      Sanity CMS        │
                    │    (production)        │
                    └────────────────────────┘
```

---

## Common Workflows

### Import Your Google Maps Saved Places

```bash
# 1. Export from Google Takeout
# 2. Convert with enrichment
GOOGLE_PLACES_API_KEY=... npx tsx scripts/enrich-google-places.ts \
  ~/Downloads/Takeout/Saved/Saved\ Places.json \
  places.ndjson \
  coffee

# 3. Import
npx tsx scripts/import-to-sanity.ts places.ndjson production --replace
```

### Search and Import from Google Places API

```bash
# 1. Search
GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts \
  --query "specialty coffee Prague" \
  --output coffee-prague.ndjson \
  --domain coffee

# 2. Import
npx tsx scripts/import-to-sanity.ts coffee-prague.ndjson production --replace
```

### Manual Curation with Enrichment

```bash
# 1. Create places.csv with name,address,domain columns
# 2. Convert and enrich
GOOGLE_PLACES_API_KEY=... npx tsx scripts/enrich-place-list.ts \
  --input places.csv \
  --output places.ndjson

# 3. Import
npx tsx scripts/import-to-sanity.ts places.ndjson production --replace
```

---

## NDJSON Format

Each line is a JSON object matching the Place schema:

```json
{"_id":"place-slug","_type":"place","name":"Name","slug":{"_type":"slug","current":"slug"},"domains":["coffee"],"location":{"_type":"geolocation","geopoint":{"_type":"geopoint","lat":50.07,"lng":14.43},"address":{"city":"Prague"}}}
```

See [PLACE-DATA-MODEL.md](../PLACE-DATA-MODEL.md) for full schema reference.

---

## Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `GOOGLE_PLACES_API_KEY` | Enrichment, API scraping | Google Cloud API key |
| `SANITY_PROJECT_ID` | API import | Sanity project ID |
| `SANITY_DATASET` | API import | Target dataset |
| `SANITY_TOKEN` | API import | Write token |

---

## Troubleshooting

### "File not found"
Use absolute paths or paths relative to project root.

### "Invalid NDJSON"
Each line must be valid JSON. Check with:
```bash
cat file.ndjson | head -1 | jq .
```

### "Document already exists"
Use `--replace` flag:
```bash
npx tsx scripts/import-to-sanity.ts places.ndjson production --replace
```

### "API rate limit"
Add delays between requests or split into smaller batches.
