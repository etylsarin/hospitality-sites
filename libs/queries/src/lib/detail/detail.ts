import { groq } from 'next-sanity';

import { SanityConfigProps, client } from '../client/client';
import { Review } from '../review/review';
import { Location } from '../location/location';
import { Price } from '../price/price';

export interface QueryDetailParams {
    slug: string;
    sanity: SanityConfigProps;
}

export const queryDetail = async ({ slug, sanity }: QueryDetailParams) => {
    return await client(sanity).fetch(groq`
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
    price: Price;
    established: string;
    location: Location;
    description: string;
    images: {
        url: string;
    }[]
}