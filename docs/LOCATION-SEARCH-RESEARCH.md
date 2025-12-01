# Location Search Implementation Research

This document contains comprehensive research on implementing location-based search functionality for the hospitality sites.

## Overview

**User Flow:**
1. User enters a location (city, county, district, or any geographic area)
2. System geocodes the search term to get coordinates and bounding box
3. System queries Sanity for places within the bounding box
4. Results are sorted by distance from the search area center
5. User sees list of matching places, closest first

## Current Data Structure

### Place Location in Sanity

```typescript
// From libs/queries/src/lib/location/location.ts
interface Location {
  geopoint: Geopoint;  // { _type: 'geopoint', lat: number, lng: number }
  address: string;
}
```

### Existing Query

```typescript
// From libs/queries/src/lib/list/list.ts
*[_type == "place" && $domain in domains && location.address match "${locationQuery}*"]{
  slug,
  name,
  reviews,
  categories,
  price,
  established,
  location,
  images[] {"url": asset->url}
}
```

**Limitation:** Current query only does text matching on address string.

---

## Geocoding API Options

### Option 1: Google Geocoding API ⭐ RECOMMENDED

**Endpoint:** `https://maps.googleapis.com/maps/api/geocode/json`

**Pros:**
- Already integrated (using `NEXT_PUBLIC_GOOGLE_MAP_API_KEY`)
- High accuracy and comprehensive data
- Excellent international coverage
- Returns precise `viewport` bounds for any location type

**Cons:**
- Costs ~$5 per 1000 requests (after free tier of 28,500/month)
- Requires API key management

**Response Structure:**
```json
{
  "results": [
    {
      "geometry": {
        "location": {
          "lat": 48.8566,
          "lng": 2.3522
        },
        "viewport": {
          "northeast": { "lat": 48.9021449, "lng": 2.4699208 },
          "southwest": { "lat": 48.815573, "lng": 2.224199 }
        },
        "bounds": {
          "northeast": { "lat": 48.9021449, "lng": 2.4699208 },
          "southwest": { "lat": 48.815573, "lng": 2.224199 }
        }
      },
      "formatted_address": "Paris, France",
      "types": ["locality", "political"]
    }
  ]
}
```

**Key Fields:**
- `geometry.location` - Center point (lat/lng)
- `geometry.viewport` - Recommended display bounds (northeast/southwest)
- `geometry.bounds` - Full geographic bounds (optional, for administrative areas)

### Option 2: Nominatim (OpenStreetMap) - FREE Alternative

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Pros:**
- Completely FREE
- No API key required
- Open data

**Cons:**
- Rate limited (1 request/second on public server)
- Requires attribution
- Slightly less coverage than Google
- Self-hosting required for production scale

**Response Structure:**
```json
{
  "lat": "51.5073219",
  "lon": "-0.1276474",
  "boundingbox": ["51.3473219", "51.6673219", "-0.2876474", "0.0323526"],
  "display_name": "London, Greater London, England, SW1A 2DU, United Kingdom"
}
```

**Key Fields:**
- `lat`, `lon` - Center point
- `boundingbox` - [minLat, maxLat, minLon, maxLon]

**Usage Policy:** Must include `User-Agent` header, max 1 request/second.

---

## Sanity GROQ Geo Functions

### Available Functions

| Function | Description |
|----------|-------------|
| `geo::distance(point1, point2)` | Returns distance in meters between two geopoints |
| `geo::latLng(lat, lng)` | Creates a geo object from coordinates |
| `geo::contains(polygon, point)` | Checks if polygon contains a point |
| `geo::intersects(geo1, geo2)` | Checks if two areas overlap |
| `geo(obj)` | Coerces object with lat/lng to geo type |

### Bounding Box Query Pattern

GROQ doesn't have a native bounding box function, but we can use coordinate comparisons:

```groq
*[_type == "place" 
  && $domain in domains
  && location.geopoint.lat >= $swLat
  && location.geopoint.lat <= $neLat
  && location.geopoint.lng >= $swLng
  && location.geopoint.lng <= $neLng
] | order(
  geo::distance(
    location.geopoint,
    geo::latLng($centerLat, $centerLng)
  ) asc
) {
  slug,
  name,
  location,
  "distance": geo::distance(
    location.geopoint,
    geo::latLng($centerLat, $centerLng)
  ),
  // ... other fields
}
```

**Parameters:**
- `$swLat`, `$swLng` - Southwest corner of bounding box
- `$neLat`, `$neLng` - Northeast corner of bounding box
- `$centerLat`, `$centerLng` - Center point for distance calculation

---

## Implementation Architecture

### 1. Geocoding Service

