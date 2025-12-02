import { Geopoint } from "@sanity/google-maps-input";

import { PlaceLocation, StructuredAddress } from '../place/place';

// Re-export types from place.ts for backward compatibility
export type { PlaceLocation, StructuredAddress };

// Legacy Location type for backward compatibility
export interface Location {
    geopoint: Geopoint;
    address: string | StructuredAddress;
}