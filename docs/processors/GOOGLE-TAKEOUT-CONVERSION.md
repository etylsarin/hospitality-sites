# Converting Google Takeout to NDJSON

This guide explains how to export your saved places from Google Maps and convert them to NDJSON format for Sanity import.

## Overview

**Workflow:**
1. Export from Google Takeout → GeoJSON file
2. Convert GeoJSON → NDJSON (Sanity format)
3. (Optional) Enrich with Google Places API
4. Import to Sanity (see [SANITY-IMPORT.md](./SANITY-IMPORT.md))

---

## Step 1: Export from Google Takeout

1. Go to [Google Takeout](https://takeout.google.com)
2. Click **"Deselect all"** at the top
3. Scroll down and find **"Saved"** (under Maps section)
4. Check the box next to "Saved"
5. Click **"Next step"**
6. Choose:
   - Delivery method: "Send download link via email"
   - Frequency: "Export once"
   - File type: "zip"
7. Click **"Create export"**
8. Wait for email, download and unzip

**Output:** `Saved Places.json` file in GeoJSON format

### GeoJSON Structure (from Takeout)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [14.4378, 50.0755]
      },
      "properties": {
        "Title": "Kavárna Místo",
        "Google Maps URL": "https://maps.google.com/?cid=12345678901234567890",
        "Location": {
          "Address": "Bubenečská 12, 160 00 Praha 6, Czechia",
          "Country Code": "CZ",
          "Geo Coordinates": {
            "Latitude": 50.0755,
            "Longitude": 14.4378
          }
        },
        "Published": "2023-05-15T10:30:00Z"
      }
    }
  ]
}
```

---

## Step 2: Convert to NDJSON

### Option A: Basic Conversion (No API Key Required)

```bash
npx tsx scripts/convert-google-places.ts <input.geojson> <output.ndjson> [domain]
```

**Arguments:**
| Argument | Description | Required |
|----------|-------------|----------|
| `input.geojson` | Path to Google Takeout GeoJSON file | Yes |
| `output.ndjson` | Output path for Sanity NDJSON file | Yes |
| `domain` | One of: `beer`, `coffee`, `vino`, `guide` | No (default: `coffee`) |

**Example:**
```bash
npx tsx scripts/convert-google-places.ts \
  ~/Downloads/Takeout/Saved/Saved\ Places.json \
  places-beer.ndjson \
  beer
```

**What it extracts:**
- ✅ Name
- ✅ Coordinates (lat/lng)
- ✅ Address (formatted)
- ✅ Country code
- ✅ Google Maps URL
- ✅ Google Place ID (from URL)

---

### Option B: Enriched Conversion (With Google Places API)

For richer data including opening hours, phone numbers, websites, and automatic categorization.

#### Prerequisites

1. Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable the **"Places API"** in your project
3. Set up billing (free tier: $200/month credit)

#### Usage

```bash
GOOGLE_PLACES_API_KEY=AIzaSy... npx tsx scripts/enrich-google-places.ts \
  <input.geojson> \
  <output.ndjson> \
  [domain]
```

**Example:**
```bash
GOOGLE_PLACES_API_KEY=AIzaSy... npx tsx scripts/enrich-google-places.ts \
  ~/Downloads/Takeout/Saved/Saved\ Places.json \
  places-enriched.ndjson \
  coffee
```

**Additional data fetched:**
- ✅ Opening hours (full weekly schedule)
- ✅ Phone number (international format)
- ✅ Website URL
- ✅ Price level → mapped to schema (low/average/high/very-high)
- ✅ Categories → auto-detected from Google types
- ✅ Full address components (street, city, postal code, region)

**Skip enrichment:**
```bash
npx tsx scripts/enrich-google-places.ts input.json output.ndjson coffee --no-enrich
```

---

## NDJSON Output Format

Each line is a valid JSON object matching the Sanity Place schema:

```json
{"_id":"place-kavarna-misto","_type":"place","name":"Kavárna Místo","slug":{"_type":"slug","current":"kavarna-misto"},"domains":["coffee"],"categories":[{"value":"cafe","label":"Cafe"}],"location":{"_type":"geolocation","geopoint":{"_type":"geopoint","lat":50.0755,"lng":14.4378},"address":{"formattedAddress":"Bubenečská 12, 160 00 Praha 6","city":"Prague","country":"Czech Republic","countryCode":"CZ"}},"price":"average","contact":{"phone":"+420 123 456 789"},"socialLinks":{"website":"https://kavarna-misto.cz","googleMaps":"https://maps.google.com/?cid=123456"},"externalIds":{"googlePlaceId":"ChIJxxx"}}
```

### Reviewing Output

```bash
# View first few places (formatted)
head -5 places.ndjson | jq .

# Count total places
wc -l places.ndjson

# Search for specific place
grep -i "kavarna" places.ndjson | jq .
```

---

## Manual Edits (Optional)

Before importing, you may want to edit the NDJSON file to:

- Add/adjust categories
- Set price ranges
- Add serving options (`espresso`, `craft-beer`, etc.)
- Add services (`wifi`, `outdoor-seating`, etc.)
- Fix incorrect data

**Tip:** Use VS Code with the NDJSON extension for easier editing.

---

## Troubleshooting

### "Error: Invalid GeoJSON"
Make sure you're using the correct file from Google Takeout. It should be:
- In the `Saved` folder
- Named something like `Saved Places.json`
- A valid GeoJSON FeatureCollection

### Duplicate place names
The script automatically handles duplicates by appending numbers to slugs:
- `cafe-name`
- `cafe-name-2`
- `cafe-name-3`

### Rate limiting with API
The enriched script includes rate limiting (100ms between calls). For large datasets (100+ places), consider:
- Running overnight
- Splitting into batches
- Increasing the delay in the script

### Missing place data
If a place can't be found in Google Places API:
- It may have closed or moved
- The coordinates might be slightly off
- Try searching manually on Google Maps

---

## Tips

1. **Create separate lists in Google Maps** for different domains before exporting
2. **Review the NDJSON** before importing - it's easier to fix in the file
3. **Back up existing data** before large imports
4. **Use the enriched script** for production data - it's worth the API cost

---

## Next Steps

→ [Import NDJSON to Sanity](./SANITY-IMPORT.md)
