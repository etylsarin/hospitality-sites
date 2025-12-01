# Importing NDJSON to Sanity

This guide explains how to import place data (in NDJSON format) into Sanity CMS.

## Overview

**Prerequisites:**
- NDJSON file with place data (see conversion guides)
- Sanity CLI installed (`npm install -g @sanity/cli`)
- Access to your Sanity project

**Import Options:**
1. **CLI Import** - Direct `sanity dataset import` command
2. **Script Import** - Automated script with validation and progress

---

## Quick Start

```bash
# Using the import script (recommended)
npx tsx scripts/import-to-sanity.ts places.ndjson production

# Or using Sanity CLI directly
cd apps/cms-studio && sanity dataset import ../../places.ndjson production --replace
```

---

## Option 1: Import Script (Recommended)

The import script provides:
- ✅ Validation before import
- ✅ Progress reporting
- ✅ Error handling with details
- ✅ Dry-run mode
- ✅ Automatic dataset selection

### Usage

```bash
npx tsx scripts/import-to-sanity.ts <ndjson-file> [dataset] [options]
```

**Arguments:**
| Argument | Description | Required |
|----------|-------------|----------|
| `ndjson-file` | Path to NDJSON file | Yes |
| `dataset` | Target dataset: `production`, `staging`, `development` | No (default: `production`) |

**Options:**
| Option | Description |
|--------|-------------|
| `--replace` | Replace existing documents with same `_id` |
| `--missing` | Only import documents that don't exist |
| `--dry-run` | Validate without importing |

### Examples

```bash
# Import to production (fails if documents exist)
npx tsx scripts/import-to-sanity.ts places.ndjson production

# Replace existing documents
npx tsx scripts/import-to-sanity.ts places.ndjson production --replace

# Only import new documents
npx tsx scripts/import-to-sanity.ts places.ndjson production --missing

# Validate without importing
npx tsx scripts/import-to-sanity.ts places.ndjson production --dry-run

# Import to staging
npx tsx scripts/import-to-sanity.ts places.ndjson staging --replace
```

---

## Option 2: Sanity CLI Direct

### Basic Commands

```bash
cd apps/cms-studio

# Import (fails if documents exist)
sanity dataset import <path-to-ndjson> <dataset>

# Replace existing documents
sanity dataset import <path-to-ndjson> <dataset> --replace

# Only import missing documents
sanity dataset import <path-to-ndjson> <dataset> --missing

# Allow import even if some assets fail
sanity dataset import <path-to-ndjson> <dataset> --allow-failing-assets
```

### Examples

```bash
cd apps/cms-studio

# Import places to production
sanity dataset import ../../places.ndjson production --replace

# Import to staging
sanity dataset import ../../places.ndjson staging --replace
```

---

## NDJSON Format Reference

Each line must be a valid JSON object with required Sanity fields:

```json
{
  "_id": "place-unique-slug",
  "_type": "place",
  "name": "Place Name",
  "slug": { "_type": "slug", "current": "unique-slug" },
  "domains": ["coffee"],
  "location": {
    "_type": "geolocation",
    "geopoint": { "_type": "geopoint", "lat": 50.0755, "lng": 14.4378 },
    "address": { "formattedAddress": "Street 123, City" }
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | string | Unique document ID (e.g., `place-cafe-name`) |
| `_type` | string | Must be `place` |
| `name` | string | Place name |
| `slug` | object | URL slug with `_type` and `current` |
| `domains` | array | At least one domain: `beer`, `coffee`, `vino`, `guide` |
| `location` | object | Geolocation with geopoint |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `categories` | array | Category tags (e.g., `cafe`, `brewery`) |
| `price` | string | Price level: `low`, `average`, `high`, `very-high` |
| `description` | string | Markdown description |
| `contact` | object | Phone, email, bookingUrl |
| `socialLinks` | object | Website, social media URLs |
| `openingHours` | object | Weekly schedule |
| `serving` | array | What the place serves |
| `services` | array | Amenities and features |
| `images` | array | Image assets |
| `externalIds` | object | Google Place ID, etc. |

---

## Pre-Import Checklist

Before importing, verify:

- [ ] NDJSON file is valid (one JSON object per line)
- [ ] All `_id` values are unique
- [ ] All `_type` values are `place`
- [ ] All required fields are present
- [ ] Domain values are valid
- [ ] Coordinate values are reasonable

### Validation Commands

```bash
# Check file is valid NDJSON
cat places.ndjson | while read line; do echo "$line" | jq . > /dev/null || echo "Invalid: $line"; done

# Count documents
wc -l places.ndjson

# Check for duplicate IDs
cat places.ndjson | jq -r '._id' | sort | uniq -d

# View sample document
head -1 places.ndjson | jq .
```

---

## Post-Import Tasks

After importing:

1. **Verify in Sanity Studio**
   - Open CMS Studio
   - Check Places list
   - Spot-check a few documents

2. **Check for errors**
   ```bash
   # View import logs
   sanity dataset import places.ndjson production --replace 2>&1 | tee import.log
   ```

3. **Update search indexes**
   - Sanity automatically indexes new documents
   - May take a few minutes for large imports

---

## Backup & Restore

### Before Import

```bash
cd apps/cms-studio

# Export current dataset
sanity dataset export production backup-$(date +%Y%m%d).tar.gz
```

### Restore if Needed

```bash
# Delete current dataset and recreate
sanity dataset delete production
sanity dataset create production

# Restore from backup
sanity dataset import backup-20231215.tar.gz production
```

---

## Troubleshooting

### "Document already exists"

Use `--replace` to overwrite existing documents:
```bash
sanity dataset import places.ndjson production --replace
```

Or use `--missing` to skip existing:
```bash
sanity dataset import places.ndjson production --missing
```

### "Invalid document"

Check the specific document format:
```bash
# Find invalid JSON
cat places.ndjson | head -20 | while read line; do 
  echo "$line" | jq . > /dev/null 2>&1 || echo "Invalid: $line"
done
```

### "Rate limit exceeded"

For very large imports (1000+ documents):
- Split into smaller batches
- Import during off-peak hours
- Contact Sanity support for rate limit increase

### "Asset not found"

If importing with images:
```bash
sanity dataset import places.ndjson production --allow-failing-assets
```

---

## API Import (Advanced)

For programmatic imports, use the Sanity client:

```typescript
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  token: 'your-write-token',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Batch import with transaction
const places = [...]; // Array of place objects
const transaction = client.transaction();

for (const place of places) {
  transaction.createOrReplace(place);
}

await transaction.commit({ visibility: 'deferred' });
```

---

## Related Guides

- [Convert Google Takeout to NDJSON](./GOOGLE-TAKEOUT-CONVERSION.md)
- [Scrape Google Maps to NDJSON](./SCRAPE-GOOGLE-MAPS.md)
- [Scrape TripAdvisor to NDJSON](./SCRAPE-TRIPADVISOR.md)
- [Place Data Model Reference](../PLACE-DATA-MODEL.md)
