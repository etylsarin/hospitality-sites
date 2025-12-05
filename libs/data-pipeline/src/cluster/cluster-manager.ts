import { Cluster } from 'puppeteer-cluster';
import type { Page, PuppeteerLaunchOptions } from 'puppeteer';

/**
 * Cluster manager configuration options
 */
export interface ClusterOptions {
  /** Maximum number of concurrent workers (default: 3) */
  maxConcurrency?: number;
  
  /** Concurrency model: 'page' | 'context' | 'browser' (default: 'context') */
  concurrencyModel?: 'page' | 'context' | 'browser';
  
  /** Task timeout in ms (default: 60000) */
  timeout?: number;
  
  /** Number of retries on failure (default: 2) */
  retryLimit?: number;
  
  /** Delay between retries in ms (default: 1000) */
  retryDelay?: number;
  
  /** Whether to run in headless mode (default: true) */
  headless?: boolean;
  
  /** Whether to show monitoring output (default: false) */
  monitor?: boolean;
  
  /** Delay between same-domain requests in ms (default: 1000) */
  sameDomainDelay?: number;
  
  /** Additional Puppeteer launch options */
  puppeteerOptions?: PuppeteerLaunchOptions;
}

const DEFAULT_OPTIONS: Required<Omit<ClusterOptions, 'puppeteerOptions'>> = {
  maxConcurrency: 3,
  concurrencyModel: 'context',
  timeout: 60000,
  retryLimit: 2,
  retryDelay: 1000,
  headless: true,
  monitor: false,
  sameDomainDelay: 1000,
};

/**
 * Wrapper around puppeteer-cluster for managing browser pool
 */
export class ClusterManager {
  private cluster: Cluster | null = null;
  private readonly options: Required<Omit<ClusterOptions, 'puppeteerOptions'>> & { 
    puppeteerOptions?: PuppeteerLaunchOptions 
  };
  private isInitialized = false;
  
  constructor(options: ClusterOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }
  
  /**
   * Initialize the cluster
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    const concurrencyMap = {
      page: Cluster.CONCURRENCY_PAGE,
      context: Cluster.CONCURRENCY_CONTEXT,
      browser: Cluster.CONCURRENCY_BROWSER,
    };
    
    this.cluster = await Cluster.launch({
      concurrency: concurrencyMap[this.options.concurrencyModel],
      maxConcurrency: this.options.maxConcurrency,
      timeout: this.options.timeout,
      retryLimit: this.options.retryLimit,
      retryDelay: this.options.retryDelay,
      sameDomainDelay: this.options.sameDomainDelay,
      monitor: this.options.monitor,
      puppeteerOptions: {
        headless: this.options.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
        ],
        ...this.options.puppeteerOptions,
      },
    });
    
    this.setupErrorHandling();
    this.isInitialized = true;
    console.log(`[ClusterManager] Initialized with ${this.options.maxConcurrency} workers`);
  }
  
  /**
   * Setup error event handlers
   */
  private setupErrorHandling(): void {
    if (!this.cluster) return;
    
    this.cluster.on('taskerror', (err: Error, _data: unknown, willRetry: boolean) => {
      if (willRetry) {
        console.warn(`[ClusterManager] Task error (will retry): ${err.message}`);
      } else {
        console.error(`[ClusterManager] Task failed: ${err.message}`);
      }
    });
  }
  
  /**
   * Queue a task for execution
   */
  async queue<TData, TResult>(
    data: TData,
    taskFn: (_args: { page: Page; data: TData }) => Promise<TResult>
  ): Promise<void> {
    if (!this.cluster) {
      await this.initialize();
    }
    
    this.cluster!.queue(data, taskFn);
  }
  
  /**
   * Execute a task and wait for the result
   */
  async execute<TData, TResult>(
    data: TData,
    taskFn: (_args: { page: Page; data: TData }) => Promise<TResult>
  ): Promise<TResult> {
    if (!this.cluster) {
      await this.initialize();
    }
    
    return this.cluster!.execute(data, taskFn);
  }
  
  /**
   * Set a default task function for all queued items
   */
  async task<TData, TResult>(
    taskFn: (_args: { page: Page; data: TData }) => Promise<TResult>
  ): Promise<void> {
    if (!this.cluster) {
      await this.initialize();
    }
    
    await this.cluster!.task(taskFn);
  }
  
  /**
   * Wait for all queued tasks to complete
   */
  async idle(): Promise<void> {
    if (!this.cluster) return;
    await this.cluster.idle();
  }
  
  /**
   * Close the cluster and all browsers
   */
  async close(): Promise<void> {
    if (!this.cluster) return;
    
    await this.cluster.idle();
    await this.cluster.close();
    this.cluster = null;
    this.isInitialized = false;
    console.log('[ClusterManager] Cluster closed');
  }
  
  /**
   * Get cluster statistics
   */
  getStats(): { queued: number; completed: number; errors: number } | null {
    // Note: puppeteer-cluster doesn't expose stats directly
    // This would need to be tracked manually if needed
    return null;
  }
  
  /**
   * Check if the cluster is initialized
   */
  get ready(): boolean {
    return this.isInitialized;
  }
}

export { Cluster };
