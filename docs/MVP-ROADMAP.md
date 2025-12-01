# MVP Development Roadmap

> **Created:** July 2025
> **Last Updated:** 1 December 2025
> **Status:** Active Development
> **Priority Focus:** MVP Completion → Maps Migration → Data Automation

---

## Table of Contents

1. [Current State Assessment](#current-state-assessment)
2. [MVP Completion (Priority 1)](#mvp-completion-priority-1)
3. [Maps Migration (Priority 2)](#maps-migration-priority-2)
4. [Data Automation (Priority 3)](#data-automation-priority-3)
5. [Implementation Timeline](#implementation-timeline)

---

## Current State Assessment

### ✅ Working Features

| Feature | Status | Location |
|---------|--------|----------|
| Place listing | ✅ Complete | `/places` route |
| Place detail page | ✅ Complete | `/places/[slug]` route |
| Image gallery | ✅ Complete | `GalleryBlock`, `PhotoGallery` |
| Reviews display | ✅ Complete | `ReviewBlock`, `ReviewCard` |
| Location display | ✅ Complete | `LocationBlock` with Google Maps |
| Description rendering | ✅ Complete | `DescriptionBlock` (Markdown) |
| Category filtering | ✅ Complete | `Filter` component |
| Sanity CMS integration | ✅ Complete | `cms-studio` app |
| Google Maps in Sanity | ✅ Complete | `@sanity/google-maps-input` |
| Responsive design | ✅ Complete | Tailwind CSS |
| **Location search (geo-based)** | ✅ Complete | Server-side Nominatim geocoding + bounding box filtering |
| **Sort by dropdown** | ✅ Complete | Distance, Recently Added, Rating, Name, Established |

### ⚠️ Partially Implemented

| Feature | Status | Issue | Location |
|---------|--------|-------|----------|
| Google Maps display | ✅ Fixed | Billing enabled on Google Cloud project (Dec 2025) | `MapView` component |
| Sign In flow | ⚠️ Mock only | localStorage-based, demo user | `use-auth.ts` |

### ❌ Not Implemented / Mocked

| Feature | Status | Details | Files |
|---------|--------|---------|-------|
| **Sign Up form** | ❌ Mocked | Form UI exists, no API | `signup-form.tsx` - "TO-DO: Send data to API" |
| **Forgot Password** | ❌ Mocked | Form UI exists, no API | `forgot-password-form.tsx` - "TO-DO: Send data to API" |
| **Real Authentication** | ❌ Mocked | Uses hardcoded demo user | `use-auth.ts` - `demoUser: "Jhon Doe"` |
| **Add Review** | ❌ UI only | Modal exists, no persistence | `modals/add-review.tsx` |
| **Booking Form** | ❌ Commented | Import commented out | `drawers/view.tsx` |
| **Side Menu** | ❌ Commented | Import commented out | `drawers/view.tsx` |
| **Filter Drawer** | ❌ Commented | Import commented out | `drawers/view.tsx` |
| **Search Modal** | ❌ Commented | Searchbox import commented | `modals/view.tsx` |
| **Specification Block** | ❌ Commented | Component import commented | `detail-wrapper.tsx` |
| **Wishlist persistence** | ❌ None | No backend storage | `AddToWishlist` component |
| **Tasting experience** | ❌ Placeholder | Route exists, no content | `/tasting` route |
| **Strapi backend** | ❌ Abandoned | Unused experiment | `apps/backend/` |

---

## MVP Completion (Priority 1)

### Phase 1.1: Core User Features

These are essential for a functional MVP:

#### 1. Fix Location Search Matching
**Current Problem:**
```typescript
// Current implementation - exact substring match only
*[_type == "place" && $domain in domains && location.address match "${locationQuery}*"]
```

**Solution Options:**
1. **Option A: Enhanced GROQ Query** - Add city/region fields to schema and search multiple fields
2. **Option B: Geocoding Middleware** - Convert city names to coordinates, then search by proximity
3. **Option C: Sanity Text Search** - Use Sanity's built-in text search with boost scoring

**Recommended:** Option A + B combined
- Add `city`, `region`, `country` fields to `geolocation` schema
- Parse address components during geocode (already captured in `address` JSON)
- Search by city/region name OR by proximity to geocoded coordinates

**Files to modify:**
- `apps/cms-studio/src/schemas/geolocation.ts` - Add structured address fields
- `libs/queries/src/lib/list/list.ts` - Enhanced query with OR conditions
- `libs/ui-kit/src/lib/components/filter/location-input-filter.tsx` - Proximity search option

---

#### 2. Remove Incomplete Features from MVP
Hide or remove features that aren't complete to avoid user confusion:

| Feature | Action | Reason |
|---------|--------|--------|
| Sign Up / Sign In | ⏸️ Hide buttons | Auth not implemented |
| Add Review button | ⏸️ Hide | No backend persistence |
| Booking form | ✅ Already hidden | Commented out |
| Wishlist | ⏸️ Make local-only | No persistence, but useful |

**Files to modify:**
- `libs/ui-kit/src/lib/components/transparent-header/transparent-header.tsx` - Hide auth buttons
- `libs/ui-kit/src/lib/components/review-block/review-block.tsx` - Hide "Add Review" CTA

---

#### 3. Fix Detail Page Hardcoded Values
**Current issues:**
- `category='CATEGORY'` hardcoded in `detail-wrapper.tsx`
- `aside` placeholder text in sidebar

**Files to modify:**
- `libs/ui-kit/src/lib/components/detail-wrapper/detail-wrapper.tsx`

---

### Phase 1.2: Polish & Quality

#### 4. Clean Up Commented Code
Remove or properly implement commented-out components:

| File | Action |
|------|--------|
| `drawers/view.tsx` | Remove SideMenu, Filter, BookingFormModal comments |
| `modals/view.tsx` | Remove Searchbox comment |
| `detail-wrapper.tsx` | Remove SpecificationBlock comment or implement |
| `action-icon.tsx` | Remove SpinnerIcon comment |

---

#### 5. Error Handling & Loading States
Improve user experience with better states:

- Add proper 404 page for invalid place slugs
- Improve loading states (replace "Loading..." with skeleton components)
- Add error boundaries for failed data fetches

---

## Maps Migration (Priority 2)

### Current Maps Architecture

| Component | Location | Current Tech | Purpose |
|-----------|----------|--------------|---------|
| `MapView` | `libs/ui-kit/src/lib/components/map-view/` | Google Maps | Display venue location |
| `SearchAutocomplete` | `libs/ui-kit/src/lib/components/search-autocomplete/` | Google Places | Location search autocomplete |
| `LocationInputFilter` | `libs/ui-kit/src/lib/components/filter/` | Google Places | Filter by location |
| `GeolocationObjectInput` | `apps/cms-studio/src/components/` | Google Maps | Sanity CMS input |
| `AddressInput` | `apps/cms-studio/src/components/` | react-geocode | Reverse geocoding |

### Migration Strategy

#### Public Sites: Migrate to OpenStreetMap (Leaflet)

**Why OpenStreetMap:**
- Free, no API quotas
- No billing concerns
- Open data
- Good React library support (react-leaflet)

**Components to migrate:**

| Current | New | Library |
|---------|-----|---------|
| `@react-google-maps/api` GoogleMap | `react-leaflet` MapContainer | `react-leaflet` |
| StandaloneSearchBox | Nominatim API / Photon | Custom hook |
| react-geocode | Nominatim API | Custom hook |

**New packages to add:**
```bash
yarn add react-leaflet leaflet @types/leaflet
```

**Migration steps:**

1. **Create OpenStreetMap wrapper component**
   - Location: `libs/ui-kit/src/lib/components/osm-map/osm-map.tsx`
   - Support same props as `MapView`

2. **Create location search hook with Nominatim**
   - Location: `libs/ui-kit/src/lib/hooks/use-location-search/use-location-search.ts`
   - Free geocoding and reverse geocoding

3. **Update MapView to use OSM**
   - Replace Google Maps with Leaflet
   - Keep same interface for backwards compatibility

4. **Update SearchAutocomplete**
   - Replace Google Places with Nominatim/Photon
   - Show city/region suggestions

#### Sanity CMS: Keep Google Maps

**Why keep Google:**
- `@sanity/google-maps-input` is mature and works well
- Places API provides rich venue data (hours, photos, etc.)
- Worth the API cost for CMS data entry
- No quota concerns (limited CMS users)

**No changes needed for:**
- `apps/cms-studio/src/components/geolocation.tsx`
- `apps/cms-studio/src/components/addressInput.tsx`
- Google Maps plugin in `sanity.config.ts`

---

### Phase 2.1: OpenStreetMap Components

#### New Files to Create

```
libs/ui-kit/src/lib/components/
├── osm-map/
│   ├── osm-map.tsx          # Leaflet map component
│   ├── osm-map.module.scss  # Styles
│   └── index.ts             # Export
├── osm-search/
│   ├── osm-search.tsx       # Nominatim search component
│   └── index.ts             # Export
└── hooks/
    └── use-nominatim/
        └── use-nominatim.ts # Geocoding hook
```

#### OSM Map Component (Draft)

```tsx
// osm-map.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface OSMMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  markerPopup?: string;
}

export const OSMMap: FunctionComponent<OSMMapProps> = ({
  latitude,
  longitude,
  zoom = 16,
  className,
  markerPopup,
}) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      className={className}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        {markerPopup && <Popup>{markerPopup}</Popup>}
      </Marker>
    </MapContainer>
  );
};
```

---

### Phase 2.2: Location Search Enhancement ✅ COMPLETED (1 December 2025)

#### The Location Matching Problem

**User's question:** "How do we match places with lat/long coordinates with a map search when someone searches for a particular City or county, when the search query is not exactly the same as what we have stored?"

**Solution Implemented:**

We implemented a bounding-box based geo-search using Nominatim (OpenStreetMap):

1. **Server-side Geocoding with Nominatim**
   - Free, no API key required
   - Returns center coordinates + bounding box for search area
   - Location: `libs/queries/src/lib/geocoding/geocoding.ts`

2. **Bounding Box Filtering in GROQ**
   - Filter places within the geocoded bounding box
   - Works with existing `location.geopoint` data in Sanity
   
3. **Client-side Distance Calculation**
   - Haversine formula calculates distance from search center
   - Results sorted by distance when sorting by "Distance"

**Implementation Details:**

```typescript
// libs/queries/src/lib/geocoding/geocoding.ts
export async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'TasteCoffee/1.0' }
  });
  const data = await response.json();
  if (data.length > 0) {
    return {
      center: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) },
      bounds: {
        south: parseFloat(data[0].boundingbox[0]),
        north: parseFloat(data[0].boundingbox[1]),
        west: parseFloat(data[0].boundingbox[2]),
        east: parseFloat(data[0].boundingbox[3])
      }
    };
  }
  return null;
}
```

**Why Nominatim instead of Google Geocoding API:**
- Google Maps API key has HTTP referrer restrictions
- Server-side requests get `REQUEST_DENIED` errors
- Nominatim is free, no key required, works server-side

#### Sort Functionality ✅ COMPLETED (1 December 2025)

Added 5 sort options to the places listing with URL-based state management:

| Option | GROQ Order Clause | Description |
|--------|-------------------|-------------|
| Distance (default) | Client-side Haversine | Nearest to search location center |
| Recently Added | `order(_createdAt desc)` | Newest entries first |
| Highest Rated | `order(coalesce(math::avg(reviews[].rating), 0) desc)` | Best average review rating |
| Name (A-Z) | `order(lower(name) asc)` | Alphabetical sorting |
| Newest Established | `order(established desc)` | Most recently opened venues |

**Implementation Details:**
- Sort selection updates URL with `?sort=<option>` parameter
- Server re-renders page with new GROQ query
- Distance sorting uses Haversine formula (client-side) when geo-search active
- Falls back to `_createdAt desc` when no location search is active

**Files Modified:**
- `libs/queries/src/lib/list/list.ts` - Added `SortOption` type, `getOrderClause()` function, Haversine calculation
- `libs/ui-kit/src/lib/components/filter-topbar/filter-topbar.tsx` - Dropdown with URL navigation via `useRouter`
- `libs/ui-kit/src/lib/components/list-wrapper/list-wrapper.tsx` - Added `currentSort` prop
- `apps/tastecoffee.eu/app/places/page.tsx` - Parse `sort` URL param, pass to query
- `apps/tastebeer.eu/app/places/page.tsx` - Same changes

**Working Examples:**
```
/places?location=Prague              → 7 coffee places, sorted by distance
/places?location=Prague&sort=rating  → 7 coffee places, sorted by rating
/places?sort=recently-added          → All places, sorted by creation date
```

---

## Data Automation (Priority 3)

> **Research Sources:**
> - [Scraping Google Maps with Puppeteer](https://dev.to/oxylabs-io/the-ultimate-guide-to-scraping-google-maps-with-puppeteer-4nm)
> - [Scraping TripAdvisor Reviews](https://dev.to/andreasa/how-to-scrape-tripadvisor-reviews-with-nodejs-and-puppeteer-5gn)
> - [Puppeteer Cluster for Scaling](https://medium.com/@datajournal/puppeteer-cluster-to-scale-up-web-scraping-98de94c77ebe)

### Goal

Automate data entry by scraping venues from:
- Google Maps (primary - venue data, coordinates, ratings)
- TripAdvisor (enrichment - reviews, photos)
- Other sources as needed

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SCRAPER SERVICE (NX Library)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │  CLI Runner  │───▶│  Puppeteer       │───▶│  Task Queue      │       │
│  │  (Commander) │    │  Cluster         │    │  (URL Queue)     │       │
│  └──────────────┘    │  (3-5 workers)   │    └──────────────────┘       │
│                      └────────┬─────────┘                               │
│                               │                                         │
│           ┌───────────────────┼───────────────────┐                     │
│           ▼                   ▼                   ▼                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
│  │ Google Maps    │  │ TripAdvisor    │  │ Future Sources │             │
│  │ Scraper        │  │ Scraper        │  │ (Yelp, etc.)   │             │
│  └────────┬───────┘  └────────┬───────┘  └────────────────┘             │
│           │                   │                                         │
│           └─────────┬─────────┘                                         │
│                     ▼                                                   │
│           ┌─────────────────┐                                           │
│           │  Data Processor │                                           │
│           │  - Normalize    │                                           │
│           │  - Deduplicate  │                                           │
│           │  - Validate     │                                           │
│           └────────┬────────┘                                           │
│                    ▼                                                    │
│           ┌─────────────────┐                                           │
│           │ Sanity Uploader │                                           │
│           │ (Mutation API)  │                                           │
│           └─────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 3.1: Project Structure

**Create NX Library:**

```bash
yarn nx g @nx/node:library scraper --directory=libs
```

**Dependencies to install:**

```bash
cd libs/scraper
yarn add puppeteer puppeteer-cluster commander chalk @sanity/client
yarn add -D @types/node
```

**Recommended File Structure:**

```
libs/scraper/
├── src/
│   ├── index.ts                    # Main exports
│   ├── cli.ts                      # CLI entry point
│   │
│   ├── cluster/
│   │   ├── cluster-manager.ts      # Puppeteer Cluster setup
│   │   └── worker-config.ts        # Worker configuration
│   │
│   ├── scrapers/
│   │   ├── base-scraper.ts         # Abstract base class
│   │   ├── google-maps.scraper.ts  # Google Maps implementation
│   │   ├── tripadvisor.scraper.ts  # TripAdvisor implementation
│   │   └── index.ts
│   │
│   ├── processors/
│   │   ├── normalizer.ts           # Map scraped data to Sanity schema
│   │   ├── deduplicator.ts         # Find duplicates by coordinates
│   │   ├── validator.ts            # Validate data quality
│   │   └── image-downloader.ts     # Download and prepare images
│   │
│   ├── sanity/
│   │   ├── client.ts               # Sanity client instance
│   │   ├── uploader.ts             # Document creation/update
│   │   └── asset-uploader.ts       # Image asset upload
│   │
│   ├── types/
│   │   ├── scraped-place.ts        # Raw scraped data type
│   │   └── sanity-place.ts         # Sanity document type
│   │
│   └── utils/
│       ├── rate-limiter.ts         # Request throttling
│       ├── proxy-rotator.ts        # Optional proxy support
│       └── logger.ts               # Structured logging
│
├── project.json
├── package.json
└── tsconfig.json
```

---

### Phase 3.2: Puppeteer Cluster Setup (Scaling)

**Why Puppeteer Cluster?**
- Run multiple browser instances concurrently (3-5 workers)
- Automatic task queue management
- Built-in retry logic for failed tasks
- Memory optimization through worker recycling
- Avoids detection by distributing requests

**Concurrency Models:**

| Model | Use Case | Isolation |
|-------|----------|-----------|
| `CONCURRENCY_BROWSER` | Each worker = separate browser | Full (cookies, sessions) |
| `CONCURRENCY_CONTEXT` | Each worker = browser context | Partial (shared browser) |
| `CONCURRENCY_PAGE` | Each worker = page tab | Minimal (shared everything) |

**Recommended:** `CONCURRENCY_BROWSER` for scraping different domains

**Implementation:**

```typescript
// libs/scraper/src/cluster/cluster-manager.ts
import { Cluster } from 'puppeteer-cluster';
import type { Page } from 'puppeteer';

export interface ClusterConfig {
  maxConcurrency: number;
  retryLimit: number;
  retryDelay: number;
  timeout: number;
  monitor: boolean;
}

const defaultConfig: ClusterConfig = {
  maxConcurrency: 3,        // 3 parallel browser instances
  retryLimit: 3,            // Retry failed tasks 3 times
  retryDelay: 2000,         // 2s delay between retries
  timeout: 60000,           // 60s timeout per task
  monitor: true,            // Enable monitoring logs
};

export async function createCluster(config: Partial<ClusterConfig> = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: mergedConfig.maxConcurrency,
    retryLimit: mergedConfig.retryLimit,
    retryDelay: mergedConfig.retryDelay,
    timeout: mergedConfig.timeout,
    monitor: mergedConfig.monitor,
    skipDuplicateUrls: true,          // Prevent duplicate scraping
    workerCreationDelay: 100,         // Delay between worker creation
    puppeteerOptions: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080',
      ],
    },
  });

  return cluster;
}
```

---

### Phase 3.3: Google Maps Scraper

**Data to Extract:**
- Business name
- Address (full + components)
- Coordinates (lat/lng)
- Rating & review count
- Categories/types
- Website URL
- Phone number
- Opening hours
- Photos (first 3-5)

**Implementation:**

```typescript
// libs/scraper/src/scrapers/google-maps.scraper.ts
import type { Page } from 'puppeteer';

export interface GoogleMapsPlace {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  categories: string[];
  website?: string;
  phone?: string;
  priceLevel?: string;
  photos: string[];
}

export async function scrapeGoogleMapsSearch(
  page: Page,
  query: string // e.g., "breweries in Prague"
): Promise<GoogleMapsPlace[]> {
  // Navigate to Google Maps
  await page.goto('https://www.google.com/maps', { waitUntil: 'networkidle2' });
  
  // Enter search query
  await page.waitForSelector('#searchboxinput');
  await page.type('#searchboxinput', query);
  await page.click('#searchbox-searchbutton');
  
  // Wait for results to load
  await page.waitForSelector('[role="feed"]', { timeout: 10000 });
  
  // Scroll to load more results (Google Maps lazy-loads)
  await autoScroll(page, '[role="feed"]', 5); // Scroll 5 times
  
  // Extract all visible results
  const results = await page.evaluate(() => {
    const places: GoogleMapsPlace[] = [];
    const items = document.querySelectorAll('[role="feed"] > div > div[jsaction]');
    
    items.forEach((item) => {
      try {
        const nameEl = item.querySelector('.fontHeadlineSmall');
        const ratingEl = item.querySelector('.MW4etd');
        const reviewCountEl = item.querySelector('.UY7F9');
        const addressEl = item.querySelector('.W4Efsd:last-child > span:last-child');
        const categoryEl = item.querySelector('.W4Efsd > span');
        
        if (nameEl) {
          places.push({
            name: nameEl.textContent?.trim() || '',
            address: addressEl?.textContent?.trim() || '',
            rating: parseFloat(ratingEl?.textContent || '0'),
            reviewCount: parseInt(
              reviewCountEl?.textContent?.replace(/[^0-9]/g, '') || '0'
            ),
            categories: categoryEl?.textContent?.split('·').map(c => c.trim()) || [],
            coordinates: { lat: 0, lng: 0 }, // Need to extract from detail page
            photos: [],
          });
        }
      } catch (e) {
        // Skip malformed entries
      }
    });
    
    return places;
  });
  
  return results;
}

// Helper: Auto-scroll to load lazy content
async function autoScroll(page: Page, selector: string, times: number) {
  for (let i = 0; i < times; i++) {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, selector);
    await page.waitForTimeout(1500); // Wait for new content
  }
}

// Scrape individual place detail page for more data
export async function scrapeGoogleMapsDetail(
  page: Page,
  placeUrl: string
): Promise<Partial<GoogleMapsPlace>> {
  await page.goto(placeUrl, { waitUntil: 'networkidle2' });
  
  // Wait for main content
  await page.waitForSelector('h1.DUwDvf', { timeout: 10000 });
  
  return await page.evaluate(() => {
    const details: Partial<GoogleMapsPlace> = {};
    
    // Extract coordinates from URL
    const urlMatch = window.location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (urlMatch) {
      details.coordinates = {
        lat: parseFloat(urlMatch[1]),
        lng: parseFloat(urlMatch[2]),
      };
    }
    
    // Extract website
    const websiteEl = document.querySelector('a[data-item-id="authority"]');
    if (websiteEl) {
      details.website = websiteEl.getAttribute('href') || undefined;
    }
    
    // Extract phone
    const phoneEl = document.querySelector('[data-item-id^="phone:"]');
    if (phoneEl) {
      details.phone = phoneEl.textContent?.trim();
    }
    
    // Extract photos (first 5 thumbnails)
    const photoEls = document.querySelectorAll('button[jsaction*="heroHeaderImage"] img');
    details.photos = Array.from(photoEls)
      .slice(0, 5)
      .map(img => img.getAttribute('src') || '')
      .filter(Boolean);
    
    return details;
  });
}
```

---

### Phase 3.4: TripAdvisor Scraper

**Why TripAdvisor?**
- Detailed user reviews with ratings
- Date of visit information
- Review titles and content
- User-generated photos

**Key Technique: Expand "Read More" before scraping**
TripAdvisor truncates review text by default. Must click "More" to get full content.

**Implementation:**

```typescript
// libs/scraper/src/scrapers/tripadvisor.scraper.ts
import type { Page } from 'puppeteer';

export interface TripAdvisorReview {
  rating: number;           // 1-5 scale
  dateOfVisit: string;      // "October 2024"
  dateOfReview: string;     // "November 15, 2024"
  title: string;
  content: string;
  authorName?: string;
}

export interface TripAdvisorPlace {
  name: string;
  reviews: TripAdvisorReview[];
  averageRating: number;
  totalReviews: number;
  photos: string[];
}

export async function scrapeTripAdvisorReviews(
  page: Page,
  restaurantUrl: string
): Promise<TripAdvisorPlace> {
  // Launch with specific viewport for consistent scraping
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.goto(restaurantUrl, { waitUntil: 'networkidle2' });
  await page.waitForSelector('body');
  
  // CRITICAL: Expand all "Read More" links before scraping
  try {
    await page.click('.taLnk.ulBlueLinks'); // "More" button selector
    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Show less")',
      { timeout: 5000 }
    );
  } catch {
    // Some pages may not have expandable content
  }
  
  // Extract reviews
  const data = await page.evaluate(() => {
    const reviews: TripAdvisorReview[] = [];
    const reviewContainers = document.querySelectorAll('.review-container');
    
    reviewContainers.forEach((item) => {
      try {
        // Extract rating from CSS class (e.g., "bubble_50" = 5.0)
        const ratingClass = item.querySelector('.ui_bubble_rating')?.getAttribute('class');
        const ratingMatch = ratingClass?.match(/bubble_(\d+)/);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) / 10 : 0;
        
        // Extract date of visit
        const dateOfVisitEl = item.querySelector('.prw_rup.prw_reviews_stay_date_hsx');
        const dateOfVisit = dateOfVisitEl?.textContent?.replace('Date of visit:', '').trim() || '';
        
        // Extract review date
        const ratingDateEl = item.querySelector('.ratingDate');
        const dateOfReview = ratingDateEl?.getAttribute('title') || '';
        
        // Extract title and content
        const titleEl = item.querySelector('.noQuotes');
        const contentEl = item.querySelector('.partial_entry');
        
        reviews.push({
          rating,
          dateOfVisit,
          dateOfReview,
          title: titleEl?.textContent?.trim() || '',
          content: contentEl?.textContent?.trim() || '',
        });
      } catch (e) {
        // Skip malformed reviews
      }
    });
    
    // Extract overall stats
    const avgRatingEl = document.querySelector('.eSVKYj');
    const totalReviewsEl = document.querySelector('.jVDab.W.f.u.w.JqMhy');
    
    return {
      name: document.querySelector('h1')?.textContent?.trim() || '',
      reviews,
      averageRating: parseFloat(avgRatingEl?.textContent || '0'),
      totalReviews: parseInt(totalReviewsEl?.textContent?.replace(/[^0-9]/g, '') || '0'),
      photos: [], // Extract separately if needed
    };
  });
  
  return data;
}

// Paginate through all review pages
export async function scrapeAllTripAdvisorReviews(
  page: Page,
  restaurantUrl: string,
  maxPages = 10
): Promise<TripAdvisorReview[]> {
  const allReviews: TripAdvisorReview[] = [];
  let currentPage = 1;
  
  while (currentPage <= maxPages) {
    const pageData = await scrapeTripAdvisorReviews(page, restaurantUrl);
    allReviews.push(...pageData.reviews);
    
    // Check for next page button
    const hasNextPage = await page.evaluate(() => {
      const nextBtn = document.querySelector('.nav.next');
      return nextBtn && !nextBtn.classList.contains('disabled');
    });
    
    if (!hasNextPage) break;
    
    // Click next page
    await page.click('.nav.next');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    currentPage++;
  }
  
  return allReviews;
}
```

---

### Phase 3.5: Data Processing Pipeline

**Normalizer - Map to Sanity Schema:**

```typescript
// libs/scraper/src/processors/normalizer.ts
import type { GoogleMapsPlace } from '../scrapers/google-maps.scraper';
import type { TripAdvisorReview } from '../scrapers/tripadvisor.scraper';

// Target schema for Sanity
export interface SanityPlaceInput {
  _type: 'place';
  name: string;
  slug: { _type: 'slug'; current: string };
  domains: string[];
  categories: { value: string; label: string }[];
  location: {
    geopoint: { _type: 'geopoint'; lat: number; lng: number };
    address: string;
  };
  url?: string;
  price?: string;
  reviews?: {
    _type: 'review';
    _key: string;
    rating: { _type: 'rating'; value: number };
    content: string;
    author?: string;
    date?: string;
  }[];
}

// Category mapping from scraped to our predefined list
const CATEGORY_MAP: Record<string, string> = {
  'brewery': 'brewery',
  'brewpub': 'brewery',
  'beer garden': 'beer-garden',
  'pub': 'pub',
  'bar': 'pub',
  'coffee shop': 'cafe',
  'café': 'cafe',
  'cafe': 'cafe',
  'roastery': 'roaster',
  'bakery': 'bakery',
  'restaurant': 'restaurant',
  'bistro': 'bistro',
};

// Domain detection based on categories
function detectDomain(categories: string[]): string[] {
  const domains: string[] = [];
  const lowerCategories = categories.map(c => c.toLowerCase());
  
  if (lowerCategories.some(c => 
    c.includes('brew') || c.includes('beer') || c.includes('pub')
  )) {
    domains.push('beer');
  }
  
  if (lowerCategories.some(c => 
    c.includes('coffee') || c.includes('café') || c.includes('cafe') || c.includes('roast')
  )) {
    domains.push('coffee');
  }
  
  return domains.length ? domains : ['guide']; // Default to guide
}

// Price level mapping
function mapPriceLevel(priceLevel?: string): string | undefined {
  const map: Record<string, string> = {
    '$': 'low',
    '$$': 'average',
    '$$$': 'high',
    '$$$$': 'very-high',
  };
  return priceLevel ? map[priceLevel] : undefined;
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

export function normalizeGoogleMapsPlace(
  place: GoogleMapsPlace,
  tripadvisorReviews?: TripAdvisorReview[]
): SanityPlaceInput {
  const normalizedCategories = place.categories
    .map(cat => {
      const key = cat.toLowerCase();
      const mapped = Object.keys(CATEGORY_MAP).find(k => key.includes(k));
      return mapped ? CATEGORY_MAP[mapped] : null;
    })
    .filter((c): c is string => c !== null)
    .map(value => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' '),
    }));

  const sanityPlace: SanityPlaceInput = {
    _type: 'place',
    name: place.name,
    slug: { _type: 'slug', current: generateSlug(place.name) },
    domains: detectDomain(place.categories),
    categories: normalizedCategories,
    location: {
      geopoint: {
        _type: 'geopoint',
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
      },
      address: place.address,
    },
    url: place.website,
    price: mapPriceLevel(place.priceLevel),
  };

  // Add TripAdvisor reviews if available
  if (tripadvisorReviews?.length) {
    sanityPlace.reviews = tripadvisorReviews.slice(0, 10).map((review, i) => ({
      _type: 'review' as const,
      _key: `review-${i}`,
      rating: { _type: 'rating' as const, value: review.rating },
      content: review.content,
      date: review.dateOfReview,
    }));
  }

  return sanityPlace;
}
```

**Deduplicator - Prevent Duplicates:**

```typescript
// libs/scraper/src/processors/deduplicator.ts
import { sanityClient } from '../sanity/client';

const DUPLICATE_THRESHOLD_METERS = 50; // Consider duplicate if within 50m

export async function findExistingPlace(
  coordinates: { lat: number; lng: number }
): Promise<string | null> {
  const query = `*[_type == "place" && defined(location.geopoint)] {
    _id,
    name,
    "distance": geo::distance(
      location.geopoint,
      geo::latLng($lat, $lng)
    )
  } | order(distance asc) [0]`;

  const result = await sanityClient.fetch(query, {
    lat: coordinates.lat,
    lng: coordinates.lng,
  });

  if (result && result.distance < DUPLICATE_THRESHOLD_METERS) {
    return result._id; // Return existing ID for update
  }

  return null; // No duplicate found
}
```

---

### Phase 3.6: Sanity Upload

```typescript
// libs/scraper/src/sanity/uploader.ts
import { createClient } from '@sanity/client';
import type { SanityPlaceInput } from '../processors/normalizer';

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN!, // Need write token
  apiVersion: '2024-01-01',
  useCdn: false,
});

export async function uploadPlace(
  place: SanityPlaceInput,
  existingId?: string
): Promise<string> {
  if (existingId) {
    // Update existing document
    const result = await sanityClient
      .patch(existingId)
      .set(place)
      .commit();
    return result._id;
  } else {
    // Create new document
    const result = await sanityClient.create(place);
    return result._id;
  }
}

export async function uploadImage(
  imageUrl: string,
  filename: string
): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  
  const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
    filename,
  });
  
  return asset._id;
}
```

---

### Phase 3.7: CLI Runner

```typescript
// libs/scraper/src/cli.ts
import { Command } from 'commander';
import { createCluster } from './cluster/cluster-manager';
import { scrapeGoogleMapsSearch, scrapeGoogleMapsDetail } from './scrapers/google-maps.scraper';
import { scrapeTripAdvisorReviews } from './scrapers/tripadvisor.scraper';
import { normalizeGoogleMapsPlace } from './processors/normalizer';
import { findExistingPlace } from './processors/deduplicator';
import { uploadPlace } from './sanity/uploader';

const program = new Command();

program
  .name('scraper')
  .description('Hospitality venues data scraper')
  .version('1.0.0');

program
  .command('google-maps')
  .description('Scrape venues from Google Maps')
  .argument('<query>', 'Search query (e.g., "breweries in Prague")')
  .option('-l, --limit <number>', 'Max results to scrape', '20')
  .option('-d, --dry-run', 'Preview without uploading to Sanity')
  .action(async (query, options) => {
    console.log(`🔍 Searching Google Maps: "${query}"`);
    
    const cluster = await createCluster({ maxConcurrency: 3 });
    const places: any[] = [];
    
    // Define the scraping task
    await cluster.task(async ({ page, data: url }) => {
      const details = await scrapeGoogleMapsDetail(page, url);
      places.push(details);
    });
    
    // First, get search results
    // ... queue individual place URLs
    
    await cluster.idle();
    await cluster.close();
    
    console.log(`✅ Scraped ${places.length} places`);
    
    if (!options.dryRun) {
      // Upload to Sanity
      for (const place of places) {
        const normalized = normalizeGoogleMapsPlace(place);
        const existingId = await findExistingPlace(place.coordinates);
        const id = await uploadPlace(normalized, existingId || undefined);
        console.log(`📤 ${existingId ? 'Updated' : 'Created'}: ${id}`);
      }
    }
  });

program
  .command('tripadvisor')
  .description('Scrape reviews from TripAdvisor')
  .argument('<url>', 'TripAdvisor restaurant URL')
  .option('-p, --pages <number>', 'Max review pages', '5')
  .action(async (url, options) => {
    console.log(`🔍 Scraping TripAdvisor: ${url}`);
    // Implementation...
  });

program
  .command('validate')
  .description('Check data freshness for existing places')
  .option('-a, --all', 'Validate all places')
  .action(async (options) => {
    console.log('🔄 Validating place data...');
    // Implementation...
  });

program.parse();
```

**Usage:**

```bash
# Scrape breweries in Prague
yarn nx run scraper:cli -- google-maps "breweries in Prague" --limit 50

# Dry run (preview without uploading)
yarn nx run scraper:cli -- google-maps "cafes in Berlin" --dry-run

# Scrape TripAdvisor reviews for a specific place
yarn nx run scraper:cli -- tripadvisor "https://www.tripadvisor.com/Restaurant_Review-..." --pages 10

# Validate existing data freshness
yarn nx run scraper:cli -- validate --all
```

---

### Phase 3.8: Best Practices & Anti-Detection

**Rate Limiting:**

```typescript
// libs/scraper/src/utils/rate-limiter.ts
export class RateLimiter {
  private lastRequest = 0;
  private minDelay: number;

  constructor(requestsPerMinute: number) {
    this.minDelay = 60000 / requestsPerMinute;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    
    if (elapsed < this.minDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minDelay - elapsed)
      );
    }
    
    this.lastRequest = Date.now();
  }
}

// Usage: 10 requests per minute
const limiter = new RateLimiter(10);
await limiter.wait();
await page.goto(url);
```

**Anti-Detection Techniques:**

| Technique | Implementation |
|-----------|----------------|
| Random delays | 1-5 second random wait between requests |
| User-Agent rotation | Rotate between common browser user agents |
| Viewport variation | Slightly vary viewport dimensions |
| Mouse movements | Simulate human-like mouse paths |
| Proxy rotation | Use residential proxies for high-volume |
| Session management | Clear cookies/storage between sessions |

**Error Handling:**

```typescript
// Cluster handles retries automatically with config:
const cluster = await Cluster.launch({
  retryLimit: 3,        // Retry failed tasks 3 times
  retryDelay: 2000,     // Wait 2s between retries
  timeout: 60000,       // 60s timeout per task
});
```

---

### Phase 3.9: Data Freshness Validation

```typescript
// libs/scraper/src/validators/freshness-checker.ts
import { sanityClient } from '../sanity/client';
import { scrapeGoogleMapsDetail } from '../scrapers/google-maps.scraper';
import isEqual from 'lodash/isEqual';

interface FreshnessReport {
  placeId: string;
  placeName: string;
  issues: string[];
  severity: 'ok' | 'warning' | 'critical';
  recommendation: 'none' | 'update' | 'unpublish' | 'delete';
}

export async function checkPlaceFreshness(
  placeId: string,
  cluster: Cluster
): Promise<FreshnessReport> {
  const place = await sanityClient.fetch(
    `*[_id == $id][0] { _id, name, location, url }`,
    { id: placeId }
  );

  const issues: string[] = [];
  let severity: FreshnessReport['severity'] = 'ok';
  
  // Re-scrape from Google Maps
  let freshData: any;
  await cluster.queue(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.location.address)}`,
    async ({ page, data: url }) => {
      freshData = await scrapeGoogleMapsDetail(page, url);
    }
  );
  
  await cluster.idle();
  
  // Compare data
  if (!freshData) {
    issues.push('Place not found on Google Maps');
    return {
      placeId,
      placeName: place.name,
      issues,
      severity: 'critical',
      recommendation: 'unpublish',
    };
  }
  
  if (freshData.permanentlyClosed) {
    issues.push('Place is permanently closed');
    severity = 'critical';
  }
  
  if (freshData.name !== place.name) {
    issues.push(`Name changed: "${place.name}" → "${freshData.name}"`);
    severity = 'warning';
  }
  
  // Add more checks as needed...
  
  return {
    placeId,
    placeName: place.name,
    issues,
    severity,
    recommendation: issues.length > 0 ? 'update' : 'none',
  };
}
```

---

### Legal Considerations

⚠️ **Important:** Web scraping has legal implications

| Source | ToS Status | Recommendation |
|--------|------------|----------------|
| Google Maps | Scraping against ToS | Use Places API for production ($$$) |
| TripAdvisor | Scraping against ToS | Use Content API (affiliate program) |
| Yelp | Scraping against ToS | Use Fusion API (free tier available) |

**Mitigation Strategies:**

1. **Respectful Rate Limiting** - Max 10-20 requests/minute
2. **Public Data Only** - Don't scrape behind logins
3. **No Caching of Raw Data** - Transform and store only essential fields
4. **Robots.txt Compliance** - Check and respect crawl rules
5. **User-Agent Identification** - Identify as a bot if requested

**Recommended Production Approach:**

| Phase | Approach | Cost |
|-------|----------|------|
| POC/Development | Puppeteer scraping | Free |
| Production (Google) | Google Places API | ~$17/1000 requests |
| Production (TripAdvisor) | Content API affiliate | Revenue share |
| Production (Yelp) | Fusion API | Free tier + paid |

**API Alternative - Google Places:**

```typescript
// Alternative: Using official Google Places API
import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

async function searchPlacesAPI(query: string) {
  const response = await client.textSearch({
    params: {
      query,
      key: process.env.GOOGLE_PLACES_API_KEY!,
    },
  });
  
  return response.data.results;
}
```

---

## Implementation Timeline

### Sprint 1 (Week 1-2): MVP Polish

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Fix hardcoded "CATEGORY" in detail page | High | 1h | - |
| Hide auth buttons (Sign In/Up) | High | 2h | - |
| Hide "Add Review" button | High | 1h | - |
| Remove commented imports from drawers/modals | Medium | 2h | - |
| Improve loading states | Medium | 4h | - |
| Add 404 page for invalid slugs | Medium | 2h | - |

### Sprint 2 (Week 3-4): Location Search

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Add city/region fields to geolocation schema | High | 2h | - |
| Update address parsing to extract city/region | High | 4h | - |
| Enhance GROQ query with structured field search | High | 4h | - |
| Test location search with various queries | High | 4h | - |

### Sprint 3 (Week 5-6): OpenStreetMap Migration

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Install react-leaflet dependencies | High | 1h | - |
| Create OSMMap component | High | 4h | - |
| Create Nominatim search hook | High | 4h | - |
| Replace MapView with OSMMap | High | 4h | - |
| Update LocationInputFilter for OSM | High | 6h | - |
| Test maps across all pages | High | 4h | - |

### Sprint 4 (Week 7-8): Data Automation Foundation

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Create scraper NX library (`libs/scraper`) | High | 2h | - |
| Install dependencies (puppeteer, puppeteer-cluster, commander) | High | 1h | - |
| Implement Puppeteer Cluster manager | High | 4h | - |
| Create base scraper class | Medium | 2h | - |
| Implement rate limiter utility | Medium | 2h | - |

### Sprint 5 (Week 9-10): Google Maps Scraper

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Implement Google Maps search scraper | High | 6h | - |
| Implement Google Maps detail page scraper | High | 4h | - |
| Create data normalizer (scraped → Sanity schema) | High | 4h | - |
| Implement deduplicator (coordinate proximity check) | Medium | 3h | - |
| Create Sanity uploader with image asset support | High | 4h | - |

### Sprint 6 (Week 11-12): TripAdvisor Scraper & CLI

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Implement TripAdvisor review scraper | Medium | 4h | - |
| Implement pagination for multi-page reviews | Medium | 3h | - |
| Build CLI runner with Commander.js | High | 4h | - |
| Add dry-run mode for testing | Medium | 2h | - |
| Create scraper documentation | Medium | 2h | - |

### Sprint 7 (Week 13-14): Production Hardening

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Implement anti-detection techniques | Medium | 4h | - |
| Add comprehensive error handling | High | 4h | - |
| Create data freshness validator | Medium | 4h | - |
| Set up scheduled validation jobs | Low | 4h | - |
| Evaluate Google Places API as legal alternative | Medium | 4h | - |
| Document production deployment options | Medium | 2h | - |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-07 | Keep Google Maps for Sanity CMS | Rich Places API data, limited users |
| 2025-07 | Use OpenStreetMap for public sites | Free, no quotas |
| 2025-07 | Hide auth features for MVP | Not implemented, avoid user confusion |
| 2025-07 | Add structured location fields | Enable proper city/region search |
| 2025-12 | Use Puppeteer Cluster for scraping | Concurrent workers (3-5x faster), built-in retry, memory optimization |
| 2025-12 | Use CONCURRENCY_BROWSER mode | Full isolation between workers for different domains |
| 2025-12 | Create separate NX library for scraper | Clean separation, reusable across projects |
| 2025-12 | Build CLI with Commander.js | Easy to use, supports dry-run mode for testing |
| 2025-12 | Puppeteer for POC, APIs for production | Legal compliance - Google Places API, TripAdvisor Content API |
| 2025-12-01 | Use Nominatim instead of Google Geocoding | Google API key has HTTP referrer restrictions, server-side requests get REQUEST_DENIED |
| 2025-12-01 | Client-side distance calculation | Haversine formula in JS vs geo::distance in GROQ - simpler, no API version concerns |
| 2025-12-01 | URL-based sort state | Enables server-side rendering, bookmarkable URLs, browser back/forward support |

---

## Open Questions

1. ~~**Google Maps API Issue:** What exactly stopped working? API key expired? Quota exceeded? Need to debug.~~ ✅ **RESOLVED (Dec 2025):** Billing was not enabled on the Google Cloud project. Fixed by enabling billing - maps now working.

2. **Authentication Strategy:** When auth is needed, use:
   - NextAuth.js?
   - Sanity's built-in auth?
   - External provider (Auth0, Clerk)?

3. **Review System:** Store reviews in:
   - Sanity (current schema)?
   - Separate database?
   - Third-party service?

4. **Tasting Experience:** What is the intended functionality for `/tasting` route?

---

*This roadmap is a living document. Update as decisions are made and progress is tracked.*
