import { groq } from 'next-sanity';

import { SanityConfigProps, client } from '../client/client';
import { geocodeLocation, GeocodingResult } from '../geocoding/geocoding';
import { SortOption, getOrderClause } from '../sort/sort';
import { calculateDistance } from '../geo/distance';
import { PlaceListItem } from '../place/place';

export interface QueryListParams {
    domain: string;
    sanity: SanityConfigProps;
    locationQuery?: string;
    sortBy?: SortOption;
}

export interface GeoSearchResult {
    items: PlaceListItem[];
    geocodedLocation: GeocodingResult | null;
}

// GROQ projection for list items - fetches fields needed for list/card views
const LIST_PROJECTION = `{
    _id,
    _createdAt,
    slug,
    name,
    reviews,
    categories,
    serving,
    services,
    price,
    established,
    location,
    openingHours,
    images[] {"url": asset->url}
}`;

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

        const rawItems = await client(sanity).fetch<PlaceListItem[]>(groq`
            *[_type == "place" 
              && $domain in domains
              && defined(location.geopoint)
              && location.geopoint.lat >= $swLat
              && location.geopoint.lat <= $neLat
              && location.geopoint.lng >= $swLng
              && location.geopoint.lng <= $neLng
            ] ${orderClause} ${LIST_PROJECTION}
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
    
    const items = await client(sanity).fetch<PlaceListItem[]>(groq`
        *[_type == "place" && $domain in domains] ${orderClause} ${LIST_PROJECTION}
    `, { domain });

    return { items, geocodedLocation: null };
};

// Re-export types for backward compatibility
export type ListItem = PlaceListItem;
export type ListResponse = PlaceListItem[];