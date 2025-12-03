# Place Data Model - Future-Proof Design

## Overview

This document outlines a comprehensive, future-proof data structure for the `place` document type. It addresses missing fields identified from external data sources (TripAdvisor, European Coffee Trip, Google Maps) while maintaining backward compatibility with existing data.

## Current Schema Analysis

### ✅ Existing Fields (place.ts)

| Field | Type | Status |
|-------|------|--------|
| `name` | string | ✅ Complete |
| `slug` | slug | ✅ Complete |
| `domains` | array (beer, coffee, vino, guide) | ✅ Complete |
| `categories` | tags (brewery, pub, cafe, etc.) | ✅ Complete |
| `services` | tags (kids area, outdoor, dog friendly, etc.) | ✅ Complete (expanded) |
| `payment_options` | array (cash, card, qr-code) | ✅ Complete |
| `location` | geolocation (geopoint + address) | ✅ Complete (structured address) |
| `url` | url | ⚠️ Deprecated - use socialLinks.website |
| `price` | string (low, average, high, very-high) | ✅ Complete |
| `reviews` | array of review | ✅ Complete |
| `established` | string | ✅ Complete |
| `images` | array of image | ✅ Complete |
| `description` | markdown | ✅ Complete |

### ✅ Implemented Fields (from external sources)

| Field | Priority | Source | Status |
|-------|----------|--------|--------|
| Opening hours | High | European Coffee Trip, Google Maps | ✅ Implemented |
| Serving/offerings | High | European Coffee Trip | ✅ Implemented |
| Contact info (phone, email) | Medium | Google Maps, TripAdvisor | ✅ Implemented |
| Social links (FB, IG, etc.) | Medium | European Coffee Trip | ✅ Implemented |
| External IDs (Google, TripAdvisor) | Low | For future integrations | ✅ Implemented |
| Accessibility features | Low | Google Maps | ✅ Implemented (in services) |

---

## Proposed Data Structure

### 1. Opening Hours

Structured opening hours supporting:
- Regular hours per day of week
- Multiple time slots per day (e.g., closed for lunch)
- Special hours (holidays)
- 24-hour/closed indicators

```typescript
interface OpeningHours {
  regular: DayHours[];
  special?: SpecialHours[];
  timezone?: string; // e.g., "Europe/Prague"
  notes?: string; // e.g., "Kitchen closes at 21:00"
}

interface DayHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isClosed?: boolean;
  is24Hours?: boolean;
  slots?: TimeSlot[];
}

interface TimeSlot {
  open: string;  // "08:00" (24h format)
  close: string; // "18:00"
}

interface SpecialHours {
  date: string;      // ISO date "2024-12-25"
  name?: string;     // "Christmas Day"
  isClosed?: boolean;
  slots?: TimeSlot[];
}
```

**Sanity Schema:**
```typescript
defineField({
  name: 'openingHours',
  title: 'Opening Hours',
  type: 'object',
  fields: [
    {
      name: 'regular',
      title: 'Regular Hours',
      type: 'array',
      of: [{
        type: 'object',
        name: 'dayHours',
        fields: [
          { name: 'day', type: 'string', options: { list: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] } },
          { name: 'isClosed', type: 'boolean', initialValue: false },
          { name: 'is24Hours', type: 'boolean', initialValue: false },
          { 
            name: 'slots', 
            type: 'array', 
            of: [{
              type: 'object',
              fields: [
                { name: 'open', type: 'string', title: 'Opens' },
                { name: 'close', type: 'string', title: 'Closes' }
              ]
            }]
          }
        ]
      }]
    },
    {
      name: 'timezone',
      type: 'string',
      initialValue: 'Europe/Prague'
    },
    {
      name: 'notes',
      type: 'text',
      rows: 2
    }
  ]
})
```

### 2. Serving / Offerings

What the place serves, applicable per domain:

```typescript
interface Serving {
  coffee?: CoffeeOffering[];
  food?: FoodOffering[];
  beverages?: BeverageOffering[];
}

type CoffeeOffering = 
  | 'espresso'
  | 'filter-coffee'
  | 'cold-brew'
  | 'nitro-coffee'
  | 'specialty-drinks'
  | 'decaf';

type FoodOffering = 
  | 'breakfast'
  | 'brunch'
  | 'lunch'
  | 'dinner'
  | 'pastries'
  | 'sandwiches'
  | 'salads'
  | 'desserts';

type BeverageOffering =
  | 'craft-beer'
  | 'draft-beer'
  | 'bottled-beer'
  | 'wine'
  | 'cocktails'
  | 'non-alcoholic';
```

