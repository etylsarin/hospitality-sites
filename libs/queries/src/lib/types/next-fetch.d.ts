/**
 * Type augmentation for Next.js extended fetch options.
 * This library is designed to be used within Next.js applications where
 * the global fetch is extended with Next.js-specific caching options.
 */

interface NextFetchRequestInit extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

declare global {
  function fetch(
    input: string | URL | Request,
    init?: NextFetchRequestInit
  ): Promise<Response>;
}

export {};
