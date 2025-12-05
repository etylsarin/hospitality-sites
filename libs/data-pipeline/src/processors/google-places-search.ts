/**
 * Google Places API Search
 *
 * Search for places using Google Places API and convert to Sanity format.
 * Supports text search (query) and nearby search (location + radius).
 */

import type { SanityPlace } from './sanity-place-normalizer';

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

export interface SearchOptions {
  apiKey: string;
  query?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  type?: string;
  domain: string;
  maxResults?: number;
  rateLimitMs?: number;
  onProgress?: (_current: number, _total: number, _name: string) => void;
}

export interface SearchResult {
  places: SanityPlace[];
  total: number;
  errors: Array<{ placeId: string; error: string }>;
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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function textSearch(
  apiKey: string,
  query: string,
  pageToken?: string
): Promise<{ results: PlaceResult[]; nextPageToken?: string }> {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/textsearch/json'
  );
  url.searchParams.set('query', query);
  url.searchParams.set('key', apiKey);
  if (pageToken) {
    url.searchParams.set('pagetoken', pageToken);
  }

  const response = await fetch(url.toString());
  const data = (await response.json()) as {
    status: string;
    results?: PlaceResult[];
    next_page_token?: string;
    error_message?: string;
  };

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`API error: ${data.status} - ${data.error_message || ''}`);
  }

  return {
    results: data.results || [],
    nextPageToken: data.next_page_token,
  };
}

async function nearbySearch(
  apiKey: string,
  lat: number,
  lng: number,
  radius: number,
  type?: string,
  pageToken?: string
): Promise<{ results: PlaceResult[]; nextPageToken?: string }> {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
  );
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radius.toString());
  url.searchParams.set('key', apiKey);
  if (type) {
    url.searchParams.set('type', type);
  }
  if (pageToken) {
    url.searchParams.set('pagetoken', pageToken);
  }

  const response = await fetch(url.toString());
  const data = (await response.json()) as {
    status: string;
    results?: PlaceResult[];
    next_page_token?: string;
    error_message?: string;
  };

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`API error: ${data.status} - ${data.error_message || ''}`);
  }

  return {
    results: data.results || [],
    nextPageToken: data.next_page_token,
  };
}

async function getPlaceDetails(
  apiKey: string,
  placeId: string
): Promise<PlaceDetails | null> {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/details/json'
  );
  url.searchParams.set('place_id', placeId);
  url.searchParams.set(
    'fields',
    [
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
    ].join(',')
  );
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());
  const data = (await response.json()) as {
    status: string;
    result?: PlaceDetails;
    error_message?: string;
  };

  if (data.status !== 'OK') {
    return null;
  }

  return data.result || null;
}

function convertOpeningHours(hours?: PlaceDetails['opening_hours']) {
  if (!hours?.periods) return undefined;

  const regular = hours.periods.map((period) => {
    const day = DAY_MAP[period.open.day] || 'monday';
    const is24Hours = period.open.time === '0000' && !period.close;

    return {
      day,
      isClosed: false,
      is24Hours,
      slots: is24Hours
        ? []
        : [
            {
              open: `${period.open.time.slice(0, 2)}:${period.open.time.slice(2)}`,
              close: period.close
                ? `${period.close.time.slice(0, 2)}:${period.close.time.slice(2)}`
                : '23:59',
            },
          ],
    };
  });

  return { regular, timezone: 'Europe/Prague' };
}

function mapCategories(
  types?: string[]
): Array<{ value: string; label: string }> {
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

function convertToSanityPlace(
  details: PlaceDetails,
  domain: string,
  seenSlugs: Set<string>
): SanityPlace {
  let slug = slugify(details.name);
  let counter = 1;
  while (seenSlugs.has(slug)) {
    slug = `${slugify(details.name)}-${counter++}`;
  }
  seenSlugs.add(slug);

  const categories = mapCategories(details.types);
  const openingHoursData = convertOpeningHours(details.opening_hours);

  const place: SanityPlace = {
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
      address: details.formatted_address,
    },
  };

  if (categories.length > 0) {
    place.categories = categories;
  }

  if (details.price_level !== undefined) {
    place.price = PRICE_LEVEL_MAP[details.price_level];
  }

  if (details.international_phone_number) {
    place.phone = details.international_phone_number;
  }

  if (details.website) {
    place.website = details.website;
  }

  // Add external links for Google Maps URL and Google Place ID
  const externalLinks: Array<{ name: string; url: string }> = [];
  if (details.url) {
    externalLinks.push({ name: 'Google Maps', url: details.url });
  }
  if (externalLinks.length > 0) {
    place.externalLinks = externalLinks;
  }

  // Store scraped data metadata
  place.scrapedData = {
    source: 'google-places-api',
    sourceId: details.place_id,
    sourceUrl: details.url,
    rating: details.rating,
    scrapedAt: new Date().toISOString(),
  };

  if (openingHoursData) {
    place.openingHours = openingHoursData.regular.map((day, index) => ({
      _key: `day-${index}`,
      day: day.day,
      openTime: day.slots[0]?.open,
      closeTime: day.slots[0]?.close,
      closed: day.isClosed,
    }));
  }

  return place;
}

/**
 * Search Google Places API and convert results to Sanity format
 */
export async function searchPlaces(
  options: SearchOptions
): Promise<SearchResult> {
  const {
    apiKey,
    query,
    location,
    radius = 5000,
    type,
    domain,
    maxResults = 60,
    rateLimitMs = RATE_LIMIT_MS,
    onProgress,
  } = options;

  if (!query && !location) {
    throw new Error('Either query or location is required');
  }

  const allResults: PlaceResult[] = [];
  let pageToken: string | undefined;
  let pageNum = 1;

  // Search with pagination (max 3 pages = 60 results)
  do {
    let searchResult;
    if (query) {
      searchResult = await textSearch(apiKey, query, pageToken);
    } else if (location) {
      searchResult = await nearbySearch(
        apiKey,
        location.lat,
        location.lng,
        radius,
        type,
        pageToken
      );
    } else {
      break;
    }

    allResults.push(...searchResult.results);
    pageToken = searchResult.nextPageToken;
    pageNum++;

    if (allResults.length >= maxResults) break;
    if (pageToken) {
      // Google requires a delay before using next_page_token
      await sleep(2000);
    }
  } while (pageToken && pageNum <= 3);

  // Fetch details for each place
  const places: SanityPlace[] = [];
  const errors: Array<{ placeId: string; error: string }> = [];
  const seenSlugs = new Set<string>();
  const seenPlaceIds = new Set<string>();

  const total = Math.min(allResults.length, maxResults);

  for (let i = 0; i < total; i++) {
    const result = allResults[i];
    if (!result) continue;

    // Skip duplicates
    if (seenPlaceIds.has(result.place_id)) continue;
    seenPlaceIds.add(result.place_id);

    onProgress?.(i + 1, total, result.name);

    try {
      const details = await getPlaceDetails(apiKey, result.place_id);
      await sleep(rateLimitMs);

      if (details) {
        const place = convertToSanityPlace(details, domain, seenSlugs);
        places.push(place);
      } else {
        errors.push({
          placeId: result.place_id,
          error: 'Could not fetch details',
        });
      }
    } catch (err) {
      errors.push({
        placeId: result.place_id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    places,
    total: allResults.length,
    errors,
  };
}
