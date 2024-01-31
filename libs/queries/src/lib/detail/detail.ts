import { groq } from 'next-sanity';

import { client } from '../client/client';
import { Review } from '../review/review';
import { Location } from '../location/location';

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
    location: Location;
    description: string;
    images: {
        url: string;
    }[]
}