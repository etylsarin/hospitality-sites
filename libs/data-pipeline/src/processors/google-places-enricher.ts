import type { SanityPlace } from './sanity-place-normalizer';

/**
 * Google Places API response types
 */
interface PlaceDetailsResponse {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  url?: string;
  price_level?: number;
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
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

interface NearbySearchResult {
  place_id: string;
  name: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
}

/**
 * Enrichment options
 */
export interface EnrichOptions {
  /** Google Places API key */
  apiKey: string;
  /** Rate limit delay in ms (default: 100) */
  rateLimitMs?: number;
  /** Skip places without coordinates */
  requireCoordinates?: boolean;
  /** Progress callback */
  onProgress?: (_current: number, _total: number, _placeName: string) => void;
}

/**
 * Enrichment result
 */
export interface EnrichResult {
  places: SanityPlace[];
  enriched: number;
  skipped: number;
  errors: Array<{ place: string; error: string }>;
}

/**
 * Category mapping from Google Places types
 */
const GOOGLE_TYPE_MAPPING: Record<string, { value: string; label: string }> = {
  bar: { value: 'pub', label: 'Pub' },
  night_club: { value: 'pub', label: 'Pub' },
  brewery: { value: 'brewery', label: 'Brewery' },
  cafe: { value: 'cafe', label: 'Cafe' },
  coffee_shop: { value: 'cafe', label: 'Cafe' },
  bakery: { value: 'bakery', label: 'Bakery' },
  restaurant: { value: 'restaurant', label: 'Restaurant' },
  meal_takeaway: { value: 'bistro', label: 'Bistro' },
  food: { value: 'restaurant', label: 'Restaurant' },
};

/**
 * Price level mapping
 */
const PRICE_MAPPING: Record<number, string> = {
  0: 'low',
  1: 'low',
  2: 'average',
  3: 'high',
  4: 'very-high',
};

/**
 * Validate a place has required data for enrichment
 * Checks for valid name and non-zero coordinates
 */
function isValidForEnrichment(place: SanityPlace): { valid: boolean; reason?: string } {
  if (!place.name || place.name.trim() === '') {
    return { valid: false, reason: 'Missing name' };
  }
  
  const lat = place.location?.geopoint?.lat;
  const lng = place.location?.geopoint?.lng;
  
  if (lat === undefined || lng === undefined) {
    return { valid: false, reason: 'Missing coordinates' };
  }
  
  if (lat === 0 && lng === 0) {
    return { valid: false, reason: 'Invalid coordinates (0,0)' };
  }
  
  // Additional sanity checks for valid coordinate ranges
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { valid: false, reason: `Invalid coordinate range (${lat}, ${lng})` };
  }
  
  return { valid: true };
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Find place using Google Places Nearby Search
 */
async function findNearbyPlace(
  lat: number,
  lng: number,
  name: string,
  apiKey: string
): Promise<NearbySearchResult | null> {
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: '100', // 100 meters
    keyword: name,
    key: apiKey,
  });
  
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status === 'OK' && data.results?.length > 0) {
    return data.results[0];
  }
  
  return null;
}

/**
 * Get place details from Google Places API
 */
async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<PlaceDetailsResponse | null> {
  const fields = [
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
    'photos',
  ].join(',');
  
  const params = new URLSearchParams({
    place_id: placeId,
    fields,
    key: apiKey,
  });
  
  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status === 'OK' && data.result) {
    return data.result;
  }
  
  return null;
}

/**
 * Map Google types to our categories
 */
function mapCategories(types?: string[]): Array<{ value: string; label: string }> {
  if (!types) return [];
  
  const categories: Array<{ value: string; label: string }> = [];
  const seen = new Set<string>();
  
  for (const type of types) {
    const mapped = GOOGLE_TYPE_MAPPING[type];
    if (mapped && !seen.has(mapped.value)) {
      categories.push(mapped);
      seen.add(mapped.value);
    }
  }
  
  return categories;
}

/**
 * Parse opening hours from Google format
 */
function parseOpeningHours(openingHours?: PlaceDetailsResponse['opening_hours']): SanityPlace['openingHours'] {
  if (!openingHours?.weekday_text) return undefined;
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return openingHours.weekday_text.map((text, index) => {
    const day = days[index] || `Day ${index}`;
    
    // Parse "Monday: 9:00 AM – 5:00 PM" or "Monday: Closed"
    if (text.toLowerCase().includes('closed')) {
      return {
        _key: `hours-${index}`,
        day,
        closed: true,
      };
    }
    
    const timeMatch = text.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*[–-]\s*(\d{1,2}:\d{2}\s*[AP]M)/i);
    if (timeMatch) {
      return {
        _key: `hours-${index}`,
        day,
        openTime: timeMatch[1],
        closeTime: timeMatch[2],
      };
    }
    
    return {
      _key: `hours-${index}`,
      day,
    };
  });
}

