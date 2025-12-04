#!/usr/bin/env npx tsx
/**
 * Google Places API Search to NDJSON
 * 
 * Searches Google Places API and converts results to Sanity NDJSON format.
 * 
 * Usage:
 *   GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts [options]
 * 
 * Options:
 *   --query       Search query (e.g., "coffee shops in Prague")
 *   --location    Center point as "lat,lng" (e.g., "50.0755,14.4378")
 *   --radius      Search radius in meters (default: 5000)
 *   --type        Google place type (e.g., cafe, bar, restaurant)
 *   --output      Output NDJSON file path (required)
 *   --domain      Domain: beer, coffee, vino, guide (required)
 *   --max         Maximum results (default: 60)
 */

import * as fs from 'fs';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const RATE_LIMIT_MS = 200;

interface PlaceResult {
  place_id: string;
  name: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  formatted_address?: string;
  types?: string[];
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now?: boolean };
  photos?: Array<{ photo_reference: string }>;
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  price_level?: number;
  rating?: number;
  types?: string[];
  opening_hours?: {
    weekday_text?: string[];
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
  };
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location: { lat: number; lng: number };
  };
}

const TYPE_TO_CATEGORY: Record<string, { value: string; label: string }> = {
  brewery: { value: 'brewery', label: 'Brewery' },
  bar: { value: 'pub', label: 'Pub' },
  night_club: { value: 'pub', label: 'Pub' },
  cafe: { value: 'cafe', label: 'Cafe' },
  bakery: { value: 'bakery', label: 'Bakery' },
  restaurant: { value: 'restaurant', label: 'Restaurant' },
  meal_takeaway: { value: 'bistro', label: 'Bistro' },
};

const PRICE_LEVEL_MAP: Record<number, string> = {
  0: 'low',
  1: 'low',
  2: 'average',
  3: 'high',
  4: 'very-high',
};

const DAY_MAP: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function textSearch(query: string, pageToken?: string): Promise<{ results: PlaceResult[]; nextPageToken?: string }> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY!);
  if (pageToken) {
    url.searchParams.set('pagetoken', pageToken);
  }
  
  const response = await fetch(url.toString());
  const data = await response.json();
  
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`API error: ${data.status} - ${data.error_message || ''}`);
  }
  
  return {
    results: data.results || [],
    nextPageToken: data.next_page_token,
  };
}

async function nearbySearch(
  lat: number, 
  lng: number, 
  radius: number,
  type?: string,
  pageToken?: string
): Promise<{ results: PlaceResult[]; nextPageToken?: string }> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radius.toString());
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY!);
  if (type) {
    url.searchParams.set('type', type);
  }
  if (pageToken) {
    url.searchParams.set('pagetoken', pageToken);
  }
  
  const response = await fetch(url.toString());
  const data = await response.json();
  
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`API error: ${data.status} - ${data.error_message || ''}`);
  }
  
  return {
    results: data.results || [],
    nextPageToken: data.next_page_token,
  };
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', [
    'place_id',
    'name',
    'formatted_address',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'url',
    'price_level',
    'rating',
    'types',
    'opening_hours',
    'address_components',
    'geometry',
  ].join(','));
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY!);
  
  const response = await fetch(url.toString());
  const data = await response.json();
  
  if (data.status !== 'OK') {
    console.warn(`  Warning: Could not get details for ${placeId}: ${data.status}`);
    return null;
  }
  
  return data.result;
}

function parseAddressComponents(components?: PlaceDetails['address_components']): Record<string, string> {
  const result: Record<string, string> = {};
  if (!components) return result;
  
  for (const component of components) {
    if (component.types.includes('street_number')) {
      result.streetNumber = component.long_name;
    } else if (component.types.includes('route')) {
      result.street = component.long_name;
    } else if (component.types.includes('locality')) {
      result.city = component.long_name;
    } else if (component.types.includes('postal_code')) {
      result.postalCode = component.long_name;
    } else if (component.types.includes('administrative_area_level_1')) {
      result.region = component.long_name;
    } else if (component.types.includes('country')) {
      result.country = component.long_name;
      result.countryCode = component.short_name;
    }
  }
  
  return result;
}

function convertOpeningHours(hours?: PlaceDetails['opening_hours']) {
  if (!hours?.periods) return undefined;
  
  const regular = hours.periods.map(period => {
    const day = DAY_MAP[period.open.day];
    const is24Hours = period.open.time === '0000' && !period.close;
    
    return {
      day,
      isClosed: false,
      is24Hours,
      slots: is24Hours ? [] : [{
        open: `${period.open.time.slice(0, 2)}:${period.open.time.slice(2)}`,
        close: period.close 
          ? `${period.close.time.slice(0, 2)}:${period.close.time.slice(2)}`
          : '23:59',
      }],
    };
  });
  
  return { regular, timezone: 'Europe/Prague' };
}

function mapCategories(types?: string[]): Array<{ value: string; label: string }> {
  if (!types) return [];
  
  const categories: Array<{ value: string; label: string }> = [];
  const seen = new Set<string>();
  
  for (const type of types) {
    const category = TYPE_TO_CATEGORY[type];
    if (category && !seen.has(category.value)) {
      categories.push(category);
      seen.add(category.value);
    }
  }
  
  return categories;
}

