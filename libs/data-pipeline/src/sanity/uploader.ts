import { getSanityClient, validateSanityConfig } from './client';
import type { SanityPlace } from '../processors/sanity-place-normalizer';

/**
 * Result of an upload operation
 */
export interface UploadResult {
  success: boolean;
  documentId?: string;
  action: 'created' | 'updated' | 'skipped' | 'failed';
  error?: string;
}

/**
 * Batch upload statistics
 */
export interface BatchUploadStats {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: Array<{ documentId: string; error: string }>;
  duration: number;
}

/**
 * Upload options
 */
export interface UploadOptions {
  /** Dataset to upload to */
  dataset?: string;
  /** Replace existing documents */
  replace?: boolean;
  /** Only upload documents that don't exist */
  missingOnly?: boolean;
  /** Dry run - validate without uploading */
  dryRun?: boolean;
  /** Progress callback */
  onProgress?: (_current: number, _total: number, _document: SanityPlace) => void;
}

/**
 * Generate a stable document ID from place data
 */
export function generateDocumentId(place: SanityPlace): string {
  // Use slug as primary identifier
  const slug = place.slug?.current || '';
  
  // Add domain prefix for uniqueness
  const domain = place.domains?.[0] || 'place';
  
  // Sanitize for Sanity ID requirements
  const sanitized = `${domain}-${slug}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
  
  return sanitized || `place-${Date.now()}`;
}

/**
 * Check if a document exists in Sanity
 */
export async function documentExists(
  documentId: string,
  dataset?: string
): Promise<boolean> {
  const client = getSanityClient({ dataset });
  
  const result = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0] { _id }`,
    { id: documentId }
  );
  
  return result !== null;
}

/**
 * Upload a single place document to Sanity
 */
export async function uploadPlace(
  place: SanityPlace,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { dataset, replace = false, missingOnly = false, dryRun = false } = options;
  
  // Validate config
  const configValidation = validateSanityConfig();
  if (!configValidation.valid) {
    return {
      success: false,
      action: 'failed',
      error: configValidation.errors.join('; '),
    };
  }
  
  const client = getSanityClient({ dataset });
  const documentId = generateDocumentId(place);
  
  try {
    // Check if document exists
    const exists = await documentExists(documentId, dataset);
    
    if (exists && missingOnly) {
      return {
        success: true,
        documentId,
        action: 'skipped',
      };
    }
    
    if (dryRun) {
      return {
        success: true,
        documentId,
        action: exists ? (replace ? 'updated' : 'skipped') : 'created',
      };
    }
    
    // Prepare document with ID
    const document = {
      ...place,
      _id: documentId,
    };
    
    if (exists && replace) {
      // Update existing document
      await client.createOrReplace(document);
      return {
        success: true,
        documentId,
        action: 'updated',
      };
    } else if (!exists) {
      // Create new document
      await client.create(document);
      return {
        success: true,
        documentId,
        action: 'created',
      };
    } else {
      // Exists but no replace flag
      return {
        success: true,
        documentId,
        action: 'skipped',
      };
    }
  } catch (error) {
    return {
      success: false,
      documentId,
      action: 'failed',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Upload multiple places to Sanity
 */
export async function uploadPlaces(
  places: SanityPlace[],
  options: UploadOptions = {}
): Promise<BatchUploadStats> {
  const startTime = Date.now();
  const stats: BatchUploadStats = {
    total: places.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    duration: 0,
  };
  
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    if (!place) continue;
    
    options.onProgress?.(i + 1, places.length, place);
    
    const result = await uploadPlace(place, options);
    
    switch (result.action) {
      case 'created':
        stats.created++;
        break;
      case 'updated':
        stats.updated++;
        break;
      case 'skipped':
        stats.skipped++;
        break;
      case 'failed':
        stats.failed++;
        if (result.documentId && result.error) {
          stats.errors.push({ documentId: result.documentId, error: result.error });
        }
        break;
    }
  }
  
  stats.duration = Date.now() - startTime;
  return stats;
}

/**
 * Upload a batch of places using Sanity's transaction API (faster for large imports)
 */
export async function uploadPlacesBatch(
  places: SanityPlace[],
  options: UploadOptions = {}
): Promise<BatchUploadStats> {
  const { dataset, replace = false, dryRun = false } = options;
  const startTime = Date.now();
  
  const stats: BatchUploadStats = {
    total: places.length,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    duration: 0,
  };
  
  if (dryRun) {
    // In dry run, just count what would happen
    for (const place of places) {
      const documentId = generateDocumentId(place);
      const exists = await documentExists(documentId, dataset);
      
      if (exists && replace) {
        stats.updated++;
      } else if (!exists) {
        stats.created++;
      } else {
        stats.skipped++;
      }
    }
    stats.duration = Date.now() - startTime;
    return stats;
  }
  
  // Validate config
  const configValidation = validateSanityConfig();
  if (!configValidation.valid) {
    stats.failed = places.length;
    stats.errors = [{ documentId: 'config', error: configValidation.errors.join('; ') }];
    stats.duration = Date.now() - startTime;
    return stats;
  }
  
  const client = getSanityClient({ dataset });
  
  // Create transaction
  let transaction = client.transaction();
  
  for (const place of places) {
    const documentId = generateDocumentId(place);
    const document = { ...place, _id: documentId };
    
    if (replace) {
      transaction = transaction.createOrReplace(document);
      stats.updated++; // We count as update since we're using createOrReplace
    } else {
      transaction = transaction.createIfNotExists(document);
      stats.created++; // Approximate - some may already exist
    }
  }
  
  try {
    await transaction.commit();
  } catch (error) {
    stats.failed = places.length;
    stats.created = 0;
    stats.updated = 0;
    stats.errors.push({
      documentId: 'batch',
      error: error instanceof Error ? error.message : String(error),
    });
  }
  
  stats.duration = Date.now() - startTime;
  return stats;
}
