import type { SanityPlace } from '../src/processors/sanity-place-normalizer';
import type { ScrapedPlace } from '../src/types/scraped-place.types';

/**
 * Valid SanityPlace fixture
 */
export const validSanityPlace: SanityPlace = {
  _type: 'place',
  name: 'Test Coffee Shop',
  slug: {
    _type: 'slug',
    current: 'test-coffee-shop',
  },
  domains: ['coffee'],
  categories: [{ value: 'cafe', label: 'Cafe' }],
  location: {
    _type: 'geolocation',
    geopoint: {
      _type: 'geopoint',
      lat: 50.0755,
      lng: 14.4378,
    },
    address: '123 Main Street, Prague, Czech Republic',
  },
  price: 'average',
  phone: '+420 123 456 789',
  website: 'https://example.com',
};

/**
 * Minimal valid SanityPlace (only required fields)
 */
export const minimalSanityPlace: SanityPlace = {
  _type: 'place',
  name: 'Minimal Place',
  slug: {
    _type: 'slug',
    current: 'minimal-place',
  },
  domains: ['guide'],
};

/**
 * SanityPlace without coordinates
 */
export const placeWithoutCoords: SanityPlace = {
  _type: 'place',
  name: 'No Coords Place',
  slug: {
    _type: 'slug',
    current: 'no-coords-place',
  },
  domains: ['beer'],
  location: {
    _type: 'geolocation',
    address: 'Some Address',
  },
};

/**
 * SanityPlace with null island coordinates
 */
export const placeWithNullIsland: SanityPlace = {
  _type: 'place',
  name: 'Null Island Place',
  slug: {
    _type: 'slug',
    current: 'null-island-place',
  },
  domains: ['coffee'],
  location: {
    _type: 'geolocation',
    geopoint: {
      _type: 'geopoint',
      lat: 0,
      lng: 0,
    },
  },
};

/**
 * Invalid SanityPlace (missing name)
 */
export const invalidPlaceMissingName = {
  _type: 'place',
  slug: {
    _type: 'slug',
    current: 'missing-name',
  },
  domains: ['coffee'],
} as SanityPlace;

/**
 * Invalid SanityPlace (bad slug)
 */
export const invalidPlaceBadSlug: SanityPlace = {
  _type: 'place',
  name: 'Bad Slug Place',
  slug: {
    _type: 'slug',
    current: 'BAD SLUG WITH SPACES!',
  },
  domains: ['coffee'],
};

/**
 * Invalid SanityPlace (bad domain)
 */
export const invalidPlaceBadDomain: SanityPlace = {
  _type: 'place',
  name: 'Bad Domain Place',
  slug: {
    _type: 'slug',
    current: 'bad-domain-place',
  },
  domains: ['invalid-domain'],
};

/**
 * ScrapedPlace fixture
 */
export const scrapedPlace: ScrapedPlace = {
  name: 'Scraped Coffee Shop',
  address: '456 Oak Avenue, Prague',
  city: 'Prague',
  country: 'Czech Republic',
  countryCode: 'CZ',
  latitude: 50.0875,
  longitude: 14.4213,
  rating: 4.5,
  reviewCount: 150,
  priceLevel: 2,
  categories: ['cafe', 'coffee_shop'],
  phone: '+420 987 654 321',
  website: 'https://scraped-coffee.example.com',
  openingHours: [
    { day: 'monday', open: '08:00', close: '18:00' },
    { day: 'tuesday', open: '08:00', close: '18:00' },
    { day: 'wednesday', open: '08:00', close: '18:00' },
    { day: 'thursday', open: '08:00', close: '18:00' },
    { day: 'friday', open: '08:00', close: '20:00' },
    { day: 'saturday', open: '09:00', close: '16:00' },
    { day: 'sunday', closed: true },
  ],
  photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  source: 'google-maps',
  sourceId: 'ChIJrTLr-GyuEmsRBfy61i59si0',
  sourceUrl: 'https://maps.google.com/?cid=123456',
  scrapedAt: new Date('2024-01-15T10:30:00Z'),
};

/**
 * Minimal ScrapedPlace
 */
export const minimalScrapedPlace: ScrapedPlace = {
  name: 'Minimal Scraped Place',
  source: 'tripadvisor',
  scrapedAt: new Date('2024-01-15T10:30:00Z'),
};

