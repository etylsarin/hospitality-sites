import { enrichPlaces } from '../src/processors/google-places-enricher';
import type { SanityPlace } from '../src/processors/sanity-place-normalizer';

// Mock fetch globally
const originalFetch = global.fetch;

interface MockResponses {
  nearby?: unknown;
  details?: unknown;
}

function mockFetch(responses: MockResponses) {
  global.fetch = jest.fn((url: string | Request | URL) => {
    const urlString = url.toString();
    
    if (urlString.includes('nearbysearch') && responses.nearby) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responses.nearby),
      } as Response);
    }
    
    if (urlString.includes('details') && responses.details) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responses.details),
      } as Response);
    }
    
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ status: 'NOT_FOUND' }),
    } as Response);
  });
}

afterEach(() => {
  global.fetch = originalFetch;
});

const mockNearbyResponse = {
  status: 'OK',
  results: [
    {
      place_id: 'test-place-id',
      name: 'Test Place',
      geometry: { location: { lat: 50.0755, lng: 14.4378 } },
      rating: 4.5,
      user_ratings_total: 100,
      types: ['cafe', 'restaurant'],
    },
  ],
};

const mockDetailsResponse = {
  status: 'OK',
  result: {
    place_id: 'test-place-id',
    name: 'Test Coffee Shop',
    formatted_address: '123 Test Street, Prague, Czech Republic',
    formatted_phone_number: '+420 123 456 789',
    international_phone_number: '+420 123 456 789',
    website: 'https://testcoffee.example.com',
    url: 'https://maps.google.com/maps?cid=12345',
    price_level: 2,
    rating: 4.5,
    user_ratings_total: 100,
    types: ['cafe', 'restaurant', 'food'],
    opening_hours: {
      weekday_text: [
        'Monday: 8:00 AM – 6:00 PM',
        'Tuesday: 8:00 AM – 6:00 PM',
        'Wednesday: 8:00 AM – 6:00 PM',
        'Thursday: 8:00 AM – 6:00 PM',
        'Friday: 8:00 AM – 8:00 PM',
        'Saturday: 9:00 AM – 4:00 PM',
        'Sunday: Closed',
      ],
    },
    geometry: { location: { lat: 50.0755, lng: 14.4378 } },
    photos: [
      { photo_reference: 'photo123', height: 800, width: 600 },
    ],
  },
};

