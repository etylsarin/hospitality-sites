#!/usr/bin/env npx tsx
/**
 * Converts Google Maps saved places (GeoJSON from Takeout) to Sanity NDJSON format.
 * 
 * Usage:
 *   npx tsx scripts/convert-google-places.ts input.geojson output.ndjson
 * 
 * Or with Node:
 *   npx tsx scripts/convert-google-places.ts input.geojson output.ndjson
 */

import * as fs from 'fs';
import * as path from 'path';

// Google Takeout GeoJSON types
interface GoogleFeature {
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

interface GoogleGeoJSON {
  type: 'FeatureCollection';
  features: GoogleFeature[];
}

// Sanity Place document types
interface SanityPlace {
  _id: string;
  _type: 'place';
  name: string;
  slug: { _type: 'slug'; current: string };
  domains: string[];
  categories: Array<{ value: string; label: string }>;
  location: {
    _type: 'geolocation';
    geopoint: {
      _type: 'geopoint';
      lat: number;
      lng: number;
    };
    address: {
      formattedAddress?: string;
      country?: string;
      countryCode?: string;
    };
  };
  socialLinks: {
    googleMaps?: string;
  };
  externalIds: {
    googlePlaceId?: string;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function extractGooglePlaceId(url?: string): string | undefined {
  if (!url) return undefined;
  
  // Extract CID from Google Maps URL (e.g., https://maps.google.com/?cid=12345)
  const cidMatch = url.match(/cid=(\d+)/);
  if (cidMatch) return cidMatch[1];
  
  // Extract place_id from URL
  const placeIdMatch = url.match(/place_id:([A-Za-z0-9_-]+)/);
  if (placeIdMatch) return placeIdMatch[1];
  
  return undefined;
}

function parseAddress(address?: string): { country?: string } {
  if (!address) return {};
  
  // Simple extraction: last part is usually the country
  const parts = address.split(',').map(p => p.trim());
  const country = parts[parts.length - 1];
  
  return { country };
}

function convertFeatureToPlace(feature: GoogleFeature, domain: string): SanityPlace | null {
  const { properties, geometry } = feature;
  
  const name = properties.Title;
  if (!name) {
    console.warn('Skipping feature without title');
    return null;
  }
  
  const [lng, lat] = geometry.coordinates;
  const geoCoords = properties.Location?.['Geo Coordinates'];
  
  // Use explicit coords if available, fall back to geometry
  const latitude = geoCoords?.Latitude ?? lat;
  const longitude = geoCoords?.Longitude ?? lng;
  
  const slug = slugify(name);
  const googleMapsUrl = properties['Google Maps URL'];
  const googlePlaceId = extractGooglePlaceId(googleMapsUrl);
  const formattedAddress = properties.Location?.Address;
  const countryCode = properties.Location?.['Country Code'];
  const { country } = parseAddress(formattedAddress);
  
  const place: SanityPlace = {
    _id: `place-${slug}`,
    _type: 'place',
    name,
    slug: { _type: 'slug', current: slug },
    domains: [domain],
    categories: [], // Will need manual categorization
    location: {
      _type: 'geolocation',
      geopoint: {
        _type: 'geopoint',
        lat: latitude,
        lng: longitude,
      },
      address: {
        ...(formattedAddress && { formattedAddress }),
        ...(country && { country }),
        ...(countryCode && { countryCode }),
      },
    },
    socialLinks: {
      ...(googleMapsUrl && { googleMaps: googleMapsUrl }),
    },
    externalIds: {
      ...(googlePlaceId && { googlePlaceId }),
    },
  };
  
  return place;
}

function convertGeoJSONToNDJSON(
  inputPath: string, 
  outputPath: string, 
  domain: string = 'coffee'
): void {
  console.log(`Reading GeoJSON from: ${inputPath}`);
  
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const geoJSON: GoogleGeoJSON = JSON.parse(rawData);
  
  if (geoJSON.type !== 'FeatureCollection' || !Array.isArray(geoJSON.features)) {
    throw new Error('Invalid GeoJSON: expected FeatureCollection with features array');
  }
  
  console.log(`Found ${geoJSON.features.length} features`);
  
  const places: SanityPlace[] = [];
  const seenSlugs = new Set<string>();
  
  for (const feature of geoJSON.features) {
    const place = convertFeatureToPlace(feature, domain);
    
    if (place) {
      // Handle duplicate slugs
      let finalSlug = place.slug.current;
      let counter = 1;
      while (seenSlugs.has(finalSlug)) {
        finalSlug = `${place.slug.current}-${counter++}`;
      }
      seenSlugs.add(finalSlug);
      
      place._id = `place-${finalSlug}`;
      place.slug.current = finalSlug;
      
      places.push(place);
    }
  }
  
  console.log(`Converted ${places.length} places`);
  
  // Write NDJSON (one JSON object per line)
  const ndjson = places.map(p => JSON.stringify(p)).join('\n');
  fs.writeFileSync(outputPath, ndjson);
  
  console.log(`Wrote NDJSON to: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Review and edit the NDJSON file to add categories');
  console.log('2. Import to Sanity:');
  console.log(`   cd apps/cms-studio && sanity dataset import ${path.resolve(outputPath)} production --replace`);
}

// CLI
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Google Maps Saved Places → Sanity NDJSON Converter

Usage:
  npx tsx scripts/convert-google-places.ts <input.geojson> <output.ndjson> [domain]

Arguments:
  input.geojson   Path to Google Takeout GeoJSON file
  output.ndjson   Output path for Sanity NDJSON file
  domain          Domain for places: beer, coffee, vino, guide (default: coffee)

Example:
  npx tsx scripts/convert-google-places.ts ~/Downloads/Saved\\ Places.json places.ndjson beer
`);
  process.exit(1);
}

const [inputPath, outputPath, domain = 'coffee'] = args;

if (!['beer', 'coffee', 'vino', 'guide'].includes(domain)) {
  console.error(`Invalid domain: ${domain}. Must be one of: beer, coffee, vino, guide`);
  process.exit(1);
}

try {
  convertGeoJSONToNDJSON(inputPath, outputPath, domain);
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