**Sanity Schema:**
```typescript
defineField({
  name: 'serving',
  title: 'Serving / Offerings',
  type: 'tags',
  options: {
    predefinedTags: [
      // Coffee
      { value: 'espresso', label: 'Espresso' },
      { value: 'filter-coffee', label: 'Filter Coffee' },
      { value: 'cold-brew', label: 'Cold Brew' },
      { value: 'nitro-coffee', label: 'Nitro Coffee' },
      { value: 'specialty-drinks', label: 'Specialty Drinks' },
      { value: 'decaf', label: 'Decaf Available' },
      { value: 'plant-based-milk', label: 'Plant-based Milk' },
      // Food
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'brunch', label: 'Brunch' },
      { value: 'lunch', label: 'Lunch' },
      { value: 'dinner', label: 'Dinner' },
      { value: 'pastries', label: 'Pastries' },
      { value: 'sandwiches', label: 'Sandwiches' },
      // Beer
      { value: 'craft-beer', label: 'Craft Beer' },
      { value: 'draft-beer', label: 'Draft Beer' },
      { value: 'bottled-beer', label: 'Bottled Beer' },
      { value: 'house-brew', label: 'House Brew' },
      // Other
      { value: 'wine', label: 'Wine' },
      { value: 'cocktails', label: 'Cocktails' },
      { value: 'non-alcoholic', label: 'Non-alcoholic Options' },
    ],
  },
})
```

### 3. Contact Information

```typescript
interface ContactInfo {
  phone?: string;
  email?: string;
  bookingUrl?: string; // For reservations
}
```

**Sanity Schema:**
```typescript
defineField({
  name: 'contact',
  title: 'Contact Information',
  type: 'object',
  fields: [
    { name: 'phone', type: 'string', title: 'Phone Number' },
    { name: 'email', type: 'string', title: 'Email', validation: Rule => Rule.email() },
    { name: 'bookingUrl', type: 'url', title: 'Booking/Reservation URL' }
  ]
})
```

### 4. Social Links

```typescript
interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tripadvisor?: string;
  googleMaps?: string;
  yelp?: string;
  untappd?: string;     // For beer venues
  europeanCoffeeTrip?: string;
}
```

**Sanity Schema:**
```typescript
defineField({
  name: 'socialLinks',
  title: 'Social & External Links',
  type: 'object',
  fields: [
    { name: 'website', type: 'url', title: 'Website' },
    { name: 'facebook', type: 'url', title: 'Facebook' },
    { name: 'instagram', type: 'url', title: 'Instagram' },
    { name: 'twitter', type: 'url', title: 'Twitter/X' },
    { name: 'tripadvisor', type: 'url', title: 'TripAdvisor' },
    { name: 'googleMaps', type: 'url', title: 'Google Maps' },
    { name: 'yelp', type: 'url', title: 'Yelp' },
    { name: 'untappd', type: 'url', title: 'Untappd' },
  ]
})
```

### 5. Structured Address (Enhanced Geolocation)

```typescript
interface StructuredAddress {
  street?: string;
  streetNumber?: string;
  city: string;
  postalCode?: string;
  region?: string;      // State/Province
  country: string;
  countryCode?: string; // ISO 3166-1 alpha-2
  formattedAddress?: string; // Full display string
}

interface EnhancedGeolocation {
  geopoint: {
    lat: number;
    lng: number;
  };
  address: StructuredAddress;
}
```

**Sanity Schema (updated geolocation.ts):**
```typescript
export const geolocation = defineType({
  title: 'Location',
  name: 'geolocation',
  type: 'object',
  components: { input: GeolocationObjectInput },
  fields: [
    {
      title: 'Map',
      name: 'geopoint',
      type: 'geopoint'
    },
    {
      title: 'Address',
      name: 'address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street' },
        { name: 'streetNumber', type: 'string', title: 'Street Number' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
        { name: 'region', type: 'string', title: 'Region/State' },
        { name: 'country', type: 'string', title: 'Country' },
        { name: 'countryCode', type: 'string', title: 'Country Code', description: 'ISO 3166-1 alpha-2' },
        { name: 'formattedAddress', type: 'string', title: 'Formatted Address', description: 'Full display address' }
      ]
    }
  ],
});
```

### 6. Services (Expanded)

Add more amenities to the existing services tags:

```typescript
const additionalServices = [
  // Accessibility
  { value: 'wheelchair-accessible-entrance', label: 'Wheelchair Accessible Entrance' },
  { value: 'wheelchair-accessible-restroom', label: 'Wheelchair Accessible Restroom' },
  { value: 'wheelchair-accessible-seating', label: 'Wheelchair Accessible Seating' },
  
  // Family
  { value: 'high-chairs', label: 'High Chairs' },
  { value: 'changing-table', label: 'Baby Changing Table' },
  { value: 'kids-menu', label: 'Kids Menu' },
  
  // Tech & Convenience
  { value: 'wifi', label: 'Free WiFi' },
  { value: 'power-outlets', label: 'Power Outlets' },
  { value: 'laptop-friendly', label: 'Laptop Friendly' },
  
  // Atmosphere
  { value: 'quiet-space', label: 'Quiet Space' },
  { value: 'coworking-friendly', label: 'Coworking Friendly' },
  { value: 'live-music', label: 'Live Music' },
  
  // Parking
  { value: 'parking-available', label: 'Parking Available' },
  { value: 'bike-parking', label: 'Bike Parking' },
  
  // Service
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'reservations', label: 'Reservations Accepted' },
  { value: 'group-friendly', label: 'Group Friendly' }
];
```

