import { groq } from 'next-sanity';

import { SanityConfigProps, client } from '../client/client';
import { Review } from '../review/review';
import { Location } from '../location/location';
import { Price } from '../price/price';
import { Category } from '../category/category';
import { geocodeLocation, GeocodingResult } from '../geocoding/geocoding';
import { SortOption, getOrderClause } from '../sort/sort';
import { calculateDistance } from '../geo/distance';

export interface QueryListParams {
    domain: string;
    sanity: SanityConfigProps;
    locationQuery?: string;
    sortBy?: SortOption;
}

export interface GeoSearchResult {
    items: ListItem[];
    geocodedLocation: GeocodingResult | null;
}

export const queryList = async ({ domain, sanity, locationQuery = '', sortBy = 'distance' }: QueryListParams): Promise<GeoSearchResult> => {
    // If location query provided, geocode it server-side using Nominatim (no API key needed)
    let geocodedLocation: GeocodingResult | null = null;
    
    if (locationQuery) {
        geocodedLocation = await geocodeLocation(locationQuery);
    }

    // If we have geocoded coordinates, use geo-based query
    if (geocodedLocation) {
        const { bounds, center } = geocodedLocation;
        const orderClause = getOrderClause(sortBy);

        const rawItems = await client(sanity).fetch<ListItem[]>(groq`
            *[_type == "place" 
              && $domain in domains
              && defined(location.geopoint)
              && location.geopoint.lat >= $swLat
              && location.geopoint.lat <= $neLat
              && location.geopoint.lng >= $swLng
              && location.geopoint.lng <= $neLng
            ] ${orderClause} {
              slug,
              name,
              reviews,
              categories,
              price,
              established,
              location,
              _createdAt,
              images[] {"url": asset->url}
            }
        `, {
            domain,
            swLat: bounds.southwest.lat,
            swLng: bounds.southwest.lng,
            neLat: bounds.northeast.lat,
            neLng: bounds.northeast.lng,
        });

        // Calculate distance from center
        const itemsWithDistance = rawItems.map((item) => ({
            ...item,
            distance: item.location?.geopoint
                ? calculateDistance(
                      center.lat,
                      center.lng,
                      item.location.geopoint.lat,
                      item.location.geopoint.lng
                  )
                : undefined,
        }));

        // Sort by distance if that's the selected sort option
        const items = sortBy === 'distance'
            ? itemsWithDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
            : itemsWithDistance;

        return { items, geocodedLocation };
    }

    // Fallback: no location query - fetch all with sorting
    const orderClause = sortBy === 'distance' ? '| order(_createdAt desc)' : getOrderClause(sortBy);
    
    const items = await client(sanity).fetch<ListItem[]>(groq`
        *[_type == "place" && $domain in domains] ${orderClause} {
          slug,
          name,
          reviews,
          categories,
          price,
          established,
          location,
          _createdAt,
          images[] {"url": asset->url}
        }
    `, { domain });

    return { items, geocodedLocation: null };
};

export interface ListItem {
    slug: {
        current: string;
    };
    name: string;
    price: Price;
    reviews: Review[];
    categories: Category[];
    established: string;
    location: Location;
    distance?: number; // Distance in meters from search center
    _createdAt?: string;
    images: {
        url: string;
    }[]
}

export type ListResponse = ListItem[]