/**
 * Enrich a single place with Google Places data
 */
async function enrichPlace(
  place: SanityPlace,
  apiKey: string
): Promise<{ enriched: boolean; place: SanityPlace; error?: string }> {
  // Need coordinates for nearby search
  const lat = place.location?.geopoint?.lat;
  const lng = place.location?.geopoint?.lng;
  
  if (!lat || !lng || (lat === 0 && lng === 0)) {
    return { enriched: false, place, error: 'Missing valid coordinates' };
  }
  
  try {
    // Find the place using nearby search
    const nearbyResult = await findNearbyPlace(lat, lng, place.name, apiKey);
    
    if (!nearbyResult) {
      return { enriched: false, place, error: 'Place not found in Google Places' };
    }
    
    // Get detailed information
    const details = await getPlaceDetails(nearbyResult.place_id, apiKey);
    
    if (!details) {
      return { enriched: false, place, error: 'Could not fetch place details' };
    }
    
    // Enrich the place
    const enrichedPlace: SanityPlace = {
      ...place,
      // Update location with Google's address if available
      location: {
        ...place.location,
        _type: 'geolocation',
        address: details.formatted_address || place.location?.address,
        geopoint: place.location?.geopoint,
      },
      // Add categories from Google types
      categories: mapCategories(details.types) || place.categories,
      // Add contact info
      phone: details.formatted_phone_number || details.international_phone_number || place.phone,
      website: details.website || place.website,
      // Add price level
      price: details.price_level !== undefined 
        ? PRICE_MAPPING[details.price_level] 
        : place.price,
      // Add opening hours
      openingHours: parseOpeningHours(details.opening_hours) || place.openingHours,
      // Store scraped data metadata
      scrapedData: {
        source: 'google-places-api',
        sourceId: details.place_id,
        sourceUrl: details.url,
        rating: details.rating,
        reviewCount: details.user_ratings_total,
        scrapedAt: new Date().toISOString(),
      },
    };
    
    // Add Google Maps URL to external links
    if (details.url) {
      enrichedPlace.externalLinks = [
        ...(enrichedPlace.externalLinks || []),
        { name: 'Google Maps', url: details.url },
      ];
    }
    
    return { enriched: true, place: enrichedPlace };
  } catch (error) {
    return { 
      enriched: false, 
      place, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Enrich multiple places with Google Places API data
 * Pre-validates all places before making any API calls to avoid wasting quota
 */
export async function enrichPlaces(
  places: SanityPlace[],
  options: EnrichOptions
): Promise<EnrichResult> {
  const { apiKey, rateLimitMs = 100, onProgress } = options;
  
  const result: EnrichResult = {
    places: [],
    enriched: 0,
    skipped: 0,
    errors: [],
  };
  
  // Pre-validate all places before making any API calls
  const validPlaces: Array<{ index: number; place: SanityPlace }> = [];
  const invalidPlaces: Array<{ place: SanityPlace; reason: string }> = [];
  
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    if (!place) continue;
    
    const validation = isValidForEnrichment(place);
    if (validation.valid) {
      validPlaces.push({ index: i, place });
    } else {
      invalidPlaces.push({ place, reason: validation.reason || 'Unknown' });
    }
  }
  
  // Report pre-validation results
  if (invalidPlaces.length > 0) {
    console.log(`\n⚠️  Skipping ${invalidPlaces.length} places with incomplete data:`);
    for (const { place, reason } of invalidPlaces.slice(0, 10)) {
      console.log(`   - "${place.name || 'Unnamed'}": ${reason}`);
      result.errors.push({ place: place.name || 'Unnamed', error: reason });
      result.places.push(place); // Keep original in output
      result.skipped++;
    }
    if (invalidPlaces.length > 10) {
      console.log(`   ... and ${invalidPlaces.length - 10} more`);
    }
    console.log('');
  }
  
  if (validPlaces.length === 0) {
    console.log('❌ No valid places to enrich');
    return result;
  }
  
  console.log(`✅ ${validPlaces.length} places ready for enrichment\n`);
  
  // Process only valid places
  for (let i = 0; i < validPlaces.length; i++) {
    const { place } = validPlaces[i]!;
    
    onProgress?.(i + 1, validPlaces.length, place.name);
    
    const { enriched, place: processedPlace, error } = await enrichPlace(place, apiKey);
    
    result.places.push(processedPlace);
    
    if (enriched) {
      result.enriched++;
    } else {
      result.skipped++;
      if (error) {
        result.errors.push({ place: place.name, error });
      }
    }
    
    // Rate limiting
    if (i < validPlaces.length - 1) {
      await sleep(rateLimitMs);
    }
  }
  
  return result;
}
