import { Geopoint } from "@sanity/google-maps-input";

export interface Location {
    geopoint: Geopoint;
    address: string;
};