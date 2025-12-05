import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  convertGoogleTakeout,
  convertGoogleTakeoutFile,
  writePlacesToNDJSON,
  readPlacesFromNDJSON,
} from '../src/processors/google-takeout-converter';
import { googleTakeoutGeoJSON, validSanityPlace, minimalSanityPlace } from './fixtures';

describe('converter', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'data-pipeline-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('convertGoogleTakeout', () => {
    it('should convert valid GeoJSON features to SanityPlace', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON);

      expect(result.places.length).toBe(3);
      expect(result.skipped).toBe(0);
      expect(result.errors.length).toBe(0);
    });

    it('should correctly extract place name and slug', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON);
      const place = result.places[0];

      expect(place?.name).toBe('Prague Coffee House');
      expect(place?.slug.current).toBe('prague-coffee-house');
    });

    it('should correctly extract coordinates from GeoJSON [lng, lat] format', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON);
      const place = result.places[0];

      expect(place?.location?.geopoint?.lat).toBe(50.0755);
      expect(place?.location?.geopoint?.lng).toBe(14.4378);
    });

    it('should include Google Maps URL in externalLinks', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON);
      const place = result.places[0];

      expect(place?.externalLinks).toHaveLength(1);
      expect(place?.externalLinks?.[0]?.name).toBe('Google Maps');
      expect(place?.externalLinks?.[0]?.url).toBe('https://maps.google.com/?cid=123');
    });

    it('should apply domain option to all places', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON, { domain: 'coffee' });

      result.places.forEach((place) => {
        expect(place.domains).toContain('coffee');
      });
    });

    it('should apply defaultCategory option', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON, {
        defaultCategory: 'cafe',
      });

      result.places.forEach((place) => {
        expect(place.categories).toHaveLength(1);
        expect(place.categories?.[0]?.value).toBe('cafe');
      });
    });

    it('should skip places without coordinates when requireCoordinates is true', () => {
      const result = convertGoogleTakeout(googleTakeoutGeoJSON, {
        requireCoordinates: true,
      });

      // Third feature has [0,0] coordinates
      expect(result.places.length).toBe(2);
      expect(result.skipped).toBe(1);
    });

    it('should detect beer domain from brewery name', () => {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [14.0, 50.0] as [number, number] },
            properties: { Title: 'Craft Brewery Prague' },
          },
        ],
      };

      const result = convertGoogleTakeout(geojson);

      expect(result.places[0]?.domains).toContain('beer');
    });

    it('should detect coffee domain from cafe name', () => {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [14.0, 50.0] as [number, number] },
            properties: { Title: 'Espresso Bar & Café' },
          },
        ],
      };

      const result = convertGoogleTakeout(geojson);

      expect(result.places[0]?.domains).toContain('coffee');
    });

    it('should default to guide domain when no keywords match', () => {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [14.0, 50.0] as [number, number] },
            properties: { Title: 'Random Place Name' },
          },
        ],
      };

      const result = convertGoogleTakeout(geojson);

      expect(result.places[0]?.domains).toContain('guide');
    });

    it('should skip features without Title', () => {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            geometry: { type: 'Point' as const, coordinates: [14.0, 50.0] as [number, number] },
            properties: {},
          },
        ],
      };

      const result = convertGoogleTakeout(geojson);

      expect(result.places.length).toBe(0);
      expect(result.skipped).toBe(1);
      expect(result.errors).toContain('Feature missing Title property');
    });

    it('should handle empty features array', () => {
      const geojson = {
        type: 'FeatureCollection' as const,
        features: [],
      };

      const result = convertGoogleTakeout(geojson);

      expect(result.places.length).toBe(0);
      expect(result.skipped).toBe(0);
    });
  });

  describe('convertGoogleTakeoutFile', () => {
    it('should read and convert a GeoJSON file', () => {
      const filePath = path.join(tempDir, 'test.geojson');
      fs.writeFileSync(filePath, JSON.stringify(googleTakeoutGeoJSON));

      const result = convertGoogleTakeoutFile(filePath);

      expect(result.places.length).toBe(3);
    });

    it('should throw error for invalid GeoJSON structure', () => {
      const filePath = path.join(tempDir, 'invalid.geojson');
      fs.writeFileSync(filePath, JSON.stringify({ type: 'Invalid' }));

      expect(() => convertGoogleTakeoutFile(filePath)).toThrow(
        'Invalid GeoJSON: expected FeatureCollection with features array'
      );
    });

    it('should throw error for non-existent file', () => {
      expect(() => convertGoogleTakeoutFile('/nonexistent/file.geojson')).toThrow();
    });
  });

  describe('writePlacesToNDJSON', () => {
    it('should write places as NDJSON', () => {
      const places = [validSanityPlace, minimalSanityPlace];
      const filePath = path.join(tempDir, 'output.ndjson');

      writePlacesToNDJSON(places, filePath);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      expect(lines.length).toBe(2);
      expect(JSON.parse(lines[0] as string).name).toBe('Test Coffee Shop');
      expect(JSON.parse(lines[1] as string).name).toBe('Minimal Place');
    });

    it('should handle empty places array', () => {
      const filePath = path.join(tempDir, 'empty.ndjson');

      writePlacesToNDJSON([], filePath);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toBe('');
    });
  });

  describe('readPlacesFromNDJSON', () => {
    it('should read places from NDJSON file', () => {
      const places = [validSanityPlace, minimalSanityPlace];
      const filePath = path.join(tempDir, 'input.ndjson');
      writePlacesToNDJSON(places, filePath);

      const result = readPlacesFromNDJSON(filePath);

      expect(result.length).toBe(2);
      expect(result[0]?.name).toBe('Test Coffee Shop');
      expect(result[1]?.name).toBe('Minimal Place');
    });

    it('should throw error for invalid JSON lines', () => {
      const filePath = path.join(tempDir, 'invalid.ndjson');
      fs.writeFileSync(filePath, '{"valid":true}\n{invalid json}\n');

      expect(() => readPlacesFromNDJSON(filePath)).toThrow('Invalid JSON on line 2');
    });

    it('should handle empty lines', () => {
      const filePath = path.join(tempDir, 'with-empty.ndjson');
      fs.writeFileSync(
        filePath,
        `${JSON.stringify(validSanityPlace)}\n\n${JSON.stringify(minimalSanityPlace)}\n`
      );

      const result = readPlacesFromNDJSON(filePath);

      expect(result.length).toBe(2);
    });
  });
});