```typescript
// libs/queries/src/lib/geocoding/geocoding.ts

export interface GeocodingResult {
  center: { lat: number; lng: number };
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  displayName: string;
}

export async function geocodeLocation(
  query: string,
  apiKey: string
): Promise<GeocodingResult | null> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?` +
    `address=${encodeURIComponent(query)}&key=${apiKey}`
  );
  
  const data = await response.json();
  
  if (data.status !== 'OK' || !data.results.length) {
    return null;
  }
  
  const result = data.results[0];
  const { geometry, formatted_address } = result;
  
  // Use viewport if available, otherwise fall back to location
  const bounds = geometry.viewport || {
    northeast: geometry.location,
    southwest: geometry.location
  };
  
  return {
    center: geometry.location,
    bounds,
    displayName: formatted_address
  };
}
```

### 2. Location Search Query

```typescript
// libs/queries/src/lib/list/list.ts (updated)

export interface LocationSearchParams {
  domain: string;
  sanity: SanityConfigProps;
  bounds?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  center?: { lat: number; lng: number };
}

export const queryListByLocation = async ({
  domain,
  sanity,
  bounds,
  center
}: LocationSearchParams) => {
  if (!bounds || !center) {
    // Fall back to regular query without location filter
    return await queryList({ domain, sanity });
  }

  return await client(sanity).fetch(groq`
    *[_type == "place" 
      && $domain in domains
      && location.geopoint.lat >= $swLat
      && location.geopoint.lat <= $neLat
      && location.geopoint.lng >= $swLng
      && location.geopoint.lng <= $neLng
    ] | order(
      geo::distance(
        location.geopoint,
        geo::latLng($centerLat, $centerLng)
      ) asc
    ) {
      slug,
      name,
      reviews,
      categories,
      price,
      established,
      location,
      "distance": geo::distance(
        location.geopoint,
        geo::latLng($centerLat, $centerLng)
      ),
      images[] {"url": asset->url}
    }
  `, {
    domain,
    swLat: bounds.southwest.lat,
    swLng: bounds.southwest.lng,
    neLat: bounds.northeast.lat,
    neLng: bounds.northeast.lng,
    centerLat: center.lat,
    centerLng: center.lng
  });
};
```

### 3. Next.js API Route

```typescript
// apps/tastebeer.eu/app/api/search/location/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation } from '@libs/queries';
import { queryListByLocation } from '@libs/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const domain = searchParams.get('domain') || 'tastebeer.eu';

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Maps API not configured' }, { status: 500 });
  }

  // 1. Geocode the search term
  const geocoded = await geocodeLocation(query, apiKey);
  if (!geocoded) {
    return NextResponse.json({ results: [], message: 'Location not found' });
  }

  // 2. Query Sanity for places within bounds
  const places = await queryListByLocation({
    domain,
    sanity: { projectId: process.env.SANITY_PROJECT_ID!, dataset: 'production' },
    bounds: geocoded.bounds,
    center: geocoded.center
  });

  return NextResponse.json({
    location: geocoded,
    results: places
  });
}
```

### 4. Frontend Component

```typescript
// libs/ui-kit/src/lib/components/location-search/location-search.tsx

'use client';

import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface LocationSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function LocationSearch({ 
  onSearch, 
  placeholder = 'Search by city, region...' 
}: LocationSearchProps) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.length >= 2) {
      onSearch(value);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <input
      type="search"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      className="location-search-input"
      aria-label="Search locations"
    />
  );
}
```

---

## Distance Formatting Utility

```typescript
// libs/ui-kit/src/lib/utils/distance.ts

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
```

---

## API Comparison Summary

| Feature | Google Geocoding | Nominatim |
|---------|-----------------|-----------|
| **Cost** | ~$5/1000 requests | FREE |
| **Rate Limit** | No hard limit | 1 req/sec |
| **Coverage** | Excellent | Very Good |
| **Accuracy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Viewport Data** | ✅ Yes | ✅ Yes (boundingbox) |
| **API Key** | Required | Not needed |
| **Production Ready** | Yes | Needs self-hosting |

### Recommendation

**Use Google Geocoding API** because:
1. Already paying for Google Maps API
2. 28,500 free geocoding requests/month
3. More reliable for production
4. Better structured viewport data

---

## Next Steps

1. [ ] Create `libs/queries/src/lib/geocoding/geocoding.ts`
2. [ ] Update `libs/queries/src/lib/list/list.ts` with geo query
3. [ ] Create API route `apps/tastebeer.eu/app/api/search/location/route.ts`
4. [ ] Create `LocationSearch` component in ui-kit
5. [ ] Integrate with list page
6. [ ] Add distance display to list items
7. [ ] Consider Google Places Autocomplete for better UX

---

## References

- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [Nominatim Search API](https://nominatim.org/release-docs/latest/api/Search/)
- [Sanity GROQ Geo Functions](https://www.sanity.io/docs/groq-functions#geo)
- [@sanity/google-maps-input](https://www.sanity.io/plugins/google-maps-input)
