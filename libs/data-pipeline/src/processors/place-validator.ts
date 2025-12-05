import type { SanityPlace } from './sanity-place-normalizer';

/**
 * Validation result for a single place
 */
export interface PlaceValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Batch validation result
 */
export interface BatchValidation {
  valid: boolean;
  validCount: number;
  invalidCount: number;
  results: Array<{
    place: SanityPlace;
    validation: PlaceValidation;
  }>;
}

/**
 * Valid domain values
 */
const VALID_DOMAINS = ['beer', 'coffee', 'vino', 'guide'];

/**
 * Valid category values
 */
const VALID_CATEGORIES = [
  'brewery', 'beer-garden', 'pub', 'taproom',
  'cafe', 'roaster', 'bakery',
  'restaurant', 'bistro', 'bar',
  'winery', 'wine-bar',
];

/**
 * Validate a single place document
 */
export function validatePlace(place: SanityPlace): PlaceValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required: _type
  if (!place._type || place._type !== 'place') {
    errors.push('Invalid or missing _type (must be "place")');
  }
  
  // Required: name
  if (!place.name || typeof place.name !== 'string' || place.name.trim().length === 0) {
    errors.push('Missing or empty name');
  } else if (place.name.length > 200) {
    warnings.push('Name is unusually long (>200 characters)');
  }
  
  // Required: slug
  if (!place.slug?.current) {
    errors.push('Missing slug.current');
  } else {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(place.slug.current)) {
      errors.push('Invalid slug format (only lowercase letters, numbers, and hyphens allowed)');
    }
    if (place.slug.current.length > 100) {
      errors.push('Slug too long (max 100 characters)');
    }
  }
  
  // Required: domains
  if (!place.domains || !Array.isArray(place.domains) || place.domains.length === 0) {
    errors.push('Missing or empty domains array');
  } else {
    const invalidDomains = place.domains.filter(d => !VALID_DOMAINS.includes(d));
    if (invalidDomains.length > 0) {
      errors.push(`Invalid domains: ${invalidDomains.join(', ')}. Valid: ${VALID_DOMAINS.join(', ')}`);
    }
  }
  
  // Optional but important: location
  if (!place.location?.geopoint) {
    warnings.push('Missing location.geopoint (place will not appear on map)');
  } else {
    const { lat, lng } = place.location.geopoint;
    
    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      errors.push(`Invalid latitude: ${lat} (must be between -90 and 90)`);
    }
    
    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      errors.push(`Invalid longitude: ${lng} (must be between -180 and 180)`);
    }
    
    // Check for null island (common error)
    if (lat === 0 && lng === 0) {
      warnings.push('Coordinates are [0, 0] (null island) - likely missing data');
    }
  }
  
  // Optional: categories
  if (place.categories && Array.isArray(place.categories)) {
    const invalidCategories = place.categories
      .map(c => c.value)
      .filter(v => !VALID_CATEGORIES.includes(v));
    
    if (invalidCategories.length > 0) {
      warnings.push(`Unknown categories: ${invalidCategories.join(', ')}`);
    }
  }
  
  // Optional: website URL validation
  if (place.website) {
    try {
      new URL(place.website);
    } catch {
      warnings.push(`Invalid website URL: ${place.website}`);
    }
  }
  
  // Optional: phone format (basic check)
  if (place.phone && !/^[+\d\s()-]+$/.test(place.phone)) {
    warnings.push(`Phone number may have invalid format: ${place.phone}`);
  }
  
  // Optional: price level
  if (place.price && !['low', 'average', 'high', 'very-high'].includes(place.price)) {
    warnings.push(`Unknown price level: ${place.price}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate multiple places
 */
export function validatePlaces(places: SanityPlace[]): BatchValidation {
  const results = places.map(place => ({
    place,
    validation: validatePlace(place),
  }));
  
  const validCount = results.filter(r => r.validation.valid).length;
  
  return {
    valid: validCount === places.length,
    validCount,
    invalidCount: places.length - validCount,
    results,
  };
}

/**
 * Validate NDJSON content (without parsing to objects)
 */
export function validateNDJSONContent(content: string): {
  valid: boolean;
  lineErrors: Array<{ line: number; error: string }>;
  documentCount: number;
} {
  const lines = content.split('\n').filter(line => line.trim());
  const lineErrors: Array<{ line: number; error: string }> = [];
  const seenIds = new Set<string>();
  
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];
    
    if (!line) continue;
    
    try {
      const doc = JSON.parse(line);
      
      // Check for duplicate _id
      if (doc._id) {
        if (seenIds.has(doc._id)) {
          lineErrors.push({ line: lineNumber, error: `Duplicate _id: ${doc._id}` });
        }
        seenIds.add(doc._id);
      }
      
      // Run place validation
      const validation = validatePlace(doc);
      for (const error of validation.errors) {
        lineErrors.push({ line: lineNumber, error });
      }
    } catch (e) {
      lineErrors.push({
        line: lineNumber,
        error: `Invalid JSON: ${e instanceof Error ? e.message : 'parse error'}`,
      });
    }
  }
  
  return {
    valid: lineErrors.length === 0,
    lineErrors,
    documentCount: lines.length,
  };
}