function convertToSanityPlace(details: PlaceDetails, domain: string, seenSlugs: Set<string>): any {
  let slug = slugify(details.name);
  let counter = 1;
  while (seenSlugs.has(slug)) {
    slug = `${slugify(details.name)}-${counter++}`;
  }
  seenSlugs.add(slug);
  
  const place: any = {
    _id: `place-${slug}`,
    _type: 'place',
    name: details.name,
    slug: { _type: 'slug', current: slug },
    domains: [domain],
    location: {
      _type: 'geolocation',
      geopoint: {
        _type: 'geopoint',
        lat: details.geometry?.location.lat || 0,
        lng: details.geometry?.location.lng || 0,
      },
      address: {
        formattedAddress: details.formatted_address,
        ...parseAddressComponents(details.address_components),
      },
    },
    externalIds: {
      googlePlaceId: details.place_id,
    },
  };
  
  const categories = mapCategories(details.types);
  if (categories.length > 0) {
    place.categories = categories;
  }
  
  if (details.price_level !== undefined) {
    place.price = PRICE_LEVEL_MAP[details.price_level];
  }
  
  if (details.international_phone_number) {
    place.contact = { phone: details.international_phone_number };
  }
  
  const socialLinks: any = {};
  if (details.website) socialLinks.website = details.website;
  if (details.url) socialLinks.googleMaps = details.url;
  if (Object.keys(socialLinks).length > 0) {
    place.socialLinks = socialLinks;
  }
  
  const openingHours = convertOpeningHours(details.opening_hours);
  if (openingHours) {
    place.openingHours = openingHours;
  }
  
  return place;
}

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
      result[key] = value;
      if (value !== 'true') i++;
    }
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  
  if (args.help || (!args.query && !args.location)) {
    console.log(`
Google Places API Search to NDJSON

Usage:
  GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts [options]

Options:
  --query       Search query (e.g., "coffee shops in Prague")
  --location    Center point as "lat,lng" (e.g., "50.0755,14.4378")
  --radius      Search radius in meters (default: 5000)
  --type        Google place type (e.g., cafe, bar, restaurant)
  --output      Output NDJSON file path (required)
  --domain      Domain: beer, coffee, vino, guide (required)
  --max         Maximum results (default: 60)

Examples:
  # Text search
  GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts \\
    --query "specialty coffee Prague" \\
    --output coffee.ndjson \\
    --domain coffee

  # Location search
  GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places-api.ts \\
    --location "50.0755,14.4378" \\
    --radius 10000 \\
    --type cafe \\
    --output cafes.ndjson \\
    --domain coffee
`);
    process.exit(args.help ? 0 : 1);
  }
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY environment variable is required');
    process.exit(1);
  }
  
  if (!args.output) {
    console.error('❌ --output is required');
    process.exit(1);
  }
  
  if (!args.domain || !['beer', 'coffee', 'vino', 'guide'].includes(args.domain)) {
    console.error('❌ --domain is required (beer, coffee, vino, guide)');
    process.exit(1);
  }
  
  const maxResults = parseInt(args.max || '60', 10);
  const radius = parseInt(args.radius || '5000', 10);
  
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              Google Places API → NDJSON                        ║
╚════════════════════════════════════════════════════════════════╝
`);
  
  // Collect places from search
  const allResults: PlaceResult[] = [];
  let pageToken: string | undefined;
  let pageNum = 1;
  
  console.log('🔍 Searching for places...\n');
  
  do {
    console.log(`   Page ${pageNum}...`);
    
    let searchResult;
    if (args.query) {
      searchResult = await textSearch(args.query, pageToken);
    } else {
      const [lat, lng] = args.location!.split(',').map(Number);
      searchResult = await nearbySearch(lat, lng, radius, args.type, pageToken);
    }
    
    allResults.push(...searchResult.results);
    pageToken = searchResult.nextPageToken;
    pageNum++;
    
    console.log(`   Found ${searchResult.results.length} places (total: ${allResults.length})`);
    
    if (allResults.length >= maxResults) break;
    if (pageToken) {
      // Google requires a delay before using next_page_token
      await sleep(2000);
    }
  } while (pageToken && pageNum <= 3);
  
  console.log(`\n✅ Found ${allResults.length} places total\n`);
  
  // Get details for each place
  console.log('📋 Fetching place details...\n');
  
  const places: any[] = [];
  const seenSlugs = new Set<string>();
  const seenPlaceIds = new Set<string>();
  
  for (let i = 0; i < Math.min(allResults.length, maxResults); i++) {
    const result = allResults[i];
    
    // Skip duplicates
    if (seenPlaceIds.has(result.place_id)) continue;
    seenPlaceIds.add(result.place_id);
    
    console.log(`   [${i + 1}/${Math.min(allResults.length, maxResults)}] ${result.name}`);
    
    const details = await getPlaceDetails(result.place_id);
    await sleep(RATE_LIMIT_MS);
    
    if (details) {
      const place = convertToSanityPlace(details, args.domain, seenSlugs);
      places.push(place);
    }
  }
  
  // Write NDJSON
  const ndjson = places.map(p => JSON.stringify(p)).join('\n');
  fs.writeFileSync(args.output, ndjson);
  
  console.log(`
✅ Conversion complete!

   📄 Output: ${args.output}
   📊 Places: ${places.length}

Next steps:
   npx tsx scripts/import-to-sanity.ts ${args.output} production --replace
`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
