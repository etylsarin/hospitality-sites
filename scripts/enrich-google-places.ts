#!/usr/bin/env npx tsx
/**
 * Enhanced converter that enriches Google Maps saved places with data from Google Places API.
 * 
 * ⚠️ KNOWN LIMITATIONS:
 *   - Requires valid coordinates for reliable place matching
 *   - Places with [0, 0] coordinates are skipped for API enrichment
 *   - Name-only lookup is not implemented (too unreliable - "The Brewhouse" matches globally)
 *   - Google Maps "Want to go" scrapes often lack coordinates
 *   - Works best with Google Takeout exports which include coordinates
 * 
 * Prerequisites:
 *   1. Get a Google Places API key from https://console.cloud.google.com
 *   2. Enable "Places API" in your Google Cloud project
 *   3. Set GOOGLE_PLACES_API_KEY environment variable
 * 
 * Usage:
 *   GOOGLE_PLACES_API_KEY=your-key npx tsx scripts/enrich-google-places.ts input.geojson output.ndjson
 * 
 * This script:
 *   1. Reads your Google Takeout GeoJSON file
 *   2. For each place WITH valid coordinates, fetches additional details from Google Places API
 *   3. Outputs enriched Sanity NDJSON with categories, opening hours, contact info, etc.
 *   4. Places without coordinates are converted with basic data only (no API enrichment)
 */

import * as fs from 'fs';
import * as path from 'path';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const RATE_LIMIT_MS = 100; // 100ms between API calls to avoid rate limiting

// GeoJSON types (supports both Google Takeout and our combined format)
interface GoogleFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    // Google Takeout format
    Title?: string;
    'Google Maps URL'?: string;
    Location?: {
      Address?: string;
      'Country Code'?: string;
      'Geo Coordinates'?: {
        Latitude?: number;
        Longitude?: number;
      };
    };
    Published?: string;
    // Combined/enriched format
    name?: string;
    address?: string;
    countryCode?: string;
    googleMapsUrl?: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
    source?: string;
  };
}

interface GoogleGeoJSON {
  type: 'FeatureCollection';
  features: GoogleFeature[];
}

// Google Places API types
interface PlaceDetails {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string; // Google Maps URL
  price_level?: number; // 0-4
  rating?: number;
  user_ratings_total?: number;
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

// Category mapping from Google Places types to our schema
const TYPE_TO_CATEGORY: Record<string, { value: string; label: string }> = {
  brewery: { value: 'brewery', label: 'Brewery' },
  bar: { value: 'pub', label: 'Pub' },
  night_club: { value: 'pub', label: 'Pub' },
  cafe: { value: 'cafe', label: 'Cafe' },
  coffee_shop: { value: 'cafe', label: 'Cafe' },
  bakery: { value: 'bakery', label: 'Bakery' },
  restaurant: { value: 'restaurant', label: 'Restaurant' },
  meal_takeaway: { value: 'bistro', label: 'Bistro' },
};

// Price level mapping
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

async function findPlaceFromCoordinates(
  lat: number, 
  lng: number, 
  name: string
): Promise<string | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;
  
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', '50'); // 50 meters
  url.searchParams.set('keyword', name);
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.results?.[0]?.place_id) {
      return data.results[0].place_id;
    }
  } catch (error) {
    console.warn(`Failed to find place: ${name}`, error);
  }
  
  return null;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;
  
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
    'user_ratings_total',
    'types',
    'opening_hours',
    'address_components',
    'geometry',
  ].join(','));
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.result) {
      return data.result;
    }
  } catch (error) {
    console.warn(`Failed to get place details: ${placeId}`, error);
  }
  
  return null;
}

function extractCIDFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const cidMatch = url.match(/cid=(\d+)/);
  return cidMatch?.[1];
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
  
  return {
    regular,
    timezone: 'Europe/Prague', // Default, adjust as needed
  };
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

