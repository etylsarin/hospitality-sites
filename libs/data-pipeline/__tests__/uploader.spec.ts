import { generateDocumentId } from '../src/sanity/uploader';
import { validSanityPlace, minimalSanityPlace } from './fixtures';

describe('uploader', () => {
  describe('generateDocumentId', () => {
    it('should generate ID from slug and domain', () => {
      const id = generateDocumentId(validSanityPlace);

      expect(id).toBe('coffee-test-coffee-shop');
    });

    it('should use first domain when multiple domains exist', () => {
      const placeWithMultipleDomains = {
        ...validSanityPlace,
        domains: ['beer', 'coffee'],
      };

      const id = generateDocumentId(placeWithMultipleDomains);

      expect(id).toContain('beer-');
    });

    it('should fallback to "place" when no domains', () => {
      const placeWithoutDomains = {
        ...validSanityPlace,
        domains: undefined,
      };

      const id = generateDocumentId(placeWithoutDomains);

      expect(id).toContain('place-');
    });

    it('should sanitize special characters', () => {
      const placeWithSpecialChars = {
        ...validSanityPlace,
        slug: { _type: 'slug' as const, current: 'café-müller!' },
      };

      const id = generateDocumentId(placeWithSpecialChars);

      expect(id).toMatch(/^[a-z0-9-]+$/);
      expect(id).not.toContain('é');
      expect(id).not.toContain('ü');
      expect(id).not.toContain('!');
    });

    it('should remove consecutive dashes', () => {
      const placeWithDashes = {
        ...validSanityPlace,
        slug: { _type: 'slug' as const, current: 'test---place' },
      };

      const id = generateDocumentId(placeWithDashes);

      expect(id).not.toContain('--');
    });

    it('should remove leading and trailing dashes', () => {
      const placeWithEdgeDashes = {
        ...validSanityPlace,
        slug: { _type: 'slug' as const, current: '-test-place-' },
      };

      const id = generateDocumentId(placeWithEdgeDashes);

      expect(id).not.toMatch(/^-/);
      expect(id).not.toMatch(/-$/);
    });

    it('should truncate long IDs to 100 characters', () => {
      const placeWithLongSlug = {
        ...validSanityPlace,
        slug: { _type: 'slug' as const, current: 'a'.repeat(120) },
      };

      const id = generateDocumentId(placeWithLongSlug);

      expect(id.length).toBeLessThanOrEqual(100);
    });

    it('should generate fallback ID for empty slug', () => {
      const placeWithEmptySlug = {
        ...validSanityPlace,
        slug: { _type: 'slug' as const, current: '' },
      };

      const id = generateDocumentId(placeWithEmptySlug);

      // With empty slug, result is just the domain
      expect(id).toBe('coffee');
    });

    it('should handle minimal place', () => {
      const id = generateDocumentId(minimalSanityPlace);

      expect(id).toBe('guide-minimal-place');
    });
  });

  // Note: uploadPlace and uploadPlaces require mocking the Sanity client
  // These would be integration tests that verify the actual upload behavior
  // For unit tests, we test the helper functions like generateDocumentId
});
