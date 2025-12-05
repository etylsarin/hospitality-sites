import { searchPlaces } from '../src/processors/google-places-search';
import { mockPlaceDetailsResponse, mockTextSearchResponse } from './fixtures';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('google-places-search', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('searchPlaces', () => {
    it('should throw error when neither query nor location provided', async () => {
      await expect(
        searchPlaces({
          apiKey: 'test-key',
          domain: 'coffee',
        })
      ).rejects.toThrow('Either query or location is required');
    });

    it('should perform text search with query', async () => {
      // Mock text search response
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockTextSearchResponse),
        })
        // Mock place details for each result
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: {
                ...mockPlaceDetailsResponse,
                place_id: 'ChIJrTLr-GyuEmsRBfy61i59si1',
                name: 'Another Coffee Place',
              },
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'coffee shops Prague',
        domain: 'coffee',
        rateLimitMs: 0, // No delay for tests
      });

      expect(result.places.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.errors.length).toBe(0);
    });

    it('should include correct fields in search URL', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ status: 'ZERO_RESULTS', results: [] }),
      });

      await searchPlaces({
        apiKey: 'test-api-key',
        query: 'coffee Prague',
        domain: 'coffee',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('textsearch')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('query=coffee+Prague')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('key=test-api-key')
      );
    });

    it('should perform nearby search with location', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ status: 'ZERO_RESULTS', results: [] }),
      });

      await searchPlaces({
        apiKey: 'test-key',
        location: { lat: 50.0755, lng: 14.4378 },
        radius: 1000,
        domain: 'coffee',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('nearbysearch')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('location=50.0755%2C14.4378')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('radius=1000')
      );
    });

    it('should include type parameter in nearby search', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ status: 'ZERO_RESULTS', results: [] }),
      });

      await searchPlaces({
        apiKey: 'test-key',
        location: { lat: 50.0755, lng: 14.4378 },
        type: 'cafe',
        domain: 'coffee',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('type=cafe')
      );
    });

    it('should convert place details to SanityPlace format', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'test-place-id',
                  name: 'Test Coffee',
                  geometry: { location: { lat: 50.0755, lng: 14.4378 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      const place = result.places[0];
      expect(place?._type).toBe('place');
      expect(place?.name).toBe('Mock Coffee Shop');
      expect(place?.slug.current).toBe('mock-coffee-shop');
      expect(place?.domains).toContain('coffee');
      expect(place?.location?.geopoint?.lat).toBe(50.0755);
      expect(place?.location?.geopoint?.lng).toBe(14.4378);
      expect(place?.location?.address).toBe('123 Mock Street, Prague, CZ');
      expect(place?.phone).toBe('+420 123 456 789');
      expect(place?.website).toBe('https://mock-coffee.example.com');
      expect(place?.price).toBe('average');
    });

    it('should include external links with Google Maps URL', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'test-place-id',
                  name: 'Test Coffee',
                  geometry: { location: { lat: 50.0755, lng: 14.4378 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      const place = result.places[0];
      expect(place?.externalLinks).toHaveLength(1);
      expect(place?.externalLinks?.[0]?.name).toBe('Google Maps');
      expect(place?.externalLinks?.[0]?.url).toBe('https://maps.google.com/?cid=12345');
    });

    it('should include scraped data metadata', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'test-place-id',
                  name: 'Test Coffee',
                  geometry: { location: { lat: 50.0755, lng: 14.4378 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      const place = result.places[0];
      expect(place?.scrapedData?.source).toBe('google-places-api');
      expect(place?.scrapedData?.sourceId).toBe('ChIJrTLr-GyuEmsRBfy61i59si0');
      expect(place?.scrapedData?.rating).toBe(4.5);
      expect(place?.scrapedData?.scrapedAt).toBeDefined();
    });

    it('should map Google place types to categories', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'test-place-id',
                  name: 'Test',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: {
                ...mockPlaceDetailsResponse,
                types: ['cafe', 'food', 'establishment'],
              },
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      const place = result.places[0];
      expect(place?.categories?.some((c) => c.value === 'cafe')).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'REQUEST_DENIED',
            error_message: 'Invalid API key',
          }),
      });

      await expect(
        searchPlaces({
          apiKey: 'invalid-key',
          query: 'test',
          domain: 'coffee',
        })
      ).rejects.toThrow('API error: REQUEST_DENIED');
    });

    it('should handle place details fetch failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'test-place-id',
                  name: 'Test',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'NOT_FOUND',
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      expect(result.places.length).toBe(0);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]?.error).toBe('Could not fetch details');
    });

    it('should respect maxResults limit', async () => {
      const manyResults = Array.from({ length: 20 }, (_, i) => ({
        place_id: `place-${i}`,
        name: `Place ${i}`,
        geometry: { location: { lat: 50.0, lng: 14.0 } },
      }));

      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: manyResults,
            }),
        })
        // Mock just 5 place details
        .mockResolvedValue({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        maxResults: 5,
        rateLimitMs: 0,
      });

      expect(result.places.length).toBe(5);
    });

    it('should call onProgress callback', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'place-1',
                  name: 'Place 1',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
                {
                  place_id: 'place-2',
                  name: 'Place 2',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
              ],
            }),
        })
        .mockResolvedValue({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const onProgress = jest.fn();

      await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
        onProgress,
      });

      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress).toHaveBeenCalledWith(1, 2, 'Place 1');
      expect(onProgress).toHaveBeenCalledWith(2, 2, 'Place 2');
    });

    it('should skip duplicate place IDs', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'same-id',
                  name: 'Place 1',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
                {
                  place_id: 'same-id', // Duplicate
                  name: 'Place 1 Duplicate',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
              ],
            }),
        })
        .mockResolvedValue({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      expect(result.places.length).toBe(1);
    });

    it('should generate unique slugs for same-named places', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'place-1',
                  name: 'Starbucks',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
                {
                  place_id: 'place-2',
                  name: 'Starbucks',
                  geometry: { location: { lat: 50.1, lng: 14.1 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: { ...mockPlaceDetailsResponse, name: 'Starbucks' },
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: {
                ...mockPlaceDetailsResponse,
                place_id: 'place-2',
                name: 'Starbucks',
              },
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'starbucks',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      expect(result.places.length).toBe(2);
      expect(result.places[0]?.slug.current).toBe('starbucks');
      expect(result.places[1]?.slug.current).toBe('starbucks-1');
    });

    it('should convert opening hours correctly', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              results: [
                {
                  place_id: 'test-place',
                  name: 'Test',
                  geometry: { location: { lat: 50.0, lng: 14.0 } },
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              status: 'OK',
              result: mockPlaceDetailsResponse,
            }),
        });

      const result = await searchPlaces({
        apiKey: 'test-key',
        query: 'test',
        domain: 'coffee',
        rateLimitMs: 0,
      });

      const place = result.places[0];
      expect(place?.openingHours).toBeDefined();
      expect(place?.openingHours?.[0]?.day).toBe('monday');
      expect(place?.openingHours?.[0]?.openTime).toBe('08:00');
      expect(place?.openingHours?.[0]?.closeTime).toBe('18:00');
    });

    it('should map price levels correctly', async () => {
      const priceLevels = [0, 1, 2, 3, 4];
      const expectedPrices = ['low', 'low', 'average', 'high', 'very-high'];

      for (let i = 0; i < priceLevels.length; i++) {
        mockFetch.mockReset();
        mockFetch
          .mockResolvedValueOnce({
            json: () =>
              Promise.resolve({
                status: 'OK',
                results: [
                  {
                    place_id: `place-${i}`,
                    name: 'Test',
                    geometry: { location: { lat: 50.0, lng: 14.0 } },
                  },
                ],
              }),
          })
          .mockResolvedValueOnce({
            json: () =>
              Promise.resolve({
                status: 'OK',
                result: { ...mockPlaceDetailsResponse, price_level: priceLevels[i] },
              }),
          });

        const result = await searchPlaces({
          apiKey: 'test-key',
          query: 'test',
          domain: 'coffee',
          rateLimitMs: 0,
        });

        expect(result.places[0]?.price).toBe(expectedPrices[i]);
      }
    });
  });
});