### 7. External IDs (Future Integration)

For potential API integrations:

```typescript
interface ExternalIds {
  googlePlaceId?: string;
  tripadvisorId?: string;
  foursquareId?: string;
  yelpId?: string;
}
```

**Sanity Schema:**
```typescript
defineField({
  name: 'externalIds',
  title: 'External Platform IDs',
  type: 'object',
  description: 'IDs for external platform integrations',
  fields: [
    { name: 'googlePlaceId', type: 'string', title: 'Google Place ID' },
    { name: 'tripadvisorId', type: 'string', title: 'TripAdvisor ID' },
    { name: 'foursquareId', type: 'string', title: 'Foursquare ID' },
    { name: 'yelpId', type: 'string', title: 'Yelp ID' }
  ],
  options: { collapsed: true }
})
```

---

## Complete Updated Schema

Implementation files:
- **Sanity Schema**: `apps/cms-studio/src/schemas/place.ts`
- **TypeScript Types**: `libs/queries/src/lib/place/place.ts`
- **Geolocation Schema**: `apps/cms-studio/src/schemas/geolocation.ts`

## Migration Notes

### Backward Compatibility

1. **Existing `url` field**: Keep for backward compatibility, but deprecate in favor of `socialLinks.website`
2. **Existing `location.address`**: Keep string field but add structured address as new fields
3. **Existing `services`**: Expand predefinedTags, no migration needed

### Data Migration Script

For migrating existing data to new structure:

```typescript
// Example migration for url → socialLinks.website
const migration = {
  filter: '*[_type == "place" && defined(url) && !defined(socialLinks.website)]',
  patch: (doc) => ({
    set: {
      'socialLinks.website': doc.url
    }
  })
};
```

---

## TypeScript Types (for frontend)

```typescript
// libs/queries/src/types/place.ts

export interface Place {
  _id: string;
  _type: 'place';
  name: string;
  slug: { current: string };
  domains: ('beer' | 'coffee' | 'vino' | 'guide')[];
  categories: Tag[];
  services?: Tag[];
  serving?: Tag[];
  paymentOptions?: ('cash' | 'card' | 'qr-code')[];
  location: GeoLocation;
  contact?: ContactInfo;
  socialLinks?: SocialLinks;
  openingHours?: OpeningHours;
  price?: 'low' | 'average' | 'high' | 'very-high';
  reviews?: Review[];
  established?: string;
  images?: SanityImage[];
  description?: string;
  externalIds?: ExternalIds;
}

export interface Tag {
  value: string;
  label: string;
}

export interface GeoLocation {
  geopoint: {
    lat: number;
    lng: number;
  };
  address: StructuredAddress | string; // Support both formats during migration
}

export interface StructuredAddress {
  street?: string;
  streetNumber?: string;
  city: string;
  postalCode?: string;
  region?: string;
  country: string;
  countryCode?: string;
  formattedAddress?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  bookingUrl?: string;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tripadvisor?: string;
  googleMaps?: string;
  yelp?: string;
  untappd?: string;
}

export interface OpeningHours {
  regular?: DayHours[];
  timezone?: string;
  notes?: string;
}

export interface DayHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isClosed?: boolean;
  is24Hours?: boolean;
  slots?: TimeSlot[];
}

export interface TimeSlot {
  open: string;
  close: string;
}

export interface ExternalIds {
  googlePlaceId?: string;
  tripadvisorId?: string;
  foursquareId?: string;
  yelpId?: string;
}
```

---

## Implementation Priority

### Phase 1 (High Priority) ✅ COMPLETE
1. ✅ Opening hours - Implemented with regular hours, timezone, notes
2. ✅ Serving/offerings - Implemented with comprehensive tag list
3. ✅ Social links - Implemented, replaces single URL field
4. ✅ Contact info - Implemented with phone, email, booking URL

### Phase 2 (Medium Priority) ✅ COMPLETE
5. ✅ Expanded services - Implemented with 30+ amenity options
6. ✅ Structured address - Implemented in geolocation type

### Phase 3 (Low Priority) ✅ COMPLETE
7. ✅ External IDs - Implemented for Google, TripAdvisor, Foursquare, Yelp, Untappd
8. ⬜ Special hours - Not yet implemented (holiday support)

---

## UI Component Considerations

### Opening Hours Display
- Show "Open Now" / "Closed" badge
- Display today's hours prominently
- Expandable view for full week
- Handle edge cases: 24h, closed days

### Social Links
- Show as icon row
- Primary link (website) should be prominent
- Secondary links as smaller icons

### Serving Tags
- Group by category (Coffee, Food, Beer)
- Use icons where possible
- Filter-friendly on list pages
