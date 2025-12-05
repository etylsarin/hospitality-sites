import {
  validatePlace,
  validatePlaces,
  validateNDJSONContent,
} from '../src/processors/place-validator';
import {
  validSanityPlace,
  minimalSanityPlace,
  placeWithNullIsland,
  invalidPlaceMissingName,
  invalidPlaceBadSlug,
  invalidPlaceBadDomain,
  validNDJSON,
  invalidNDJSON,
} from './fixtures';

describe('validator', () => {
  describe('validatePlace', () => {
    describe('valid places', () => {
      it('should validate a complete valid place', () => {
        const result = validatePlace(validSanityPlace);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate a minimal valid place', () => {
        const result = validatePlace(minimalSanityPlace);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    describe('required field validation', () => {
      it('should fail when _type is missing', () => {
        const place = { ...validSanityPlace, _type: undefined as unknown as 'place' };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid or missing _type (must be "place")');
      });

      it('should fail when _type is wrong', () => {
        const place = { ...validSanityPlace, _type: 'wrong' as 'place' };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Invalid or missing _type (must be "place")');
      });

      it('should fail when name is missing', () => {
        const result = validatePlace(invalidPlaceMissingName);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing or empty name');
      });

      it('should fail when name is empty', () => {
        const place = { ...validSanityPlace, name: '' };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing or empty name');
      });

      it('should fail when slug is missing', () => {
        const place = { ...validSanityPlace, slug: undefined as unknown as typeof validSanityPlace.slug };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing slug.current');
      });

      it('should fail when domains is empty', () => {
        const place = { ...validSanityPlace, domains: [] };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing or empty domains array');
      });
    });

    describe('slug validation', () => {
      it('should fail for slug with uppercase letters', () => {
        const result = validatePlace(invalidPlaceBadSlug);

        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('Invalid slug format'))).toBe(true);
      });

      it('should fail for slug with spaces', () => {
        const place = {
          ...validSanityPlace,
          slug: { _type: 'slug' as const, current: 'has spaces' },
        };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('Invalid slug format'))).toBe(true);
      });

      it('should fail for slug too long', () => {
        const place = {
          ...validSanityPlace,
          slug: { _type: 'slug' as const, current: 'a'.repeat(101) },
        };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Slug too long (max 100 characters)');
      });
    });

    describe('domain validation', () => {
      it('should fail for invalid domain', () => {
        const result = validatePlace(invalidPlaceBadDomain);

        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('Invalid domains'))).toBe(true);
      });

      it('should accept valid domains', () => {
        const domains = ['beer', 'coffee', 'vino', 'guide'];

        domains.forEach((domain) => {
          const place = { ...validSanityPlace, domains: [domain] };
          const result = validatePlace(place);
          expect(result.valid).toBe(true);
        });
      });
    });

    describe('location validation', () => {
      it('should warn when location is missing', () => {
        const result = validatePlace(minimalSanityPlace);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain(
          'Missing location.geopoint (place will not appear on map)'
        );
      });

      it('should warn for null island coordinates', () => {
        const result = validatePlace(placeWithNullIsland);

        expect(result.valid).toBe(true);
        expect(
          result.warnings.some((w) => w.includes('null island'))
        ).toBe(true);
      });

      it('should fail for invalid latitude', () => {
        const place = {
          ...validSanityPlace,
          location: {
            _type: 'geolocation' as const,
            geopoint: { _type: 'geopoint' as const, lat: 100, lng: 14.4378 },
          },
        };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('Invalid latitude'))).toBe(true);
      });

      it('should fail for invalid longitude', () => {
        const place = {
          ...validSanityPlace,
          location: {
            _type: 'geolocation' as const,
            geopoint: { _type: 'geopoint' as const, lat: 50.0755, lng: 200 },
          },
        };
        const result = validatePlace(place);

        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('Invalid longitude'))).toBe(true);
      });
    });

    describe('optional field validation', () => {
      it('should warn for invalid website URL', () => {
        const place = { ...validSanityPlace, website: 'not-a-url' };
        const result = validatePlace(place);

        expect(result.valid).toBe(true);
        expect(result.warnings.some((w) => w.includes('Invalid website URL'))).toBe(true);
      });

      it('should warn for unusual phone format', () => {
        const place = { ...validSanityPlace, phone: 'call me maybe' };
        const result = validatePlace(place);

        expect(result.valid).toBe(true);
        expect(result.warnings.some((w) => w.includes('Phone number may have invalid format'))).toBe(true);
      });

      it('should warn for unknown price level', () => {
        const place = { ...validSanityPlace, price: 'expensive' };
        const result = validatePlace(place);

        expect(result.valid).toBe(true);
        expect(result.warnings.some((w) => w.includes('Unknown price level'))).toBe(true);
      });

      it('should warn for very long name', () => {
        const place = { ...validSanityPlace, name: 'A'.repeat(201) };
        const result = validatePlace(place);

        expect(result.valid).toBe(true);
        expect(result.warnings).toContain('Name is unusually long (>200 characters)');
      });
    });
  });

  describe('validatePlaces', () => {
    it('should validate all places in batch', () => {
      const places = [validSanityPlace, minimalSanityPlace, invalidPlaceMissingName];
      const result = validatePlaces(places);

      expect(result.valid).toBe(false);
      expect(result.validCount).toBe(2);
      expect(result.invalidCount).toBe(1);
      expect(result.results.length).toBe(3);
    });

    it('should return valid=true when all places are valid', () => {
      const places = [validSanityPlace, minimalSanityPlace];
      const result = validatePlaces(places);

      expect(result.valid).toBe(true);
      expect(result.validCount).toBe(2);
      expect(result.invalidCount).toBe(0);
    });

    it('should handle empty array', () => {
      const result = validatePlaces([]);

      expect(result.valid).toBe(true);
      expect(result.validCount).toBe(0);
      expect(result.results.length).toBe(0);
    });
  });

  describe('validateNDJSONContent', () => {
    it('should validate valid NDJSON content', () => {
      const result = validateNDJSONContent(validNDJSON);

      expect(result.valid).toBe(true);
      expect(result.documentCount).toBe(2);
      expect(result.lineErrors).toHaveLength(0);
    });

    it('should detect invalid JSON lines', () => {
      const result = validateNDJSONContent(invalidNDJSON);

      expect(result.valid).toBe(false);
      expect(result.lineErrors.some((e) => e.error.includes('Invalid JSON'))).toBe(true);
    });

    it('should detect validation errors in documents', () => {
      const result = validateNDJSONContent(invalidNDJSON);

      expect(result.lineErrors.some((e) => e.error.includes('Missing or empty name'))).toBe(true);
    });

    it('should detect duplicate _id values', () => {
      const ndjsonWithDupes = `{"_id":"same-id","_type":"place","name":"Place 1","slug":{"_type":"slug","current":"place-1"},"domains":["coffee"]}
{"_id":"same-id","_type":"place","name":"Place 2","slug":{"_type":"slug","current":"place-2"},"domains":["coffee"]}`;

      const result = validateNDJSONContent(ndjsonWithDupes);

      expect(result.lineErrors.some((e) => e.error.includes('Duplicate _id'))).toBe(true);
    });

    it('should handle empty content', () => {
      const result = validateNDJSONContent('');

      expect(result.valid).toBe(true);
      expect(result.documentCount).toBe(0);
    });

    it('should report correct line numbers for errors', () => {
      const result = validateNDJSONContent(invalidNDJSON);

      const jsonError = result.lineErrors.find((e) => e.error.includes('Invalid JSON'));
      expect(jsonError?.line).toBe(2);
    });
  });
});
