/**
 * A scrape job configuration
 */
export interface ScrapeJob {
  /** Job type identifier */
  type: 'search' | 'detail' | 'list';
  
  /** The scraper source to use */
  source: string;
  
  /** URL to scrape (for detail/list jobs) */
  url?: string;
  
  /** Search query (for search jobs) */
  query?: string;
  
  /** Location context for search */
  location?: string;
  
  /** Maximum number of results to scrape */
  maxResults?: number;
  
  /** Domain filter (beer, coffee, etc.) */
  domain?: string;
  
  /** Additional metadata to attach to results */
  metadata?: Record<string, unknown>;
}

/**
 * Job queue item with tracking info
 */
export interface QueuedJob extends ScrapeJob {
  /** Unique job ID */
  id: string;
  
  /** Job priority (higher = processed first) */
  priority: number;
  
  /** Number of retry attempts */
  retryCount: number;
  
  /** Timestamp when job was queued */
  queuedAt: Date;
  
  /** Timestamp when job started processing */
  startedAt?: Date;
  
  /** Timestamp when job completed */
  completedAt?: Date;
  
  /** Error message if job failed */
  error?: string;
}

/**
 * Job result with scraped data
 */
export interface JobResult<T = unknown> {
  /** The original job */
  job: ScrapeJob;
  
  /** Whether the job succeeded */
  success: boolean;
  
  /** Scraped data (if successful) */
  data?: T;
  
  /** Error message (if failed) */
  error?: string;
  
  /** Duration in milliseconds */
  duration: number;
  
  /** Number of items scraped */
  itemCount: number;
}

/**
 * Batch of jobs to process
 */
export interface JobBatch {
  /** Batch ID */
  id: string;
  
  /** Jobs in this batch */
  jobs: ScrapeJob[];
  
  /** Output file path */
  outputPath: string;
  
  /** Whether to append to existing file */
  append?: boolean;
}
