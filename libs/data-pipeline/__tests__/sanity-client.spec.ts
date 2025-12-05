import { validateSanityConfig, getSanityClient } from '../src/sanity/client';

// Save original env
const originalEnv = { ...process.env };

beforeEach(() => {
  // Clear env and reset with fresh copy
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('sanity client', () => {
  describe('validateSanityConfig', () => {
    it('should return valid when all required env vars are set', () => {
      process.env['SANITY_PROJECT_ID'] = 'test-project';
      process.env['SANITY_WRITE_TOKEN'] = 'test-token';

      const result = validateSanityConfig();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid when SANITY_PROJECT_ID is missing', () => {
      delete process.env['SANITY_PROJECT_ID'];
      delete process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'];
      process.env['SANITY_WRITE_TOKEN'] = 'test-token';

      const result = validateSanityConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing SANITY_PROJECT_ID environment variable');
    });

    it('should return invalid when SANITY_WRITE_TOKEN is missing', () => {
      process.env['SANITY_PROJECT_ID'] = 'test-project';
      delete process.env['SANITY_WRITE_TOKEN'];

      const result = validateSanityConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing SANITY_WRITE_TOKEN environment variable (required for imports)');
    });

    it('should return multiple errors when multiple vars are missing', () => {
      delete process.env['SANITY_PROJECT_ID'];
      delete process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'];
      delete process.env['SANITY_WRITE_TOKEN'];

      const result = validateSanityConfig();

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('should accept NEXT_PUBLIC_SANITY_PROJECT_ID as alternative', () => {
      delete process.env['SANITY_PROJECT_ID'];
      process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'] = 'test-project';
      process.env['SANITY_WRITE_TOKEN'] = 'test-token';

      const result = validateSanityConfig();

      expect(result.valid).toBe(true);
    });
  });

  describe('getSanityClient', () => {
    it('should throw error when projectId is missing', () => {
      delete process.env['SANITY_PROJECT_ID'];
      delete process.env['NEXT_PUBLIC_SANITY_PROJECT_ID'];

      expect(() => getSanityClient()).toThrow('SANITY_PROJECT_ID environment variable is required');
    });

    it('should create client with explicit config', () => {
      // Pass projectId explicitly to avoid env dependency
      const client = getSanityClient({
        projectId: 'test-project',
        token: 'test-token',
      });

      expect(client).toBeDefined();
      expect(client.config()).toMatchObject({
        projectId: 'test-project',
        dataset: 'production',
      });
    });

    it('should use custom dataset when provided', () => {
      const client = getSanityClient({
        projectId: 'test-project',
        dataset: 'development',
      });

      expect(client.config().dataset).toBe('development');
    });

    it('should use custom config when provided', () => {
      const client = getSanityClient({
        projectId: 'custom-project',
        dataset: 'staging',
        apiVersion: '2023-01-01',
      });

      expect(client.config()).toMatchObject({
        projectId: 'custom-project',
        dataset: 'staging',
      });
    });
  });
});
