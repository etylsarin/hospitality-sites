# @hospitality-sites/data-pipeline

A comprehensive data pipeline for hospitality venue data: search, convert, enrich, validate, and import.

## Features

- **Web Scraping**: Puppeteer Cluster-based scrapers (see [docs/scrapers/](../../docs/scrapers/))
- **Google Places API Search**: Text and nearby search with details
- **Data Conversion**: Google Takeout GeoJSON → Sanity NDJSON
- **Data Enrichment**: Add details via Google Places API
- **Deduplication**: Detect duplicates by location/name
- **Validation**: Ensure data quality before import
- **Sanity Import**: Upload to Sanity CMS with conflict handling

## Architecture

```
libs/data-pipeline/src/
├── base-scraper.ts                  # Abstract base class
├── cli.ts                           # Unified CLI entry point
├── index.ts                         # Main exports
├── cluster/
│   └── cluster-manager.ts           # Puppeteer Cluster setup
├── configs/                         # Scraper configurations (gitignored)
├── scrapers/                        # Web scrapers (gitignored, see docs/scrapers/)
├── processors/
│   ├── converter.ts                 # Google Takeout → NDJSON
│   ├── enricher.ts                  # Google Places API enrichment
│   ├── google-places-search.ts      # Google Places API search
│   ├── deduplicator.ts              # Duplicate detection
│   ├── normalizer.ts                # Data normalization
│   └── validator.ts                 # Data validation
├── sanity/
│   ├── client.ts                    # Sanity client wrapper
│   └── uploader.ts                  # Document upload
└── types/
    ├── index.ts
    ├── job.types.ts
    ├── scraped-place.types.ts
    └── config.types.ts
```

## Documentation

- **Scrapers**: See [docs/scrapers/](../../docs/scrapers/) for scraper-specific documentation
- **Processors**: See [docs/processors/](../../docs/processors/) for data processing documentation

## CLI Commands

### Google Places API Search

```bash
# Text search
GOOGLE_PLACES_API_KEY=... yarn nx run data-pipeline:cli -- search \
  --query "specialty coffee Prague" \
  --output temp/coffee.ndjson \
  --domain coffee

# Nearby search
GOOGLE_PLACES_API_KEY=... yarn nx run data-pipeline:cli -- search \
  --location "50.0755,14.4378" \
  --radius 10000 \
  --type cafe \
  --output temp/cafes.ndjson \
  --domain coffee
```

### Data Conversion

```bash
# Convert Google Takeout GeoJSON to NDJSON
yarn nx run data-pipeline:cli -- convert \
  input.geojson output.ndjson \
  --domain coffee \
  --category cafe
```

### Data Enrichment

```bash
# Enrich places with Google Places API data
GOOGLE_PLACES_API_KEY=... yarn nx run data-pipeline:cli -- enrich \
  input.ndjson output.ndjson \
  --rate-limit 200
```

### Validation

```bash
# Validate NDJSON file
yarn nx run data-pipeline:cli -- validate input.ndjson
yarn nx run data-pipeline:cli -- validate input.ndjson --strict
```

### Import to Sanity

```bash
# Import to Sanity CMS
yarn nx run data-pipeline:cli -- import \
  input.ndjson \
  --dataset production \
  --replace

# Dry run (validate without importing)
yarn nx run data-pipeline:cli -- import input.ndjson --dry-run
```

## Programmatic Usage

```typescript
import { 
  searchPlaces,
  convertGoogleTakeoutFile,
  enrichPlaces,
  validatePlaces,
  uploadPlaces,
} from 'data-pipeline';

// Search Google Places API
const places = await searchPlaces({
  apiKey: process.env.GOOGLE_PLACES_API_KEY,
  query: 'specialty coffee Prague',
  domain: 'coffee',
  maxResults: 60,
});

// Convert Google Takeout
const converted = convertGoogleTakeoutFile('input.geojson', {
  domain: 'coffee',
});

// Enrich places
const enriched = await enrichPlaces(places, {
  apiKey: process.env.GOOGLE_PLACES_API_KEY,
});

// Validate
const validation = validatePlaces(places);

// Upload to Sanity
const stats = await uploadPlaces(places, {
  dataset: 'production',
  replace: true,
});
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_PLACES_API_KEY` | Google Places API key | Required for search/enrich |
| `SANITY_PROJECT_ID` | Sanity project ID | Required for import |
| `SANITY_DATASET` | Sanity dataset | `production` |
| `SANITY_API_TOKEN` | Sanity API token | Required for import |

## Data Pipeline Workflow

1. **Source** → Scrape/Search/Convert raw data
2. **Enrich** → Add details via Google Places API  
3. **Validate** → Check data quality
4. **Deduplicate** → Remove duplicates
5. **Import** → Upload to Sanity CMS

```bash
# Example full pipeline
yarn nx run data-pipeline:cli -- search --query "breweries Prague" -o temp/raw.ndjson -d beer
yarn nx run data-pipeline:cli -- enrich temp/raw.ndjson temp/enriched.ndjson
yarn nx run data-pipeline:cli -- validate temp/enriched.ndjson
yarn nx run data-pipeline:cli -- import temp/enriched.ndjson --dataset production
```

## Legal Notice

⚠️ Web scraping may violate terms of service. Use responsibly and respect robots.txt.