async function convertFeatureToPlace(
  feature: GoogleFeature, 
  domain: string,
  enrichWithAPI: boolean
): Promise<any | null> {
  const { properties, geometry } = feature;
  
  // Support both formats: Title (Google Takeout) and name (our combined format)
  const name = properties.Title || properties.name;
  if (!name) {
    console.warn('Skipping feature without title/name');
    return null;
  }
  
  const [lng, lat] = geometry.coordinates;
  const geoCoords = properties.Location?.['Geo Coordinates'];
  const latitude = geoCoords?.Latitude ?? lat;
  const longitude = geoCoords?.Longitude ?? lng;
  
  const slug = slugify(name);
  // Support both URL formats
  const googleMapsUrl = properties['Google Maps URL'] || properties.googleMapsUrl;
  let googlePlaceId = extractCIDFromUrl(googleMapsUrl);
  
  // Support both address formats
  const formattedAddress = properties.Location?.Address || properties.address;
  const countryCode = properties.Location?.['Country Code'] || properties.countryCode;
  
  // Base place object
  const place: any = {
    _id: `place-${slug}`,
    _type: 'place',
    name,
    slug: { _type: 'slug', current: slug },
    domains: [domain],
    categories: [],
    location: {
      _type: 'geolocation',
      geopoint: {
        _type: 'geopoint',
        lat: latitude,
        lng: longitude,
      },
      address: {
        formattedAddress,
        countryCode,
      },
    },
    socialLinks: {},
    externalIds: {},
  };
  
  // Enrich with Google Places API if enabled
  if (enrichWithAPI && GOOGLE_PLACES_API_KEY) {
    console.log(`  Enriching: ${name}`);
    
    // Skip enrichment if we don't have valid coordinates
    if (latitude === 0 && longitude === 0) {
      console.log(`    Skipping API enrichment - no valid coordinates`);
    } else {
      // Always use nearby search to find the real place_id (CID from URL is not a valid place_id)
      const realPlaceId = await findPlaceFromCoordinates(latitude, longitude, name);
      await sleep(RATE_LIMIT_MS);
    
      if (realPlaceId) {
        const details = await getPlaceDetails(realPlaceId);
        await sleep(RATE_LIMIT_MS);
      
      if (details) {
        // Categories from types
        const categories = mapCategories(details.types);
        if (categories.length > 0) {
          place.categories = categories;
        }
        
        // Price level
        if (details.price_level !== undefined) {
          place.price = PRICE_LEVEL_MAP[details.price_level];
        }
        
        // Contact info
        if (details.formatted_phone_number || details.website) {
          place.contact = {
            ...(details.international_phone_number && { phone: details.international_phone_number }),
          };
        }
        
        // Social links
        if (details.website) {
          place.socialLinks.website = details.website;
        }
        if (details.url) {
          place.socialLinks.googleMaps = details.url;
        }
        
        // Opening hours
        const openingHours = convertOpeningHours(details.opening_hours);
        if (openingHours) {
          place.openingHours = openingHours;
        }
        
        // Address components
        const addressParts = parseAddressComponents(details.address_components);
        place.location.address = {
          ...place.location.address,
          ...addressParts,
          formattedAddress: details.formatted_address || place.location.address.formattedAddress,
        };
        
        // Store the place_id
        place.externalIds.googlePlaceId = details.place_id;
      }
    }
    }
  } else {
    // Basic data without API
    if (googleMapsUrl) {
      place.socialLinks.googleMaps = googleMapsUrl;
    }
    if (googlePlaceId) {
      place.externalIds.googlePlaceId = googlePlaceId;
    }
  }
  
  // Clean up empty objects
  if (Object.keys(place.socialLinks).length === 0) delete place.socialLinks;
  if (Object.keys(place.externalIds).length === 0) delete place.externalIds;
  if (place.categories.length === 0) delete place.categories;
  
  return place;
}

async function convertGeoJSONToNDJSON(
  inputPath: string, 
  outputPath: string, 
  domain: string,
  enrichWithAPI: boolean
): Promise<void> {
  console.log(`Reading GeoJSON from: ${inputPath}`);
  
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const geoJSON: GoogleGeoJSON = JSON.parse(rawData);
  
  if (geoJSON.type !== 'FeatureCollection' || !Array.isArray(geoJSON.features)) {
    throw new Error('Invalid GeoJSON: expected FeatureCollection with features array');
  }
  
  console.log(`Found ${geoJSON.features.length} features`);
  
  if (enrichWithAPI && !GOOGLE_PLACES_API_KEY) {
    console.warn('\n⚠️  GOOGLE_PLACES_API_KEY not set. Running without API enrichment.');
    console.warn('   Set the environment variable to fetch additional place details.\n');
    enrichWithAPI = false;
  }
  
  const places: any[] = [];
  const seenSlugs = new Set<string>();
  
  for (let i = 0; i < geoJSON.features.length; i++) {
    const feature = geoJSON.features[i];
    const featureName = feature.properties.Title || feature.properties.name || 'Unknown';
    console.log(`[${i + 1}/${geoJSON.features.length}] Processing: ${featureName}`);
    
    const place = await convertFeatureToPlace(feature, domain, enrichWithAPI);
    
    if (place) {
      // Handle duplicate slugs
      let finalSlug = place.slug.current;
      let counter = 1;
      while (seenSlugs.has(finalSlug)) {
        finalSlug = `${place.slug.current}-${counter++}`;
      }
      seenSlugs.add(finalSlug);
      
      place._id = `place-${finalSlug}`;
      place.slug.current = finalSlug;
      
      places.push(place);
    }
  }
  
  console.log(`\nConverted ${places.length} places`);
  
  // Write NDJSON
  const ndjson = places.map(p => JSON.stringify(p)).join('\n');
  fs.writeFileSync(outputPath, ndjson);
  
  console.log(`Wrote NDJSON to: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Review and edit the NDJSON file');
  console.log('2. Import to Sanity:');
  console.log(`   cd apps/cms-studio && sanity dataset import ${path.resolve(outputPath)} production --replace`);
}

// CLI
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Google Maps Saved Places → Sanity NDJSON Converter (with API Enrichment)

Usage:
  GOOGLE_PLACES_API_KEY=your-key npx tsx scripts/enrich-google-places.ts <input.geojson> <output.ndjson> [domain] [--no-enrich]

Arguments:
  input.geojson   Path to Google Takeout GeoJSON file
  output.ndjson   Output path for Sanity NDJSON file  
  domain          Domain: beer, coffee, vino, guide (default: coffee)
  --no-enrich     Skip Google Places API enrichment

Environment Variables:
  GOOGLE_PLACES_API_KEY   Your Google Places API key (required for enrichment)

Example:
  # With API enrichment (recommended)
  GOOGLE_PLACES_API_KEY=AIza... npx tsx scripts/enrich-google-places.ts saved-places.json places.ndjson beer

  # Without API enrichment  
  npx tsx scripts/enrich-google-places.ts saved-places.json places.ndjson coffee --no-enrich
`);
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1];
const domain = args.find(a => ['beer', 'coffee', 'vino', 'guide'].includes(a)) || 'coffee';
const enrichWithAPI = !args.includes('--no-enrich');

if (!['beer', 'coffee', 'vino', 'guide'].includes(domain)) {
  console.error(`Invalid domain: ${domain}. Must be one of: beer, coffee, vino, guide`);
  process.exit(1);
}

convertGeoJSONToNDJSON(inputPath, outputPath, domain, enrichWithAPI)
  .catch(error => {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
