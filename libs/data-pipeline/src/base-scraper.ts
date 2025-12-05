import type { Page } from 'puppeteer';
import type { ScraperConfig } from './types/config.types';
import type { ScrapedPlace, ScrapeResult } from './types/scraped-place.types';
import type { ClusterManager } from './cluster/cluster-manager';

/**
 * Options for running a scrape operation
 */
export interface ScrapeOptions {
  /** Search query */
  query?: string;
  
  /** Location context */
  location?: string;
  
  /** URL to scrape (for detail pages) */
  url?: string;
  
  /** Maximum number of results */
  maxResults?: number;
  
  /** Domain filter */
  domain?: string;
  
  /** Whether to enable monitoring output */
  monitor?: boolean;
  
  /** Callback for progress updates */
  onProgress?: (_progress: ScrapeProgress) => void;
}

export interface ScrapeProgress {
  /** Current item index */
  current: number;
  
  /** Total items (if known) */
  total?: number;
  
  /** Current place being scraped */
  currentPlace?: string;
  
  /** Status message */
  message?: string;
}

/**
 * Abstract base class for all scrapers.
 * Extend this class to create scrapers for new sources.
 */
export abstract class BaseScraper {
  /** The scraper configuration */
  protected readonly config: ScraperConfig;
  
  /** Reference to the cluster manager */
  protected readonly cluster: ClusterManager;
  
  constructor(cluster: ClusterManager, config: ScraperConfig) {
    this.cluster = cluster;
    this.config = config;
  }
  
  /**
   * Get the scraper name
   */
  get name(): string {
    return this.config.name;
  }
  
  /**
   * Main scrape method - must be implemented by subclasses
   */
  abstract scrape(_options: ScrapeOptions): Promise<ScrapeResult>;
  
  /**
   * Scrape a single place detail page
   */
  abstract scrapeDetail(_url: string): Promise<ScrapedPlace | null>;
  
  /**
   * Build search URL from query and location
   */
  abstract buildSearchUrl(_query: string, _location?: string): string;
  
  /**
   * Extract places from search results page
   */
  protected abstract extractPlacesFromPage(_page: Page): Promise<ScrapedPlace[]>;
  
  /**
   * Extract place details from detail page
   */
  protected abstract extractPlaceDetails(_page: Page): Promise<ScrapedPlace | null>;
  
  /**
   * Scroll page to load more results
   */
  protected async scrollToLoadMore(page: Page, scrollCount?: number): Promise<void> {
    const count = scrollCount ?? this.config.navigation.scrollCount ?? 3;
    const delay = this.config.rateLimit.scrollDelay;
    
    for (let i = 0; i < count; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await this.sleep(delay);
    }
  }
  
  /**
   * Wait for random delay between min and max
   */
  protected async randomDelay(): Promise<void> {
    const { minDelay, maxDelay } = this.config.rateLimit;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await this.sleep(delay);
  }
  
  /**
   * Sleep for specified milliseconds
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Safe text extraction from element
   */
  protected async safeGetText(page: Page, selector: string): Promise<string | undefined> {
    try {
      const element = await page.$(selector);
      if (!element) return undefined;
      
      const text = await page.evaluate((el: Element | null) => el?.textContent?.trim(), element);
      return text || undefined;
    } catch {
      return undefined;
    }
  }
  
  /**
   * Safe attribute extraction from element
   */
  protected async safeGetAttribute(
    page: Page, 
    selector: string, 
    attribute: string
  ): Promise<string | undefined> {
    try {
      const element = await page.$(selector);
      if (!element) return undefined;
      
      const value = await page.evaluate(
        (el: Element | null, attr: string) => el?.getAttribute(attr),
        element,
        attribute
      );
      return value || undefined;
    } catch {
      return undefined;
    }
  }
  
  /**
   * Parse rating string to number
   */
  protected parseRating(ratingStr?: string): number | undefined {
    if (!ratingStr) return undefined;
    
    const match = ratingStr.match(/[\d.]+/);
    if (!match) return undefined;
    
    const rating = parseFloat(match[0]);
    return isNaN(rating) ? undefined : rating;
  }
  
  /**
   * Parse review count string to number
   */
  protected parseReviewCount(countStr?: string): number | undefined {
    if (!countStr) return undefined;
    
    // Handle formats like "1,234 reviews", "(123)", "1.2K", etc.
    const cleaned = countStr.replace(/[(),reviews\s]/gi, '');
    
    let multiplier = 1;
    if (cleaned.toLowerCase().includes('k')) {
      multiplier = 1000;
    } else if (cleaned.toLowerCase().includes('m')) {
      multiplier = 1000000;
    }
    
    const match = cleaned.match(/[\d.]+/);
    if (!match) return undefined;
    
    const count = parseFloat(match[0]) * multiplier;
    return isNaN(count) ? undefined : Math.round(count);
  }
  
  /**
   * Log message with scraper context
   */
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const prefix = `[${this.name}]`;
    switch (level) {
      case 'warn':
        console.warn(`${prefix} ${message}`);
        break;
      case 'error':
        console.error(`${prefix} ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }
}
