import type { ScrapedPlace, OpeningHours } from '../types/scraped-place.types';

/**
 * Sanity-compatible place document structure
 */
export interface SanityPlace {
  _type: 'place';
  name: string;
  slug: {
    _type: 'slug';
    current: string;
  };
  domains?: string[];
  categories?: Array<{ value: string; label: string }>;
  location?: {
    _type: 'geolocation';
    geopoint?: {
      _type: 'geopoint';
      lat: number;
      lng: number;
    };
    address?: string;
  };
  price?: string;
  phone?: string;
  website?: string;
  openingHours?: SanityOpeningHours[];
  gallery?: Array<{ _type: 'image'; url: string }>;
  externalLinks?: Array<{ name: string; url: string }>;
  scrapedData?: {
    source: string;
    sourceId?: string;
    sourceUrl?: string;
    rating?: number;
    reviewCount?: number;
    scrapedAt: string;
  };
}

interface SanityOpeningHours {
  _key: string;
  day: string;
  openTime?: string;
  closeTime?: string;
  closed?: boolean;
}

/**
 * Category mapping from various source types to Sanity categories
 */
const CATEGORY_MAPPING: Record<string, { value: string; label: string }> = {
  // Beer related
  brewery: { value: 'brewery', label: 'Brewery' },
  beer_garden: { value: 'beer-garden', label: 'Beer garden' },
  pub: { value: 'pub', label: 'Pub' },
  bar: { value: 'pub', label: 'Pub' },
  sports_bar: { value: 'pub', label: 'Pub' },
  
  // Coffee related
  cafe: { value: 'cafe', label: 'Cafe' },
  coffee_shop: { value: 'cafe', label: 'Cafe' },
  coffee: { value: 'cafe', label: 'Cafe' },
  roaster: { value: 'roaster', label: 'Roaster' },
  
  // Food
  bakery: { value: 'bakery', label: 'Bakery' },
  restaurant: { value: 'restaurant', label: 'Restaurant' },
  bistro: { value: 'bistro', label: 'Bistro' },
  meal_takeaway: { value: 'bistro', label: 'Bistro' },
};

/**
 * Price level mapping
 */
const PRICE_MAPPING: Record<number | string, string> = {
  0: 'low',
  1: 'low',
  2: 'average',
  3: 'high',
  4: 'very-high',
  '$': 'low',
  '$$': 'average',
  '$$$': 'high',
  '$$$$': 'very-high',
};

/**
 * Day name normalization
 */
const DAY_NORMALIZATION: Record<string, string> = {
  mon: 'monday',
  monday: 'monday',
  tue: 'tuesday',
  tues: 'tuesday',
  tuesday: 'tuesday',
  wed: 'wednesday',
  wednesday: 'wednesday',
  thu: 'thursday',
  thur: 'thursday',
  thurs: 'thursday',
  thursday: 'thursday',
  fri: 'friday',
  friday: 'friday',
  sat: 'saturday',
  saturday: 'saturday',
  sun: 'sunday',
  sunday: 'sunday',
};

/**
 * Options for normalizing scraped data
 */
export interface NormalizerOptions {
  /** Domain to assign (beer, coffee, etc.) */
  domain?: string;
  
  /** Default category if none detected */
  defaultCategory?: string;
  
  /** Whether to include raw scraped data */
  includeRawData?: boolean;
  
  /** Custom slug generator */
  slugGenerator?: (_name: string) => string;
}

/**
 * Normalizer class for converting scraped data to Sanity format
 */
export class DataNormalizer {
  private options: NormalizerOptions;
  
  constructor(options: NormalizerOptions = {}) {
    this.options = options;
  }
  