/**
 * Google Takeout GeoJSON fixture
 */
export const googleTakeoutGeoJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [14.4378, 50.0755] as [number, number], // [lng, lat]
      },
      properties: {
        Title: 'Prague Coffee House',
        'Google Maps URL': 'https://maps.google.com/?cid=123',
        Location: {
          Address: 'Staroměstské náměstí 1, Prague, Czech Republic',
          'Country Code': 'CZ',
        },
        Published: '2024-01-01',
      },
    },
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [14.4213, 50.0875] as [number, number],
      },
      properties: {
        Title: 'Prague Brewery',
        'Google Maps URL': 'https://maps.google.com/?cid=456',
        Location: {
          Address: 'Žižkov, Prague, Czech Republic',
        },
      },
    },
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [0, 0] as [number, number], // Invalid coordinates
      },
      properties: {
        Title: 'Missing Coords Place',
      },
    },
  ],
};

/**
 * Places for deduplication testing
 */
export const placesForDedup: SanityPlace[] = [
  {
    _type: 'place',
    name: 'Coffee Shop A',
    slug: { _type: 'slug', current: 'coffee-shop-a' },
    domains: ['coffee'],
    location: {
      _type: 'geolocation',
      geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
    },
  },
  {
    _type: 'place',
    name: 'Coffee Shop A', // Duplicate name
    slug: { _type: 'slug', current: 'coffee-shop-a-2' },
    domains: ['coffee'],
    location: {
      _type: 'geolocation',
      geopoint: { _type: 'geopoint', lat: 50.0756, lng: 14.4379 }, // Very close
    },
  },
  {
    _type: 'place',
    name: 'Different Place',
    slug: { _type: 'slug', current: 'different-place' },
    domains: ['coffee'],
    location: {
      _type: 'geolocation',
      geopoint: { _type: 'geopoint', lat: 51.0000, lng: 15.0000 }, // Far away
    },
  },
];

/**
 * NDJSON content fixture
 */
export const validNDJSON = `{"_type":"place","name":"Place 1","slug":{"_type":"slug","current":"place-1"},"domains":["coffee"]}
{"_type":"place","name":"Place 2","slug":{"_type":"slug","current":"place-2"},"domains":["beer"]}`;

export const invalidNDJSON = `{"_type":"place","name":"Valid Place","slug":{"_type":"slug","current":"valid"},"domains":["coffee"]}
{invalid json here}
{"_type":"place","name":"","slug":{"_type":"slug","current":"empty-name"},"domains":["coffee"]}`;

/**
 * Google Places API mock response
 */
export const mockPlaceDetailsResponse = {
  place_id: 'ChIJrTLr-GyuEmsRBfy61i59si0',
  name: 'Mock Coffee Shop',
  formatted_address: '123 Mock Street, Prague, CZ',
  formatted_phone_number: '+420 123 456 789',
  international_phone_number: '+420 123 456 789',
  website: 'https://mock-coffee.example.com',
  url: 'https://maps.google.com/?cid=12345',
  price_level: 2,
  rating: 4.5,
  types: ['cafe', 'food', 'establishment'],
  geometry: {
    location: { lat: 50.0755, lng: 14.4378 },
  },
  opening_hours: {
    periods: [
      { open: { day: 1, time: '0800' }, close: { day: 1, time: '1800' } },
      { open: { day: 2, time: '0800' }, close: { day: 2, time: '1800' } },
    ],
  },
};

export const mockNearbySearchResponse = {
  status: 'OK',
  results: [
    {
      place_id: 'ChIJrTLr-GyuEmsRBfy61i59si0',
      name: 'Mock Coffee Shop',
      geometry: { location: { lat: 50.0755, lng: 14.4378 } },
      rating: 4.5,
      types: ['cafe'],
    },
  ],
};

export const mockTextSearchResponse = {
  status: 'OK',
  results: [
    {
      place_id: 'ChIJrTLr-GyuEmsRBfy61i59si0',
      name: 'Mock Coffee Shop',
      geometry: { location: { lat: 50.0755, lng: 14.4378 } },
    },
    {
      place_id: 'ChIJrTLr-GyuEmsRBfy61i59si1',
      name: 'Another Coffee Place',
      geometry: { location: { lat: 50.0800, lng: 14.4400 } },
    },
  ],
};