describe('enricher', () => {
  describe('enrichPlaces', () => {
    const basePlaceWithCoords: SanityPlace = {
      _type: 'place',
      name: 'Test Place',
      slug: { _type: 'slug', current: 'test-place' },
      domains: ['coffee'],
      location: {
        _type: 'geolocation',
        address: 'Original Address',
        geopoint: {
          _type: 'geopoint',
          lat: 50.0755,
          lng: 14.4378,
        },
      },
    };

    const basePlaceWithoutCoords: SanityPlace = {
      _type: 'place',
      name: 'Test Place No Coords',
      slug: { _type: 'slug', current: 'test-place-no-coords' },
      domains: ['coffee'],
    };

    it('should enrich places with Google Places data', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(1);
      expect(result.skipped).toBe(0);
      expect(result.places).toHaveLength(1);
      
      const enrichedPlace = result.places[0];
      expect(enrichedPlace?.phone).toBe('+420 123 456 789');
      expect(enrichedPlace?.website).toBe('https://testcoffee.example.com');
      expect(enrichedPlace?.location?.address).toBe('123 Test Street, Prague, Czech Republic');
      expect(enrichedPlace?.price).toBe('average');
      expect(enrichedPlace?.openingHours).toHaveLength(7);
      expect(enrichedPlace?.scrapedData?.source).toBe('google-places-api');
      expect(enrichedPlace?.scrapedData?.sourceId).toBe('test-place-id');
    });

    it('should skip places without coordinates', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const result = await enrichPlaces([basePlaceWithoutCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(0);
      expect(result.skipped).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.error).toContain('coordinates');
    });

    it('should handle places not found in Google', async () => {
      mockFetch({
        nearby: { status: 'ZERO_RESULTS', results: [] },
      });

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(0);
      expect(result.skipped).toBe(1);
      expect(result.errors[0]?.error).toContain('not found');
    });

    it('should handle failed detail fetches', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: { status: 'NOT_FOUND' },
      });

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(0);
      expect(result.skipped).toBe(1);
      expect(result.errors[0]?.error).toContain('details');
    });

    it('should process multiple places', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const places = [
        basePlaceWithCoords,
        { ...basePlaceWithCoords, name: 'Another Place' },
        basePlaceWithoutCoords,
      ];

      const result = await enrichPlaces(places, {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(2);
      expect(result.skipped).toBe(1);
      expect(result.places).toHaveLength(3);
    });

    it('should call progress callback', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const onProgress = jest.fn();
      const places = [basePlaceWithCoords, { ...basePlaceWithCoords, name: 'Second Place' }];

      await enrichPlaces(places, {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
        onProgress,
      });

      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenNthCalledWith(1, 1, 2, 'Test Place');
      expect(onProgress).toHaveBeenNthCalledWith(2, 2, 2, 'Second Place');
    });

    it('should map Google price levels correctly', async () => {
      const testCases = [
        { price_level: 0, expected: 'low' },
        { price_level: 1, expected: 'low' },
        { price_level: 2, expected: 'average' },
        { price_level: 3, expected: 'high' },
        { price_level: 4, expected: 'very-high' },
      ];

      for (const { price_level, expected } of testCases) {
        mockFetch({
          nearby: mockNearbyResponse,
          details: { ...mockDetailsResponse, result: { ...mockDetailsResponse.result, price_level } },
        });

        const result = await enrichPlaces([basePlaceWithCoords], {
          apiKey: 'test-api-key',
          rateLimitMs: 0,
        });

        expect(result.places[0]?.price).toBe(expected);
      }
    });

    it('should map Google types to categories', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      const categories = result.places[0]?.categories;
      expect(categories).toBeDefined();
      expect(categories?.some(c => c.value === 'cafe')).toBe(true);
      expect(categories?.some(c => c.value === 'restaurant')).toBe(true);
    });

    it('should parse opening hours correctly', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      const hours = result.places[0]?.openingHours;
      expect(hours).toHaveLength(7);
      
      const monday = hours?.find(h => h.day === 'Monday');
      expect(monday?.openTime).toBe('8:00 AM');
      expect(monday?.closeTime).toBe('6:00 PM');
      
      const sunday = hours?.find(h => h.day === 'Sunday');
      expect(sunday?.closed).toBe(true);
    });

    it('should add Google Maps URL to external links', async () => {
      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      const links = result.places[0]?.externalLinks;
      expect(links).toBeDefined();
      expect(links?.some(l => l.name === 'Google Maps')).toBe(true);
      expect(links?.find(l => l.name === 'Google Maps')?.url).toContain('maps.google.com');
    });

    it('should handle API errors gracefully', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const result = await enrichPlaces([basePlaceWithCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(0);
      expect(result.skipped).toBe(1);
      expect(result.errors[0]?.error).toContain('Network error');
    });

    it('should handle zero coordinates', async () => {
      const placeWithZeroCoords: SanityPlace = {
        ...basePlaceWithCoords,
        location: {
          _type: 'geolocation',
          geopoint: {
            _type: 'geopoint',
            lat: 0,
            lng: 0,
          },
        },
      };

      mockFetch({
        nearby: mockNearbyResponse,
        details: mockDetailsResponse,
      });

      const result = await enrichPlaces([placeWithZeroCoords], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.enriched).toBe(0);
      expect(result.skipped).toBe(1);
    });

    it('should preserve existing place data when enrichment fails', async () => {
      mockFetch({
        nearby: { status: 'ZERO_RESULTS', results: [] },
      });

      const placeWithData: SanityPlace = {
        ...basePlaceWithCoords,
        phone: 'original-phone',
        website: 'https://original.example.com',
      };

      const result = await enrichPlaces([placeWithData], {
        apiKey: 'test-api-key',
        rateLimitMs: 0,
      });

      expect(result.places[0]?.phone).toBe('original-phone');
      expect(result.places[0]?.website).toBe('https://original.example.com');
    });
  });
});
