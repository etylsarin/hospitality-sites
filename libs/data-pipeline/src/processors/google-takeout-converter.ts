import * as fs from 'fs';
import type { SanityPlace } from './sanity-place-normalizer';

/**
 * Google Takeout GeoJSON types
 */
interface GoogleTakeoutFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    Title?: string;
    'Google Maps URL'?: string;
    Location?: {
      Address?: string;
      'Country Code'?: string;
      'Geo Coordinates'?: {
        Latitude?: number;
        Longitude?: number;
      };
    };
    Published?: string;
  };
}

interface GoogleTakeoutGeoJSON {
  type: 'FeatureCollection';
  features: GoogleTakeoutFeature[];
}

/**
 * Conversion options
 */
export interface ConvertOptions {
  /** Domain to assign (beer, coffee, etc.) */
  domain?: string;
  /** Default category if none detected */
  defaultCategory?: string;
  /** Skip places without coordinates */
  requireCoordinates?: boolean;
}

/**
 * Conversion result
 */
export interface ConvertResult {
  places: SanityPlace[];
  skipped: number;
  errors: string[];
}

/**
 * Generate URL-friendly slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Detect domain from place name or category
 */
function detectDomain(name: string, category?: string): string[] {
  const searchText = `${name} ${category || ''}`.toLowerCase();
  const domains: string[] = [];
  
  // Beer indicators
  if (/brew|beer|pub|bar|tap|ale|lager|craft|hops/i.test(searchText)) {
    domains.push('beer');
  }
  
  // Coffee indicators
  if (/coffee|café|cafe|espresso|roast|latte|cappuccino|barista/i.test(searchText)) {
    domains.push('coffee');
  }
  
  // Wine indicators
  if (/wine|vino|vineyard|winery|sommelier/i.test(searchText)) {
    domains.push('vino');
  }
  
  return domains.length > 0 ? domains : ['guide'];
}

/**
 * Extract country code from address
 */
function extractCountryCode(address?: string): string | undefined {
  if (!address) return undefined;
  
  // Common country patterns at end of address
  const countryPatterns: Record<string, string> = {
    'czech': 'CZ',
    'czechia': 'CZ',
    'germany': 'DE',
    'deutschland': 'DE',
    'austria': 'AT',
    'österreich': 'AT',
    'poland': 'PL',
    'netherlands': 'NL',
    'belgium': 'BE',
    'france': 'FR',
    'italy': 'IT',
    'spain': 'ES',
    'portugal': 'PT',
    'united kingdom': 'GB',
    'uk': 'GB',
    'ireland': 'IE',
    'usa': 'US',
    'united states': 'US',
  };
  
  const lowerAddress = address.toLowerCase();
  for (const [pattern, code] of Object.entries(countryPatterns)) {
    if (lowerAddress.includes(pattern)) {
      return code;
    }
  }
  
  return undefined;
}

/**
 * Convert Google Takeout GeoJSON to Sanity places
 */
export function convertGoogleTakeout(
  geojson: GoogleTakeoutGeoJSON,
  options: ConvertOptions = {}
): ConvertResult {
  const { domain, defaultCategory, requireCoordinates = false } = options;
  const result: ConvertResult = {
    places: [],
    skipped: 0,
    errors: [],
  };
  
  for (const feature of geojson.features) {
    try {
      const props = feature.properties;
      const name = props.Title;
      
      if (!name) {
        result.skipped++;
        result.errors.push('Feature missing Title property');
        continue;
      }
      
      // Get coordinates
      const [lng, lat] = feature.geometry.coordinates;
      const hasValidCoords = lat !== 0 && lng !== 0;
      
      if (requireCoordinates && !hasValidCoords) {
        result.skipped++;
        result.errors.push(`${name}: Missing valid coordinates`);
        continue;
      }
      
      // Build address info
      const address = props.Location?.Address;
      const _countryCode = props.Location?.['Country Code'] || extractCountryCode(address);
      
      // Detect domain
      const domains = domain ? [domain] : detectDomain(name);
      
      // Build Sanity place
      const place: SanityPlace = {
        _type: 'place',
        name,
        slug: {
          _type: 'slug',
          current: slugify(name),
        },
        domains,
        location: hasValidCoords ? {
          _type: 'geolocation',
          geopoint: {
            _type: 'geopoint',
            lat,
            lng,
          },
          address: address,
        } : undefined,
      };
      
      // Add category if provided
      if (defaultCategory) {
        place.categories = [{
          value: defaultCategory,
          label: defaultCategory.charAt(0).toUpperCase() + defaultCategory.slice(1),
        }];
      }
      
      // Add Google Maps URL if available
      const googleMapsUrl = props['Google Maps URL'];
      if (googleMapsUrl) {
        place.externalLinks = [{
          name: 'Google Maps',
          url: googleMapsUrl,
        }];
      }
      
      result.places.push(place);
    } catch (error) {
      result.skipped++;
      result.errors.push(`Error processing feature: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return result;
}

/**
 * Read and convert a Google Takeout GeoJSON file
 */
export function convertGoogleTakeoutFile(
  inputPath: string,
  options: ConvertOptions = {}
): ConvertResult {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const geojson: GoogleTakeoutGeoJSON = JSON.parse(content);
  
  if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    throw new Error('Invalid GeoJSON: expected FeatureCollection with features array');
  }
  
  return convertGoogleTakeout(geojson, options);
}

/**
 * Write places to NDJSON file
 */
export function writePlacesToNDJSON(places: SanityPlace[], outputPath: string): void {
  const ndjson = places.map(place => JSON.stringify(place)).join('\n');
  fs.writeFileSync(outputPath, ndjson, 'utf-8');
}

/**
 * Read places from NDJSON file
 */
export function readPlacesFromNDJSON(inputPath: string): SanityPlace[] {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    try {
      return JSON.parse(line) as SanityPlace;
    } catch (error) {
      throw new Error(`Invalid JSON on line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}
