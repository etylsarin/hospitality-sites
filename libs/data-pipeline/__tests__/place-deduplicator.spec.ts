import { deduplicateWithinList } from '../src/processors/place-deduplicator';
import { placesForDedup, validSanityPlace, minimalSanityPlace } from './fixtures';
import type { SanityPlace } from '../src/processors/sanity-place-normalizer';

describe('deduplicator', () => {
  describe('deduplicateWithinList', () => {
    it('should identify duplicate places by proximity and name', () => {
      const result = deduplicateWithinList(placesForDedup);

      expect(result.unique.length).toBe(2);
      expect(result.duplicates.length).toBe(1);
      expect(result.duplicates[0]?.place.name).toBe('Coffee Shop A');
    });

    it('should keep places that are far apart', () => {
      const result = deduplicateWithinList(placesForDedup);

      const uniqueNames = result.unique.map((p) => p.name);
      expect(uniqueNames).toContain('Different Place');
    });

    it('should handle places without coordinates', () => {
      const placesWithMissing: SanityPlace[] = [
        validSanityPlace,
        minimalSanityPlace, // no coordinates
        {
          _type: 'place',
          name: 'Another No Coords',
          slug: { _type: 'slug', current: 'another-no-coords' },
          domains: ['coffee'],
        },
      ];

      const result = deduplicateWithinList(placesWithMissing);

      // All should be unique since we can't compare places without coords
      expect(result.unique.length).toBe(3);
      expect(result.duplicates.length).toBe(0);
    });

    it('should use custom threshold distance', () => {
      const closePlaces: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Place A',
          slug: { _type: 'slug', current: 'place-a' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
        {
          _type: 'place',
          name: 'Place A', // Same name
          slug: { _type: 'slug', current: 'place-a-2' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0760, lng: 14.4380 }, // ~60m away
          },
        },
      ];

      // With 50m threshold (default), should be unique
      const result50 = deduplicateWithinList(closePlaces, 50);
      expect(result50.duplicates.length).toBe(0);

      // With 100m threshold, should be duplicates
      const result100 = deduplicateWithinList(closePlaces, 100);
      expect(result100.duplicates.length).toBe(1);
    });

    it('should not mark as duplicate if names are different', () => {
      const differentNames: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Coffee Shop',
          slug: { _type: 'slug', current: 'coffee-shop' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
        {
          _type: 'place',
          name: 'Tea House', // Different name, same location
          slug: { _type: 'slug', current: 'tea-house' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
      ];

      const result = deduplicateWithinList(differentNames);

      expect(result.unique.length).toBe(2);
      expect(result.duplicates.length).toBe(0);
    });

    it('should handle similar names with diacritics', () => {
      const similarNames: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Café Praha',
          slug: { _type: 'slug', current: 'cafe-praha' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
        {
          _type: 'place',
          name: 'Cafe Praha', // Same name without accent
          slug: { _type: 'slug', current: 'cafe-praha-2' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0756, lng: 14.4379 },
          },
        },
      ];

      const result = deduplicateWithinList(similarNames);

      expect(result.duplicates.length).toBe(1);
    });

    it('should handle partial name matches', () => {
      const partialMatch: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Starbucks',
          slug: { _type: 'slug', current: 'starbucks' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
        {
          _type: 'place',
          name: 'Starbucks Coffee',
          slug: { _type: 'slug', current: 'starbucks-coffee' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0756, lng: 14.4379 },
          },
        },
      ];

      const result = deduplicateWithinList(partialMatch);

      expect(result.duplicates.length).toBe(1);
    });

    it('should handle empty array', () => {
      const result = deduplicateWithinList([]);

      expect(result.unique.length).toBe(0);
      expect(result.duplicates.length).toBe(0);
    });

    it('should handle single place', () => {
      const result = deduplicateWithinList([validSanityPlace]);

      expect(result.unique.length).toBe(1);
      expect(result.duplicates.length).toBe(0);
    });

    it('should provide distance in duplicate info', () => {
      const result = deduplicateWithinList(placesForDedup);

      expect(result.duplicates[0]?.distance).toBeDefined();
      expect(result.duplicates[0]?.distance).toBeLessThan(50);
    });

    it('should provide existing name in duplicate info', () => {
      const result = deduplicateWithinList(placesForDedup);

      expect(result.duplicates[0]?.existingName).toBe('Coffee Shop A');
    });
  });

  describe('haversine distance (via deduplication)', () => {
    it('should correctly calculate distance between known points', () => {
      // Prague Old Town Square to Prague Castle is about 1.5km
      const places: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Old Town Square',
          slug: { _type: 'slug', current: 'old-town-square' },
          domains: ['guide'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0875, lng: 14.4213 },
          },
        },
        {
          _type: 'place',
          name: 'Old Town Square Copy', // Same name to trigger comparison
          slug: { _type: 'slug', current: 'old-town-square-copy' },
          domains: ['guide'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0911, lng: 14.4018 }, // Prague Castle
          },
        },
      ];

      // With 50m threshold, should not be duplicates (they're ~1.5km apart)
      const result = deduplicateWithinList(places, 50);
      expect(result.duplicates.length).toBe(0);

      // With 2000m threshold, should be duplicates
      const result2000 = deduplicateWithinList(places, 2000);
      expect(result2000.duplicates.length).toBe(1);
      expect(result2000.duplicates[0]?.distance).toBeGreaterThan(1000);
      expect(result2000.duplicates[0]?.distance).toBeLessThan(2000);
    });
  });

  describe('name similarity (via deduplication)', () => {
    it('should detect similar names with typos', () => {
      const places: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Coffee House',
          slug: { _type: 'slug', current: 'coffee-house' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
        {
          _type: 'place',
          name: 'Coffee Housee', // One char typo - should match with Levenshtein
          slug: { _type: 'slug', current: 'coffee-housee' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0756, lng: 14.4379 },
          },
        },
      ];

      const result = deduplicateWithinList(places);

      expect(result.duplicates.length).toBe(1);
    });

    it('should not match completely different names', () => {
      const places: SanityPlace[] = [
        {
          _type: 'place',
          name: 'Coffee Shop',
          slug: { _type: 'slug', current: 'coffee-shop' },
          domains: ['coffee'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0755, lng: 14.4378 },
          },
        },
        {
          _type: 'place',
          name: 'Beer Garden',
          slug: { _type: 'slug', current: 'beer-garden' },
          domains: ['beer'],
          location: {
            _type: 'geolocation',
            geopoint: { _type: 'geopoint', lat: 50.0756, lng: 14.4379 },
          },
        },
      ];

      const result = deduplicateWithinList(places);

      expect(result.duplicates.length).toBe(0);
    });
  });
});
