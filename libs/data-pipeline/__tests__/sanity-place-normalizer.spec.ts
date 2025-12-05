import { DataNormalizer, normalizePlaces, placesToNDJSON } from '../src/processors/sanity-place-normalizer';
import { scrapedPlace, minimalScrapedPlace } from './fixtures';
import type { ScrapedPlace } from '../src/types/scraped-place.types';

describe('normalizer', () => {
  describe('DataNormalizer', () => {
    describe('normalize', () => {
      it('should normalize a complete scraped place', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result._type).toBe('place');
        expect(result.name).toBe('Scraped Coffee Shop');
        expect(result.slug.current).toBe('scraped-coffee-shop');
      });

      it('should include location with geopoint', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.location?.geopoint?.lat).toBe(50.0875);
        expect(result.location?.geopoint?.lng).toBe(14.4213);
        expect(result.location?.address).toBe('456 Oak Avenue, Prague');
      });

      it('should normalize phone number', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.phone).toBe('+420 987 654 321');
      });

      it('should include website', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.website).toBe('https://scraped-coffee.example.com');
      });

      it('should normalize categories', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.categories).toBeDefined();
        expect(result.categories?.some((c) => c.value === 'cafe')).toBe(true);
      });

      it('should normalize price level', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.price).toBe('average'); // priceLevel 2 = average
      });

      it('should normalize opening hours', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.openingHours).toHaveLength(7);
        expect(result.openingHours?.[0]?.day).toBe('monday');
        expect(result.openingHours?.[0]?.openTime).toBe('08:00');
        expect(result.openingHours?.[0]?.closeTime).toBe('18:00');
      });

      it('should include closed days', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        const sunday = result.openingHours?.find((h) => h.day === 'sunday');
        expect(sunday?.closed).toBe(true);
      });

      it('should include photos as gallery', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.gallery).toHaveLength(2);
        expect(result.gallery?.[0]?._type).toBe('image');
        expect(result.gallery?.[0]?.url).toBe('https://example.com/photo1.jpg');
      });

      it('should include external links from sourceUrl', () => {
        const normalizer = new DataNormalizer();
        const result = normalizer.normalize(scrapedPlace);

        expect(result.externalLinks).toHaveLength(1);
        expect(result.externalLinks?.[0]?.name).toBe('Google Maps');
        expect(result.externalLinks?.[0]?.url).toBe('https://maps.google.com/?cid=123456');
      });
    });

    describe('normalize with options', () => {
      it('should apply domain option', () => {
        const normalizer = new DataNormalizer({ domain: 'beer' });
        const result = normalizer.normalize(scrapedPlace);

        expect(result.domains).toEqual(['beer']);
      });

      it('should apply defaultCategory when no categories found', () => {
        const normalizer = new DataNormalizer({ defaultCategory: 'pub' });
        const result = normalizer.normalize(minimalScrapedPlace);

        expect(result.categories).toHaveLength(1);
        expect(result.categories?.[0]?.value).toBe('pub');
      });

      it('should include raw scraped data when option is set', () => {
        const normalizer = new DataNormalizer({ includeRawData: true });
        const result = normalizer.normalize(scrapedPlace);

        expect(result.scrapedData).toBeDefined();
        expect(result.scrapedData?.source).toBe('google-maps');
        expect(result.scrapedData?.sourceId).toBe('ChIJrTLr-GyuEmsRBfy61i59si0');
        expect(result.scrapedData?.rating).toBe(4.5);
        expect(result.scrapedData?.reviewCount).toBe(150);
      });

      it('should use custom slug generator', () => {
        const normalizer = new DataNormalizer({
          slugGenerator: (name) => `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
        });
        const result = normalizer.normalize(scrapedPlace);

        expect(result.slug.current).toBe('custom-scraped-coffee-shop');
      });
    });

    describe('normalizeAll', () => {
      it('should normalize multiple places', () => {
        const normalizer = new DataNormalizer({ domain: 'coffee' });
        const places = [scrapedPlace, minimalScrapedPlace];
        const results = normalizer.normalizeAll(places);

        expect(results).toHaveLength(2);
        expect(results[0]?.name).toBe('Scraped Coffee Shop');
        expect(results[1]?.name).toBe('Minimal Scraped Place');
      });

      it('should handle empty array', () => {
        const normalizer = new DataNormalizer();
        const results = normalizer.normalizeAll([]);

        expect(results).toHaveLength(0);
      });
    });

    describe('toNDJSON', () => {
      it('should convert places to NDJSON string', () => {
        const normalizer = new DataNormalizer({ domain: 'coffee' });
        const places = [scrapedPlace, minimalScrapedPlace];
        const ndjson = normalizer.toNDJSON(places);

        const lines = ndjson.split('\n');
        expect(lines).toHaveLength(2);

        const parsed0 = JSON.parse(lines[0] as string);
        expect(parsed0.name).toBe('Scraped Coffee Shop');
      });
    });

    describe('slugify', () => {
      it('should generate valid slugs', () => {
        const normalizer = new DataNormalizer();
        
        const testCases: Array<{ input: ScrapedPlace; expected: string }> = [
          { 
            input: { ...minimalScrapedPlace, name: 'Simple Name' }, 
            expected: 'simple-name' 
          },
          { 
            input: { ...minimalScrapedPlace, name: 'Café Müller' }, 
            expected: 'cafe-muller' 
          },
          { 
            input: { ...minimalScrapedPlace, name: 'Name with   spaces' }, 
            expected: 'name-with-spaces' 
          },
          { 
            input: { ...minimalScrapedPlace, name: '---Dashes---' }, 
            expected: 'dashes' 
          },
          { 
            input: { ...minimalScrapedPlace, name: 'Numbers 123 Here' }, 
            expected: 'numbers-123-here' 
          },
        ];

        testCases.forEach(({ input, expected }) => {
          const result = normalizer.normalize(input);
          expect(result.slug.current).toBe(expected);
        });
      });

      it('should truncate long slugs to 100 characters', () => {
        const normalizer = new DataNormalizer();
        const longName = 'A'.repeat(150);
        const place = { ...minimalScrapedPlace, name: longName };
        
        const result = normalizer.normalize(place);

        expect(result.slug.current.length).toBeLessThanOrEqual(100);
      });
    });

    describe('category normalization', () => {
      it('should map known category types', () => {
        const normalizer = new DataNormalizer();
        
        const categoryMappings: Array<{ input: string[]; expected: string }> = [
          { input: ['brewery'], expected: 'brewery' },
          { input: ['beer_garden'], expected: 'beer-garden' },
          { input: ['pub'], expected: 'pub' },
          { input: ['bar'], expected: 'pub' },
          { input: ['cafe'], expected: 'cafe' },
          { input: ['coffee_shop'], expected: 'cafe' },
          { input: ['bakery'], expected: 'bakery' },
          { input: ['restaurant'], expected: 'restaurant' },
          { input: ['bistro'], expected: 'bistro' },
        ];

        categoryMappings.forEach(({ input, expected }) => {
          const place = { ...minimalScrapedPlace, categories: input };
          const result = normalizer.normalize(place);
          expect(result.categories?.[0]?.value).toBe(expected);
        });
      });

      it('should deduplicate categories', () => {
        const normalizer = new DataNormalizer();
        const place = { 
          ...minimalScrapedPlace, 
          categories: ['bar', 'pub', 'sports_bar'] // All map to 'pub'
        };
        
        const result = normalizer.normalize(place);

        expect(result.categories?.filter((c) => c.value === 'pub')).toHaveLength(1);
      });
    });

    describe('price level normalization', () => {
      it('should map numeric price levels', () => {
        const normalizer = new DataNormalizer();
        
        const priceMappings: Array<{ input: number; expected: string }> = [
          { input: 0, expected: 'low' },
          { input: 1, expected: 'low' },
          { input: 2, expected: 'average' },
          { input: 3, expected: 'high' },
          { input: 4, expected: 'very-high' },
        ];

        priceMappings.forEach(({ input, expected }) => {
          const place = { ...minimalScrapedPlace, priceLevel: input };
          const result = normalizer.normalize(place);
          expect(result.price).toBe(expected);
        });
      });

      it('should map string price levels', () => {
        const normalizer = new DataNormalizer();
        
        const priceMappings: Array<{ input: string; expected: string }> = [
          { input: '$', expected: 'low' },
          { input: '$$', expected: 'average' },
          { input: '$$$', expected: 'high' },
          { input: '$$$$', expected: 'very-high' },
        ];

        priceMappings.forEach(({ input, expected }) => {
          const place = { ...minimalScrapedPlace, priceLevel: input };
          const result = normalizer.normalize(place);
          expect(result.price).toBe(expected);
        });
      });
    });
  });

  describe('convenience functions', () => {
    describe('normalizePlaces', () => {
      it('should normalize places with options', () => {
        const places = [scrapedPlace];
        const results = normalizePlaces(places, { domain: 'coffee' });

        expect(results).toHaveLength(1);
        expect(results[0]?.domains).toContain('coffee');
      });
    });

    describe('placesToNDJSON', () => {
      it('should convert places to NDJSON', () => {
        const places = [scrapedPlace];
        const ndjson = placesToNDJSON(places);

        expect(typeof ndjson).toBe('string');
        const parsed = JSON.parse(ndjson);
        expect(parsed.name).toBe('Scraped Coffee Shop');
      });
    });
  });
});
