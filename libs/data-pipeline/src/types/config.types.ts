/**
 * Configuration for a scraper source (Google Maps, TripAdvisor, etc.)
 */
export interface ScraperConfig {
  /** Unique identifier for this scraper */
  name: string;
  
  /** Base URL for the source */
  baseUrl: string;
  
  /** CSS selectors for extracting data */
  selectors: ScraperSelectors;
  
  /** Rate limiting configuration */
  rateLimit: RateLimitConfig;
  
  /** Navigation and waiting configuration */
  navigation: NavigationConfig;
  
  /** Custom headers to send with requests */
  headers?: Record<string, string>;
  
  /** User agent string override */
  userAgent?: string;
}

export interface ScraperSelectors {
  /** Selector for search results container */
  resultsContainer?: string;
  
  /** Selector for individual result items */
  resultItem?: string;
  
  /** Selector for place name */
  name?: string;
  
  /** Selector for address */
  address?: string;
  
  /** Selector for rating */
  rating?: string;
  
  /** Selector for review count */
  reviewCount?: string;
  
  /** Selector for price level */
  priceLevel?: string;
  
  /** Selector for category/type */
  category?: string;
  
  /** Selector for phone number */
  phone?: string;
  
  /** Selector for website URL */
  website?: string;
  
  /** Selector for opening hours */
  openingHours?: string;
  
  /** Selector for photos */
  photos?: string;
  
  /** Selector for "load more" or next page button */
  loadMore?: string;
  
  /** Custom selectors specific to the source */
  custom?: Record<string, string>;
}

export interface RateLimitConfig {
  /** Minimum delay between requests in ms */
  minDelay: number;
  
  /** Maximum delay between requests in ms (randomized) */
  maxDelay: number;
  
  /** Delay between scrolls in ms */
  scrollDelay: number;
  
  /** Maximum requests per minute (0 = unlimited) */
  maxRequestsPerMinute?: number;
}

export interface NavigationConfig {
  /** Timeout for page load in ms */
  timeout: number;
  
  /** Wait until condition */
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  
  /** Additional wait time after page load in ms */
  additionalWait?: number;
  
  /** Number of scrolls to load more content */
  scrollCount?: number;
  
  /** Viewport dimensions */
  viewport?: {
    width: number;
    height: number;
  };
}

/**
 * Factory function type for creating scraper configs
 */
export type ScraperConfigFactory = (_overrides?: Partial<ScraperConfig>) => ScraperConfig;
