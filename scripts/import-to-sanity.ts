#!/usr/bin/env npx tsx
/**
 * Sanity NDJSON Import Script
 * 
 * Imports NDJSON files to Sanity with validation, progress reporting, and error handling.
 * 
 * Usage:
 *   npx tsx scripts/import-to-sanity.ts <ndjson-file> [dataset] [options]
 * 
 * Options:
 *   --replace    Replace existing documents with same _id
 *   --missing    Only import documents that don't exist
 *   --dry-run    Validate without importing
 * 
 * Examples:
 *   npx tsx scripts/import-to-sanity.ts places.ndjson production --replace
 *   npx tsx scripts/import-to-sanity.ts places.ndjson staging --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

interface PlaceDocument {
  _id: string;
  _type: string;
  name?: string;
  slug?: { _type: string; current: string };
  domains?: string[];
  location?: {
    _type: string;
    geopoint?: { _type: string; lat: number; lng: number };
  };
  [key: string]: unknown;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  documentCount: number;
}

const VALID_DOMAINS = ['beer', 'coffee', 'vino', 'guide'];
const VALID_DATASETS = ['production', 'staging', 'development'];

function validateDocument(doc: PlaceDocument, lineNumber: number): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prefix = `Line ${lineNumber}`;

  // Required fields
  if (!doc._id) {
    errors.push(`${prefix}: Missing _id`);
  } else if (!/^[a-zA-Z0-9_-]+$/.test(doc._id)) {
    errors.push(`${prefix}: Invalid _id format "${doc._id}" - only letters, numbers, hyphens, underscores allowed`);
  }

  if (!doc._type) {
    errors.push(`${prefix}: Missing _type`);
  } else if (doc._type !== 'place') {
    errors.push(`${prefix}: Invalid _type "${doc._type}" - must be "place"`);
  }

  if (!doc.name) {
    errors.push(`${prefix}: Missing name`);
  }

  if (!doc.slug?.current) {
    errors.push(`${prefix}: Missing slug.current`);
  }

  if (!doc.domains || !Array.isArray(doc.domains) || doc.domains.length === 0) {
    errors.push(`${prefix}: Missing or empty domains array`);
  } else {
    const invalidDomains = doc.domains.filter(d => !VALID_DOMAINS.includes(d));
    if (invalidDomains.length > 0) {
      errors.push(`${prefix}: Invalid domains: ${invalidDomains.join(', ')} - must be one of: ${VALID_DOMAINS.join(', ')}`);
    }
  }

  if (!doc.location?.geopoint) {
    warnings.push(`${prefix}: Missing location.geopoint`);
  } else {
    const { lat, lng } = doc.location.geopoint;
    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      errors.push(`${prefix}: Invalid latitude ${lat}`);
    }
    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      errors.push(`${prefix}: Invalid longitude ${lng}`);
    }
  }

  return { errors, warnings };
}

function validateNDJSON(filePath: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    documentCount: 0,
  };

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const seenIds = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];

    // Parse JSON
    let doc: PlaceDocument;
    try {
      doc = JSON.parse(line);
    } catch (e) {
      result.errors.push(`Line ${lineNumber}: Invalid JSON - ${e instanceof Error ? e.message : 'parse error'}`);
      result.valid = false;
      continue;
    }

    // Check for duplicate IDs
    if (doc._id) {
      if (seenIds.has(doc._id)) {
        result.errors.push(`Line ${lineNumber}: Duplicate _id "${doc._id}"`);
        result.valid = false;
      }
      seenIds.add(doc._id);
    }

    // Validate document
    const { errors, warnings } = validateDocument(doc, lineNumber);
    result.errors.push(...errors);
    result.warnings.push(...warnings);
    
    if (errors.length > 0) {
      result.valid = false;
    }

    result.documentCount++;
  }

  return result;
}

function runImport(
  filePath: string, 
  dataset: string, 
  options: { replace?: boolean; missing?: boolean }
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const args = ['dataset', 'import', filePath, dataset];
    
    if (options.replace) {
      args.push('--replace');
    } else if (options.missing) {
      args.push('--missing');
    }

    const cmsStudioPath = path.join(__dirname, '..', 'apps', 'cms-studio');
    
    console.log(`\n📦 Running: sanity ${args.join(' ')}`);
    console.log(`   Working directory: ${cmsStudioPath}\n`);

    const child = spawn('npx', ['sanity', ...args], {
      cwd: cmsStudioPath,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';

    child.stdout?.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    child.stderr?.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        output: output + errorOutput,
      });
    });

    child.on('error', (err) => {
      resolve({
        success: false,
        output: `Failed to start process: ${err.message}`,
      });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  const filePath = args.find(a => !a.startsWith('--') && !VALID_DATASETS.includes(a));
  const dataset = args.find(a => VALID_DATASETS.includes(a)) || 'production';
  const replace = args.includes('--replace');
  const missing = args.includes('--missing');
  const dryRun = args.includes('--dry-run');

  // Help
  if (!filePath || args.includes('--help') || args.includes('-h')) {
    console.log(`
Sanity NDJSON Import Script

Usage:
  npx tsx scripts/import-to-sanity.ts <ndjson-file> [dataset] [options]

Arguments:
  ndjson-file    Path to NDJSON file to import
  dataset        Target dataset: production, staging, development (default: production)

Options:
  --replace      Replace existing documents with same _id
  --missing      Only import documents that don't exist  
  --dry-run      Validate without importing
  --help, -h     Show this help message

Examples:
  npx tsx scripts/import-to-sanity.ts places.ndjson production --replace
  npx tsx scripts/import-to-sanity.ts places.ndjson staging --dry-run
  npx tsx scripts/import-to-sanity.ts places.ndjson --missing
`);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  // Check file exists
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   Sanity NDJSON Import                         ║
╚════════════════════════════════════════════════════════════════╝

📄 File:    ${absolutePath}
📁 Dataset: ${dataset}
🔄 Mode:    ${replace ? 'Replace existing' : missing ? 'Skip existing' : 'Fail on existing'}
${dryRun ? '🧪 DRY RUN - No changes will be made\n' : ''}
`);

  // Validate
  console.log('🔍 Validating NDJSON file...\n');
  const validation = validateNDJSON(absolutePath);

  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    validation.warnings.slice(0, 10).forEach(w => console.log(`   ${w}`));
    if (validation.warnings.length > 10) {
      console.log(`   ... and ${validation.warnings.length - 10} more warnings\n`);
    } else {
      console.log('');
    }
  }

  if (validation.errors.length > 0) {
    console.log('❌ Errors:');
    validation.errors.slice(0, 20).forEach(e => console.log(`   ${e}`));
    if (validation.errors.length > 20) {
      console.log(`   ... and ${validation.errors.length - 20} more errors\n`);
    }
    console.log(`\n❌ Validation failed. Fix errors and try again.`);
    process.exit(1);
  }

  console.log(`✅ Validation passed: ${validation.documentCount} documents\n`);

  // Dry run exit
  if (dryRun) {
    console.log('🧪 Dry run complete. No changes were made.');
    process.exit(0);
  }

  // Confirm
  console.log(`Ready to import ${validation.documentCount} documents to "${dataset}" dataset.`);
  
  // Run import
  const result = await runImport(absolutePath, dataset, { replace, missing });

  if (result.success) {
    console.log(`\n✅ Import completed successfully!`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Open Sanity Studio: cd apps/cms-studio && npm run dev`);
    console.log(`   2. Verify imported documents in the Places section`);
  } else {
    console.log(`\n❌ Import failed. Check the output above for details.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
