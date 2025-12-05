/**
 * Raw scraped place data before normalization
 */
export interface ScrapedPlace {
  /** Place name */
  name: string;
  
  /** Full address */
  address?: string;
  
  /** City name */
  city?: string;
  
  /** Region/State */
  region?: string;
  
  /** Country */
  country?: string;
  
  /** Country code (ISO 3166-1 alpha-2) */
  countryCode?: string;
  
  /** Postal/ZIP code */
  postalCode?: string;
  
  /** Latitude */
  latitude?: number;
  
  /** Longitude */
  longitude?: number;
  
  /** Rating (0-5) */
  rating?: number;
  
  /** Number of reviews */
  reviewCount?: number;
  
  /** Price level (1-4 or string like '$$$') */
  priceLevel?: number | string;
  
  /** Category/type of place */
  categories?: string[];
  
  /** Phone number */
  phone?: string;
  
  /** Website URL */
  website?: string;
  
  /** Opening hours */
  openingHours?: OpeningHours[];
  
  /** Photo URLs */
  photos?: string[];
  
  /** Source-specific place ID */
  sourceId?: string;
  
  /** URL on the source website */
  sourceUrl?: string;
  
  /** Source name (google-maps, tripadvisor, etc.) */
  source: string;
  
  /** Timestamp when scraped */
  scrapedAt: Date;
  
  /** Additional source-specific data */
  rawData?: Record<string, unknown>;
}

export interface OpeningHours {
  /** Day of week (monday, tuesday, etc.) */
  day: string;
  
  /** Opening time (HH:MM format) */
  open?: string;
  
  /** Closing time (HH:MM format) */
  close?: string;
  
  /** Whether closed on this day */
  closed?: boolean;
  
  /** Raw text if structured parsing failed */
  rawText?: string;
}

/**
 * Scraped review data
 */
export interface ScrapedReview {
  /** Reviewer name */
  authorName?: string;
  
  /** Review text */
  text?: string;
  
  /** Rating given (1-5) */
  rating?: number;
  
  /** Review date */
  date?: Date;
  
  /** Language of review */
  language?: string;
  
  /** Source of review */
  source: string;
}

/**
 * Aggregated scrape results
 */
export interface ScrapeResult {
  /** Scraped places */
  places: ScrapedPlace[];
  
  /** Total places found (may be more than scraped) */
  totalFound?: number;
  
  /** Search query used */
  query?: string;
  
  /** Location searched */
  location?: string;
  
  /** Source of data */
  source: string;
  
  /** Scrape timestamp */
  scrapedAt: Date;
  
  /** Duration in milliseconds */
  duration: number;
  
  /** Any errors encountered */
  errors?: string[];
}
