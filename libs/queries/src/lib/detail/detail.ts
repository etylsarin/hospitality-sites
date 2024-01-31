import { groq } from 'next-sanity';

import type { Geopoint } from '@sanity/google-maps-input';

import { client } from '../client/client';
import { Review } from '../review/review';
import { GeoAddress } from '../geo-address/geo-address';

export interface QueryDetailParams {
    slug: string;
}

export const queryDetail = async ({ slug }: QueryDetailParams) => {
    return await client.fetch(groq`
        *[_type == "place" && slug.current == $slug][0]{
            name,
            reviews,
            established,
            location,
            description,
            images[] {"url": asset->url}
          }`, { slug });
};

export interface DetailResponse {
    name: string;
    reviews: Review[];
    established: string;
    location: {
        geopoint: Geopoint;
        geoaddress: GeoAddress;
    };
    description: string;
    images: {
        url: string;
    }[]
}