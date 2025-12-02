import { Geopoint } from '@sanity/google-maps-input';
import { Review } from '../review/review';

// Domain types
export type Domain = 'beer' | 'coffee' | 'vino' | 'guide';

// Price range
export type PriceRange = 'low' | 'average' | 'high' | 'very-high';

// Day of week
export type DayOfWeek =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

// Tag type (used by sanity-plugin-tags)
export interface Tag {
    value: string;
    label: string;
}

// Structured address
export interface StructuredAddress {
    street?: string;
    streetNumber?: string;
    city?: string;
    postalCode?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    formattedAddress?: string;
}

// Enhanced location with structured address
export interface PlaceLocation {
    geopoint: Geopoint;
    address?: StructuredAddress | string; // Support both formats during migration
}

// Time slot for opening hours
export interface TimeSlot {
    open: string; // 24h format, e.g., "08:00"
    close: string; // 24h format, e.g., "22:00"
}

// Day hours configuration
export interface DayHours {
    day: DayOfWeek;
    isClosed?: boolean;
    is24Hours?: boolean;
    slots?: TimeSlot[];
}

// Opening hours structure
export interface OpeningHours {
    regular?: DayHours[];
    timezone?: string;
    notes?: string;
}

// Contact information
export interface ContactInfo {
    phone?: string;
    email?: string;
    bookingUrl?: string;
}

// Social and external links
export interface SocialLinks {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tripadvisor?: string;
    googleMaps?: string;
    yelp?: string;
    untappd?: string;
    europeanCoffeeTrip?: string;
}

// External platform IDs for API integrations
export interface ExternalIds {
    googlePlaceId?: string;
    tripadvisorId?: string;
    foursquareId?: string;
    yelpId?: string;
    untappdVenueId?: string;
}

// Payment options
export type PaymentOption = 'cash' | 'card' | 'qr-code' | 'mobile-payments' | 'crypto';

// Image with URL
export interface PlaceImage {
    url: string;
}

// Main Place type
export interface Place {
    _id: string;
    _type: 'place';
    _createdAt?: string;
    _updatedAt?: string;

    // Basic info
    name: string;
    slug: { current: string };
    domains: Domain[];
    categories?: Tag[];
    location?: PlaceLocation;
    price?: PriceRange;
    established?: string;
    description?: string;

    // Offerings & Services
    serving?: Tag[];
    services?: Tag[];
    paymentOptions?: PaymentOption[];

    // Opening hours
    openingHours?: OpeningHours;

    // Contact & Links
    contact?: ContactInfo;
    socialLinks?: SocialLinks;
    url?: string; // Legacy field

    // Media
    images?: PlaceImage[];
    reviews?: Review[];

    // External IDs
    externalIds?: ExternalIds;

    // Computed fields (added by queries)
    distance?: number; // Distance in meters from search center
}

// Partial place for list views (subset of fields)
export type PlaceListItem = Pick<
    Place,
    | '_id'
    | '_createdAt'
    | 'name'
    | 'slug'
    | 'categories'
    | 'location'
    | 'price'
    | 'established'
    | 'images'
    | 'reviews'
    | 'distance'
    | 'serving'
    | 'services'
    | 'openingHours'
>;

// Place detail view (all fields)
export type PlaceDetail = Place;

// Helper function to get formatted address from location
export function getFormattedAddress(location?: PlaceLocation): string | undefined {
    if (!location?.address) return undefined;

    // Handle legacy string format
    if (typeof location.address === 'string') {
        return location.address;
    }

    // Use formatted address if available
    if (location.address.formattedAddress) {
        return location.address.formattedAddress;
    }

    // Build address from parts
    const parts: string[] = [];

    if (location.address.street) {
        const streetWithNumber = location.address.streetNumber
            ? `${location.address.street} ${location.address.streetNumber}`
            : location.address.street;
        parts.push(streetWithNumber);
    }

    if (location.address.postalCode || location.address.city) {
        const cityPart = [location.address.postalCode, location.address.city]
            .filter(Boolean)
            .join(' ');
        parts.push(cityPart);
    }

    if (location.address.country) {
        parts.push(location.address.country);
    }

    return parts.join(', ') || undefined;
}

// Helper to check if place is currently open
export function isPlaceOpen(openingHours?: OpeningHours): boolean | null {
    if (!openingHours?.regular?.length) return null;

    const now = new Date();
    const dayIndex = now.getDay();
    const days: DayOfWeek[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    const today = days[dayIndex];

    const todayHours = openingHours.regular.find((d) => d.day === today);
    if (!todayHours) return null;

    if (todayHours.isClosed) return false;
    if (todayHours.is24Hours) return true;

    if (!todayHours.slots?.length) return null;

    const currentTime =
        now.getHours() * 60 + now.getMinutes();

    return todayHours.slots.some((slot) => {
        const [openH = 0, openM = 0] = slot.open.split(':').map(Number);
        const [closeH = 0, closeM = 0] = slot.close.split(':').map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        // Handle overnight hours (e.g., 22:00 - 02:00)
        if (closeMinutes < openMinutes) {
            return currentTime >= openMinutes || currentTime <= closeMinutes;
        }

        return currentTime >= openMinutes && currentTime <= closeMinutes;
    });
}

// Helper to get today's hours as a string
export function getTodayHours(openingHours?: OpeningHours): string | null {
    if (!openingHours?.regular?.length) return null;

    const now = new Date();
    const dayIndex = now.getDay();
    const days: DayOfWeek[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    const today = days[dayIndex];

    const todayHours = openingHours.regular.find((d) => d.day === today);
    if (!todayHours) return null;

    if (todayHours.isClosed) return 'Closed';
    if (todayHours.is24Hours) return '24 hours';

    if (!todayHours.slots?.length) return null;

    return todayHours.slots.map((slot) => `${slot.open} - ${slot.close}`).join(', ');
}
