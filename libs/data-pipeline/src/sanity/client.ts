import { createClient, type SanityClient } from '@sanity/client';

/**
 * Sanity client configuration
 * 
 * Requires environment variables:
 *   - SANITY_PROJECT_ID: Your Sanity project ID
 *   - SANITY_DATASET: Dataset name (production, staging, development)
 *   - SANITY_WRITE_TOKEN: API token with write permissions
 */

export interface SanityConfig {
  projectId?: string;
  dataset?: string;
  token?: string;
  apiVersion?: string;
  useCdn?: boolean;
}

const DEFAULT_CONFIG: SanityConfig = {
  projectId: process.env['SANITY_PROJECT_ID'] || process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'] || process.env['SANITY_STUDIO_PROJECT_ID'],
  dataset: process.env['SANITY_DATASET'] || process.env['SANITY_STUDIO_DATASET'] || 'production',
  token: process.env['SANITY_WRITE_TOKEN'],
  apiVersion: '2024-01-01',
  useCdn: false,
};

let clientInstance: SanityClient | null = null;

/**
 * Get or create Sanity client instance
 */
export function getSanityClient(config?: Partial<SanityConfig>): SanityClient {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  if (!mergedConfig.projectId) {
    throw new Error(
      'SANITY_PROJECT_ID environment variable is required.\n' +
      'Set it in your environment or .env file.'
    );
  }
  
  if (!clientInstance || config) {
    clientInstance = createClient({
      projectId: mergedConfig.projectId,
      dataset: mergedConfig.dataset || 'production',
      token: mergedConfig.token,
      apiVersion: mergedConfig.apiVersion || '2024-01-01',
      useCdn: mergedConfig.useCdn ?? false,
    });
  }
  
  return clientInstance;
}

/**
 * Validate Sanity configuration
 */
export function validateSanityConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env['SANITY_PROJECT_ID'] && !process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'] && !process.env['SANITY_STUDIO_PROJECT_ID']) {
    errors.push('Missing SANITY_PROJECT_ID environment variable');
  }
  
  if (!process.env['SANITY_WRITE_TOKEN']) {
    errors.push('Missing SANITY_WRITE_TOKEN environment variable (required for imports)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
