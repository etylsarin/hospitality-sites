import { Geopoint } from "@sanity/google-maps-input";
import { GeoAddress } from "../geo-address/geo-address";

export interface Location {
    geopoint: Geopoint;
    geoaddress: GeoAddress;
};