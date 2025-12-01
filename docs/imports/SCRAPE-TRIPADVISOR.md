# Scraping TripAdvisor to NDJSON

This guide explains options for extracting place data from TripAdvisor.

> ⚠️ **Important:** Web scraping TripAdvisor violates their Terms of Service and may result in IP blocking or legal action. This document is for educational purposes. Consider official data partnerships or manual curation instead.

## Overview

**Legal Alternatives:**
- [TripAdvisor Content API](https://developer-tripadvisor.com/content-api/) - Official API (requires partnership)
- Manual curation - Copy data by hand for small datasets
- Affiliate program - Access to limited data for partners

**Why TripAdvisor is difficult to scrape:**
- Aggressive anti-bot protection
- Dynamic JavaScript rendering
- Frequent HTML structure changes
- Legal enforcement

---

## Option 1: TripAdvisor Content API (Official)

### Requirements
- Business partnership with TripAdvisor
- API access approval
- Compliance with usage terms

### Apply for Access
1. Visit [TripAdvisor Developer Portal](https://developer-tripadvisor.com/)
2. Apply for Content API access
3. Wait for approval (can take weeks)
4. Receive API credentials

### API Capabilities
- Location search
- Location details
- Reviews
- Photos
- Ratings

### Usage (if approved)

```bash
TRIPADVISOR_API_KEY=... npx tsx scripts/fetch-tripadvisor.ts \
  --query "coffee shops Prague" \
  --output places.ndjson \
  --domain coffee
```

---

## Option 2: Manual Curation

The most reliable and legal approach for small datasets.

### Workflow

1. **Search TripAdvisor** for places in your target area
2. **Create a spreadsheet** with key data
3. **Convert to NDJSON** using our script

### Spreadsheet Template (CSV)

```csv
name,address,tripadvisorUrl,rating,priceLevel,categories,domain
"Café Savoy","Vítězná 5, Prague","https://www.tripadvisor.com/...",4.5,$$,"cafe",coffee
"Pivovar Marina","Janáčkovo nábř. 478/21, Prague","https://www.tripadvisor.com/...",4.2,$$,"brewery,pub",beer
```

### Convert to NDJSON

```bash
npx tsx scripts/convert-manual-places.ts \
  --input places.csv \
  --output places.ndjson
```

### Data to Capture Manually

| Field | TripAdvisor Location |
|-------|---------------------|
| Name | Title of the listing |
| Address | Below the name |
| Rating | Star rating (1-5) |
| Price Level | $, $$, $$$, $$$$ |
| Categories | "Restaurant", "Coffee & Tea", etc. |
| URL | Page URL (for reference) |
| Coordinates | From map (optional) |

---

## Option 3: Third-Party Data Providers

Services that legally aggregate and resell location data:

### Providers

| Provider | Data Source | Cost |
|----------|-------------|------|
| [Foursquare Places](https://location.foursquare.com/products/places-data/) | Foursquare/Swarm | $$ |
| [Factual](https://www.foursquare.com/products/factual/) | Multiple sources | $$$ |
| [Data Axle](https://www.data-axle.com/) | Business directories | $$$ |
| [Yelp Fusion API](https://www.yelp.com/developers) | Yelp | Free tier |

### Yelp Fusion API (Free Alternative)

Yelp offers a free API tier with similar data:

```bash
YELP_API_KEY=... npx tsx scripts/fetch-yelp.ts \
  --location "Prague, CZ" \
  --categories "coffee,cafes" \
  --output places.ndjson \
  --domain coffee
```

---

## Option 4: Browser Extension Export

For personal use with small datasets:

### Extensions That Work (Sometimes)

1. **Instant Data Scraper** (Chrome)
   - May work on TripAdvisor list pages
   - Results vary due to anti-scraping

2. **Web Scraper** (Chrome)
   - Create custom scraping recipes
   - Requires technical setup

### Workflow

1. Install extension
2. Navigate to TripAdvisor search results
3. Configure scraper for visible elements
4. Export results
5. Convert to NDJSON:

```bash
npx tsx scripts/convert-scraped-places.ts \
  --input scraped-data.json \
  --source tripadvisor \
  --output places.ndjson \
  --domain coffee
```

---

## Data Mapping

### TripAdvisor Price → Our Price

| TripAdvisor | Our Value |
|-------------|-----------|
| $ | `low` |
| $$ | `average` |
| $$$ | `high` |
| $$$$ | `very-high` |

### TripAdvisor Categories → Our Categories

| TripAdvisor | Our Category |
|-------------|--------------|
| Coffee & Tea | `cafe` |
| Cafés | `cafe` |
| Bakeries | `bakery` |
| Bars & Pubs | `pub` |
| Brewpubs | `brewery` |
| Restaurants | `restaurant` |
| Quick Bites | `bistro` |

### TripAdvisor Rating → Our Rating

TripAdvisor uses 1-5 scale with half points (4.5, etc.)
Our schema supports the same scale.

---

## Example: Manual → NDJSON Conversion

### Input (CSV)

```csv
name,address,city,country,rating,priceLevel,categories,tripadvisorUrl,domain
"Můj šálek kávy","Křižíkova 105","Prague","Czech Republic",4.5,$$,"Coffee & Tea","https://www.tripadvisor.com/Restaurant_Review-...",coffee
"Pivovar Marina","Janáčkovo nábř.","Prague","Czech Republic",4.2,$$,"Brewpubs","https://www.tripadvisor.com/Restaurant_Review-...",beer
```

### Output (NDJSON)

```json
{"_id":"place-muj-salek-kavy","_type":"place","name":"Můj šálek kávy","slug":{"_type":"slug","current":"muj-salek-kavy"},"domains":["coffee"],"categories":[{"value":"cafe","label":"Cafe"}],"location":{"_type":"geolocation","geopoint":{"_type":"geopoint","lat":50.0922,"lng":14.4510},"address":{"street":"Křižíkova","streetNumber":"105","city":"Prague","country":"Czech Republic","countryCode":"CZ"}},"price":"average","socialLinks":{"tripadvisor":"https://www.tripadvisor.com/Restaurant_Review-..."}}
```

---

## Enrichment with Google Places API

After manual curation, enrich with coordinates and details:

```bash
GOOGLE_PLACES_API_KEY=... npx tsx scripts/enrich-google-places.ts \
  --input places-manual.ndjson \
  --output places-enriched.ndjson
```

This adds:
- Precise coordinates
- Opening hours
- Phone number
- Website
- Google Place ID

---

## Legal Considerations

### ❌ Prohibited
- Automated scraping of TripAdvisor
- Circumventing anti-bot measures
- Bulk data extraction
- Commercial use of scraped data

### ⚠️ Gray Area
- Browser extensions for personal use
- Small-scale manual copying

### ✅ Legal
- TripAdvisor Content API (with partnership)
- Manual curation
- Third-party data providers
- Alternative APIs (Yelp, Foursquare)

---

## Recommendations

1. **For production data:** Use Google Places API or Yelp Fusion
2. **For small datasets:** Manual curation + API enrichment
3. **For research:** Third-party data providers
4. **Avoid:** Automated TripAdvisor scraping

---

## Next Steps

→ [Import NDJSON to Sanity](./SANITY-IMPORT.md)
