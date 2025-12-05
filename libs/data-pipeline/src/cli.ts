#!/usr/bin/env npx tsx
/**
 * Hospitality Sites Data CLI
 * 
 * A unified command-line interface for:
 * - Web scraping
 * - Google Places API search
 * - Data conversion (Google Takeout → Sanity)
 * - Data enrichment (Google Places API)
 * - Data import (to Sanity CMS)
 * 
 * Usage:
 *   yarn nx run data-pipeline:cli -- <command> [options]
 * 
 * Commands:
 *   batch                 Run multiple scrape jobs from config
 *   search                Search Google Places API
 *   convert               Convert Google Takeout GeoJSON to NDJSON
 *   enrich                Enrich places with Google Places API data
 *   validate              Validate NDJSON data
 *   import                Import NDJSON to Sanity CMS
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

// Scraper CLI commands
import { registerScraperCommands } from './scrapers';

// Processors
import { 
  convertGoogleTakeoutFile, 
  writePlacesToNDJSON,
  readPlacesFromNDJSON,
} from './processors/google-takeout-converter';
import { enrichPlaces } from './processors/google-places-enricher';
import { searchPlaces } from './processors/google-places-search';
import { validateNDJSONContent, validatePlaces } from './processors/place-validator';
import { deduplicatePlaces, deduplicateWithinList } from './processors/place-deduplicator';
import { uploadPlaces, validateSanityConfig } from './sanity';

const program = new Command();

program
  .name('data-cli')
  .description('Hospitality Sites Data CLI - scrape, search, convert, enrich, and import venue data')
  .version('1.0.0');

// ============================================================================
// REGISTER SCRAPER COMMANDS
// ============================================================================

registerScraperCommands(program);

// ============================================================================
// SEARCH COMMAND - Google Places API Search
// ============================================================================

program
  .command('search')
  .description('Search Google Places API and export to NDJSON')
  .option('-q, --query <query>', 'Search query (e.g., "specialty coffee Prague")')
  .option('-l, --location <lat,lng>', 'Center point as "lat,lng" (e.g., "50.0755,14.4378")')
  .option('-r, --radius <meters>', 'Search radius in meters (default: 5000)', '5000')
  .option('-t, --type <type>', 'Google place type (e.g., cafe, bar, restaurant)')
  .requiredOption('-o, --output <path>', 'Output NDJSON file path')
  .requiredOption('-d, --domain <domain>', 'Domain: beer, coffee, vino, guide')
  .option('-m, --max <number>', 'Maximum results (default: 60)', '60')
  .option('--rate-limit <ms>', 'Delay between API calls in ms', '200')
  .action(async (options: {
    query?: string;
    location?: string;
    radius?: string;
    type?: string;
    output: string;
    domain: string;
    max?: string;
    rateLimit?: string;
  }) => {
    if (!options.query && !options.location) {
      console.error('❌ Either --query or --location is required');
      process.exit(1);
    }
    
    const validDomains = ['beer', 'coffee', 'vino', 'guide'];
    if (!validDomains.includes(options.domain)) {
      console.error(`❌ Invalid domain. Must be one of: ${validDomains.join(', ')}`);
      process.exit(1);
    }
    
    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    if (!apiKey) {
      console.error('❌ GOOGLE_PLACES_API_KEY environment variable is required');
      console.log('   Set it with: GOOGLE_PLACES_API_KEY=your-key yarn nx run data-pipeline:cli -- search ...');
      process.exit(1);
    }
    
    console.log('🔍 Searching Google Places API...\n');
    
    // Parse location if provided
    let location: { lat: number; lng: number } | undefined;
    if (options.location) {
      const parts = options.location.split(',').map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) {
        console.error('❌ Invalid location format. Use "lat,lng" (e.g., "50.0755,14.4378")');
        process.exit(1);
      }
      location = { lat: parts[0] as number, lng: parts[1] as number };
    }
    
    try {
      const result = await searchPlaces({
        apiKey,
        query: options.query,
        location,
        radius: options.radius ? parseInt(options.radius, 10) : 5000,
        type: options.type,
        domain: options.domain,
        maxResults: options.max ? parseInt(options.max, 10) : 60,
        rateLimitMs: options.rateLimit ? parseInt(options.rateLimit, 10) : 200,
        onProgress: (current, total, name) => {
          process.stdout.write(`\r   Fetching: ${current}/${total} - ${name.slice(0, 40).padEnd(40)}`);
        },
      });
      
      // Ensure output directory exists
      const dir = path.dirname(options.output);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      writePlacesToNDJSON(result.places, options.output);
      
      console.log('\n\n✅ Search complete:');
      console.log(`   Found: ${result.total} places`);
      console.log(`   Converted: ${result.places.length}`);
      console.log(`   Output: ${options.output}`);
      
      if (result.errors.length > 0) {
        console.log(`\n⚠️  Errors (${result.errors.length}):`);
        result.errors.slice(0, 10).forEach(({ placeId, error }) => 
          console.log(`   - ${placeId}: ${error}`)
        );
      }
      
      console.log(`\nNext steps:`);
      console.log(`   yarn nx run data-pipeline:cli -- validate ${options.output}`);
      console.log(`   yarn nx run data-pipeline:cli -- import ${options.output}`);
      
    } catch (error) {
      console.error('\n❌ Search error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// CONVERT COMMAND - Google Takeout to NDJSON
// ============================================================================

program
  .command('convert')
  .description('Convert Google Takeout GeoJSON to Sanity NDJSON format')
  .argument('<input>', 'Input GeoJSON file path')
  .argument('<output>', 'Output NDJSON file path')
  .option('-d, --domain <domain>', 'Domain to assign (beer, coffee, vino, guide)')
  .option('-c, --category <category>', 'Default category (brewery, cafe, etc.)')
  .option('--require-coords', 'Skip places without valid coordinates')
  .action(async (input: string, output: string, options: { domain?: string; category?: string; requireCoords?: boolean }) => {
    console.log('📄 Converting Google Takeout GeoJSON...\n');
    
    if (!fs.existsSync(input)) {
      console.error(`❌ Input file not found: ${input}`);
      process.exit(1);
    }
    
    try {
      const result = convertGoogleTakeoutFile(input, {
        domain: options.domain,
        defaultCategory: options.category,
        requireCoordinates: options.requireCoords,
      });
      
      // Ensure output directory exists
      const dir = path.dirname(output);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      writePlacesToNDJSON(result.places, output);
      
      console.log('✅ Conversion complete:');
      console.log(`   Places converted: ${result.places.length}`);
      console.log(`   Skipped: ${result.skipped}`);
      console.log(`   Output: ${output}`);
      
      if (result.errors.length > 0) {
        console.log(`\n⚠️  Warnings (${result.errors.length}):`);
        result.errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
        if (result.errors.length > 10) {
          console.log(`   ... and ${result.errors.length - 10} more`);
        }
      }
    } catch (error) {
      console.error('❌ Conversion error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// ENRICH COMMAND - Add Google Places API data
// ============================================================================

program
  .command('enrich')
  .description('Enrich places with Google Places API data')
  .argument('<input>', 'Input NDJSON file path')
  .argument('<output>', 'Output NDJSON file path')
  .option('--rate-limit <ms>', 'Delay between API calls in ms', '100')
  .action(async (input: string, output: string, options: { rateLimit?: string }) => {
    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    
    if (!apiKey) {
      console.error('❌ GOOGLE_PLACES_API_KEY environment variable is required');
      console.log('   Set it with: GOOGLE_PLACES_API_KEY=your-key yarn nx run data-pipeline:cli -- enrich ...');
      process.exit(1);
    }
    
    console.log('🔍 Enriching places with Google Places API...\n');
    
    if (!fs.existsSync(input)) {
      console.error(`❌ Input file not found: ${input}`);
      process.exit(1);
    }
    
    try {
      const places = readPlacesFromNDJSON(input);
      console.log(`   Loaded ${places.length} places\n`);
      
      const result = await enrichPlaces(places, {
        apiKey,
        rateLimitMs: options.rateLimit ? parseInt(options.rateLimit, 10) : 100,
        onProgress: (current, total, name) => {
          process.stdout.write(`\r   Processing: ${current}/${total} - ${name.slice(0, 40).padEnd(40)}`);
        },
      });
      
      // Ensure output directory exists
      const dir = path.dirname(output);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      writePlacesToNDJSON(result.places, output);
      
      console.log('\n\n✅ Enrichment complete:');
      console.log(`   Total: ${places.length}`);
      console.log(`   Enriched: ${result.enriched}`);
      console.log(`   Skipped: ${result.skipped}`);
      console.log(`   Output: ${output}`);
      
      if (result.errors.length > 0) {
        console.log(`\n⚠️  Errors (${result.errors.length}):`);
        result.errors.slice(0, 10).forEach(({ place, error }) => 
          console.log(`   - ${place}: ${error}`)
        );
      }
    } catch (error) {
      console.error('\n❌ Enrichment error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// VALIDATE COMMAND - Validate NDJSON data
// ============================================================================

program
  .command('validate')
  .description('Validate NDJSON file for Sanity import')
  .argument('<input>', 'Input NDJSON file path')
  .option('--strict', 'Fail on warnings too')
  .action(async (input: string, options: { strict?: boolean }) => {
    console.log('🔍 Validating NDJSON file...\n');
    
    if (!fs.existsSync(input)) {
      console.error(`❌ Input file not found: ${input}`);
      process.exit(1);
    }
    
    try {
      const content = fs.readFileSync(input, 'utf-8');
      const jsonValidation = validateNDJSONContent(content);
      
      console.log(`   Documents: ${jsonValidation.documentCount}`);
      
      if (jsonValidation.valid) {
        // Run full validation
        const places = readPlacesFromNDJSON(input);
        const placeValidation = validatePlaces(places);
        
        // Check for internal duplicates
        const dedup = deduplicateWithinList(places);
        
        console.log(`   Valid: ${placeValidation.validCount}`);
        console.log(`   Invalid: ${placeValidation.invalidCount}`);
        console.log(`   Internal duplicates: ${dedup.duplicates.length}`);
        
        // Count warnings
        const warnings = placeValidation.results.flatMap(r => r.validation.warnings);
        if (warnings.length > 0) {
          console.log(`\n⚠️  Warnings (${warnings.length}):`);
          warnings.slice(0, 10).forEach(w => console.log(`   - ${w}`));
          if (warnings.length > 10) {
            console.log(`   ... and ${warnings.length - 10} more`);
          }
        }
        
        // Show duplicate details
        if (dedup.duplicates.length > 0) {
          console.log(`\n📋 Duplicate entries:`);
          dedup.duplicates.slice(0, 5).forEach(d => 
            console.log(`   - "${d.place.name}" duplicates "${d.existingName}" (${d.distance.toFixed(0)}m apart)`)
          );
        }
        
        if (placeValidation.valid && (!options.strict || warnings.length === 0)) {
          console.log('\n✅ Validation passed!');
        } else {
          console.log('\n❌ Validation failed');
          process.exit(1);
        }
      } else {
        console.log(`\n❌ JSON parsing errors (${jsonValidation.lineErrors.length}):`);
        jsonValidation.lineErrors.slice(0, 10).forEach(({ line, error }) => 
          console.log(`   Line ${line}: ${error}`)
        );
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Validation error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// IMPORT COMMAND - Import to Sanity CMS
// ============================================================================

program
  .command('import')
  .description('Import NDJSON to Sanity CMS')
  .argument('<input>', 'Input NDJSON file path')
  .option('--dataset <name>', 'Sanity dataset (default: production)', 'production')
  .option('--replace', 'Replace existing documents')
  .option('--missing-only', 'Only import documents that do not exist')
  .option('--dry-run', 'Validate and show what would be imported')
  .option('--skip-validation', 'Skip pre-import validation')
  .option('--skip-dedup', 'Skip deduplication check against Sanity')
  .action(async (input: string, options: {
    dataset?: string;
    replace?: boolean;
    missingOnly?: boolean;
    dryRun?: boolean;
    skipValidation?: boolean;
    skipDedup?: boolean;
  }) => {
    console.log('📤 Importing to Sanity CMS...\n');
    
    // Check Sanity config
    if (!options.dryRun) {
      const configCheck = validateSanityConfig();
      if (!configCheck.valid) {
        console.error('❌ Sanity configuration error:');
        configCheck.errors.forEach(e => console.error(`   - ${e}`));
        process.exit(1);
      }
    }
    
    if (!fs.existsSync(input)) {
      console.error(`❌ Input file not found: ${input}`);
      process.exit(1);
    }
    
    try {
      const places = readPlacesFromNDJSON(input);
      console.log(`   Loaded ${places.length} places`);
      console.log(`   Dataset: ${options.dataset}`);
      console.log(`   Mode: ${options.replace ? 'replace' : options.missingOnly ? 'missing-only' : 'create'}`);
      
      // Validate first
      if (!options.skipValidation) {
        console.log('\n   Validating...');
        const validation = validatePlaces(places);
        if (!validation.valid) {
          console.error(`\n❌ Validation failed: ${validation.invalidCount} invalid documents`);
          console.log('   Run `yarn nx run data-pipeline:cli -- validate <file>` for details');
          process.exit(1);
        }
        console.log('   ✓ Validation passed');
      }
      
      // Deduplicate against Sanity
      let placesToImport = places;
      if (!options.skipDedup && !options.dryRun) {
        console.log('   Checking for duplicates...');
        const dedup = await deduplicatePlaces(places, options.dataset);
        
        if (dedup.duplicates.length > 0) {
          console.log(`   ⚠️  Found ${dedup.duplicates.length} potential duplicates:`);
          dedup.duplicates.slice(0, 5).forEach(d => 
            console.log(`      - "${d.place.name}" → existing: ${d.existingId}`)
          );
          
          if (!options.replace) {
            console.log('   Skipping duplicates (use --replace to update them)');
            placesToImport = dedup.unique;
          }
        } else {
          console.log('   ✓ No duplicates found');
        }
      }
      
      if (placesToImport.length === 0) {
        console.log('\n⚠️  No places to import');
        process.exit(0);
      }
      
      // Import
      console.log(`\n   Importing ${placesToImport.length} places...`);
      
      const stats = await uploadPlaces(placesToImport, {
        dataset: options.dataset,
        replace: options.replace,
        missingOnly: options.missingOnly,
        dryRun: options.dryRun,
        onProgress: (current, total, place) => {
          process.stdout.write(`\r   Progress: ${current}/${total} - ${place.name.slice(0, 40).padEnd(40)}`);
        },
      });
      
      console.log('\n\n✅ Import complete:');
      console.log(`   Created: ${stats.created}`);
      console.log(`   Updated: ${stats.updated}`);
      console.log(`   Skipped: ${stats.skipped}`);
      console.log(`   Failed: ${stats.failed}`);
      console.log(`   Duration: ${(stats.duration / 1000).toFixed(1)}s`);
      
      if (stats.errors.length > 0) {
        console.log(`\n❌ Errors (${stats.errors.length}):`);
        stats.errors.slice(0, 10).forEach(({ documentId, error }) => 
          console.log(`   - ${documentId}: ${error}`)
        );
      }
      
      if (options.dryRun) {
        console.log('\n📝 Dry run - no changes were made');
      }
    } catch (error) {
      console.error('\n❌ Import error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// ============================================================================
// Parse and run
// ============================================================================

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
