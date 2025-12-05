import { getSanityClient } from '../sanity/client';
import type { SanityPlace } from './sanity-place-normalizer';

/**
 * Deduplication threshold in meters
 * Places within this distance are considered potential duplicates
 */
const DEFAULT_DISTANCE_THRESHOLD = 50;

/**
 * Deduplication result
 */
export interface DeduplicationResult {
  unique: SanityPlace[];
  duplicates: Array<{
    place: SanityPlace;
    existingId: string;
    existingName: string;
    distance: number;
  }>;
}

/**
 * Calculate Haversine distance between two points in meters
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalize name for comparison (lowercase, remove special chars)
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Check if two names are similar (fuzzy match)
 */
function namesAreSimilar(name1: string, name2: string): boolean {
  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);
  
  // Exact match after normalization
  if (norm1 === norm2) return true;
  
  // One contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  
  // Levenshtein distance for short names
  if (norm1.length < 20 && norm2.length < 20) {
    const maxDist = Math.min(3, Math.floor(Math.min(norm1.length, norm2.length) / 3));
    if (levenshteinDistance(norm1, norm2) <= maxDist) return true;
  }
  
  return false;
}

/**
 * Simple Levenshtein distance implementation
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost
      );
    }
  }
  
  return dp[m]![n]!;
}

/**
 * Find existing place in Sanity by coordinates proximity
 */
export async function findExistingPlace(
  lat: number,
  lng: number,
  name: string,
  dataset?: string,
  thresholdMeters = DEFAULT_DISTANCE_THRESHOLD
): Promise<{ id: string; name: string; distance: number } | null> {
  const client = getSanityClient({ dataset });
  
  // Query places within a bounding box (rough filter)
  // ~0.0005 degrees ≈ 50 meters at equator
  const delta = (thresholdMeters / 111000) * 2; // Convert meters to degrees with margin
  
  const query = `*[
    _type == "place" && 
    defined(location.geopoint) &&
    location.geopoint.lat > $minLat &&
    location.geopoint.lat < $maxLat &&
    location.geopoint.lng > $minLng &&
    location.geopoint.lng < $maxLng
  ] {
    _id,
    name,
    "lat": location.geopoint.lat,
    "lng": location.geopoint.lng
  }`;
  
  const results = await client.fetch<Array<{
    _id: string;
    name: string;
    lat: number;
    lng: number;
  }>>(query, {
    minLat: lat - delta,
    maxLat: lat + delta,
    minLng: lng - delta,
    maxLng: lng + delta,
  });
  
  // Find exact match by distance and name similarity
  for (const result of results) {
    const distance = haversineDistance(lat, lng, result.lat, result.lng);
    
    if (distance <= thresholdMeters && namesAreSimilar(name, result.name)) {
      return {
        id: result._id,
        name: result.name,
        distance,
      };
    }
  }
  
  return null;
}

/**
 * Deduplicate places against Sanity database
 */
export async function deduplicatePlaces(
  places: SanityPlace[],
  dataset?: string,
  thresholdMeters = DEFAULT_DISTANCE_THRESHOLD
): Promise<DeduplicationResult> {
  const result: DeduplicationResult = {
    unique: [],
    duplicates: [],
  };
  
  for (const place of places) {
    const lat = place.location?.geopoint?.lat;
    const lng = place.location?.geopoint?.lng;
    
    // Can't deduplicate without coordinates
    if (!lat || !lng) {
      result.unique.push(place);
      continue;
    }
    
    const existing = await findExistingPlace(lat, lng, place.name, dataset, thresholdMeters);
    
    if (existing) {
      result.duplicates.push({
        place,
        existingId: existing.id,
        existingName: existing.name,
        distance: existing.distance,
      });
    } else {
      result.unique.push(place);
    }
  }
  
  return result;
}

/**
 * Deduplicate within a list of places (find duplicates among themselves)
 */
export function deduplicateWithinList(
  places: SanityPlace[],
  thresholdMeters = DEFAULT_DISTANCE_THRESHOLD
): DeduplicationResult {
  const result: DeduplicationResult = {
    unique: [],
    duplicates: [],
  };
  
  const seen: Array<{ place: SanityPlace; lat: number; lng: number }> = [];
  
  for (const place of places) {
    const lat = place.location?.geopoint?.lat;
    const lng = place.location?.geopoint?.lng;
    
    // Can't deduplicate without coordinates
    if (!lat || !lng) {
      result.unique.push(place);
      continue;
    }
    
    // Check against already seen places
    let isDuplicate = false;
    for (const seenItem of seen) {
      const distance = haversineDistance(lat, lng, seenItem.lat, seenItem.lng);
      
      if (distance <= thresholdMeters && namesAreSimilar(place.name, seenItem.place.name)) {
        result.duplicates.push({
          place,
          existingId: seenItem.place.slug?.current || 'unknown',
          existingName: seenItem.place.name,
          distance,
        });
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      result.unique.push(place);
      seen.push({ place, lat, lng });
    }
  }
  
  return result;
}