  /**
   * Normalize a single scraped place to Sanity format
   */
  normalize(place: ScrapedPlace): SanityPlace {
    const slug = this.options.slugGenerator 
      ? this.options.slugGenerator(place.name)
      : this.slugify(place.name);
    
    const sanityPlace: SanityPlace = {
      _type: 'place',
      name: place.name,
      slug: {
        _type: 'slug',
        current: slug,
      },
    };
    
    // Add domain if specified
    if (this.options.domain) {
      sanityPlace.domains = [this.options.domain];
    }
    
    // Normalize categories
    const categories = this.normalizeCategories(place.categories);
    if (categories.length > 0) {
      sanityPlace.categories = categories;
    } else if (this.options.defaultCategory) {
      const defaultCat = CATEGORY_MAPPING[this.options.defaultCategory.toLowerCase()];
      if (defaultCat) {
        sanityPlace.categories = [defaultCat];
      }
    }
    
    // Add location
    if (place.latitude && place.longitude) {
      sanityPlace.location = {
        _type: 'geolocation',
        geopoint: {
          _type: 'geopoint',
          lat: place.latitude,
          lng: place.longitude,
        },
        address: place.address,
      };
    } else if (place.address) {
      sanityPlace.location = {
        _type: 'geolocation',
        address: place.address,
      };
    }
    
    // Add price
    if (place.priceLevel !== undefined) {
      const price = PRICE_MAPPING[place.priceLevel];
      if (price) {
        sanityPlace.price = price;
      }
    }
    
    // Add contact
    if (place.phone) {
      sanityPlace.phone = this.normalizePhone(place.phone);
    }
    
    if (place.website) {
      sanityPlace.website = place.website;
    }
    
    // Add opening hours
    if (place.openingHours && place.openingHours.length > 0) {
      sanityPlace.openingHours = this.normalizeOpeningHours(place.openingHours);
    }
    
    // Add photos as gallery
    if (place.photos && place.photos.length > 0) {
      sanityPlace.gallery = place.photos.map(url => ({
        _type: 'image',
        url,
      }));
    }
    
    // Add external links
    if (place.sourceUrl) {
      sanityPlace.externalLinks = [{
        name: this.formatSourceName(place.source),
        url: place.sourceUrl,
      }];
    }
    
    // Add scraped metadata
    if (this.options.includeRawData) {
      sanityPlace.scrapedData = {
        source: place.source,
        sourceId: place.sourceId,
        sourceUrl: place.sourceUrl,
        rating: place.rating,
        reviewCount: place.reviewCount,
        scrapedAt: place.scrapedAt.toISOString(),
      };
    }
    
    return sanityPlace;
  }
  
  /**
   * Normalize multiple places
   */
  normalizeAll(places: ScrapedPlace[]): SanityPlace[] {
    return places.map(place => this.normalize(place));
  }
  
  /**
   * Convert to NDJSON string
   */
  toNDJSON(places: ScrapedPlace[]): string {
    return this.normalizeAll(places)
      .map(place => JSON.stringify(place))
      .join('\n');
  }
  
  /**
   * Generate slug from name
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
  
  /**
   * Normalize category strings to Sanity format
   */
  private normalizeCategories(categories?: string[]): Array<{ value: string; label: string }> {
    if (!categories) return [];
    
    const normalized: Array<{ value: string; label: string }> = [];
    const seen = new Set<string>();
    
    for (const cat of categories) {
      const key = cat.toLowerCase().replace(/\s+/g, '_');
      const mapping = CATEGORY_MAPPING[key];
      
      if (mapping && !seen.has(mapping.value)) {
        normalized.push(mapping);
        seen.add(mapping.value);
      }
    }
    
    return normalized;
  }
  
  /**
   * Normalize phone number
   */
  private normalizePhone(phone: string): string {
    // Keep only digits, spaces, hyphens, parentheses, and plus sign
    return phone.replace(/[^\d\s\-()+ ]/g, '').trim();
  }
  
  /**
   * Normalize opening hours to Sanity format
   */
  private normalizeOpeningHours(hours: OpeningHours[]): SanityOpeningHours[] {
    return hours.map((h, index) => {
      const dayNorm = DAY_NORMALIZATION[h.day.toLowerCase()] || h.day.toLowerCase();
      
      return {
        _key: `hours_${index}`,
        day: dayNorm,
        openTime: h.open,
        closeTime: h.close,
        closed: h.closed,
      };
    });
  }
  
  /**
   * Format source name for display
   */
  private formatSourceName(source: string): string {
    const names: Record<string, string> = {
      'google-maps': 'Google Maps',
      'tripadvisor': 'TripAdvisor',
    };
    return names[source] || source;
  }
}

/**
 * Convenience function to normalize places
 */
export function normalizePlaces(places: ScrapedPlace[], options?: NormalizerOptions): SanityPlace[] {
  const normalizer = new DataNormalizer(options);
  return normalizer.normalizeAll(places);
}

/**
 * Convenience function to convert places to NDJSON
 */
export function placesToNDJSON(places: ScrapedPlace[], options?: NormalizerOptions): string {
  const normalizer = new DataNormalizer(options);
  return normalizer.toNDJSON(places);
}
