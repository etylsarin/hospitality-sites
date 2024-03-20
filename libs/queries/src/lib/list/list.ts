import { groq } from 'next-sanity';

import { SanityConfigProps, client } from '../client/client';
import { Review } from '../review/review';
import { Location } from '../location/location';
import { Price } from '../price/price';
import { Category } from '../category/category';

export interface QueryListParams {
    domain: string;
    sanity: SanityConfigProps;
    locationQuery?: string;
}

export const queryList = async ({ domain, sanity, locationQuery = '' }: QueryListParams) => {
    return await client(sanity).fetch(groq`
        *[_type == "place" && $domain in domains && location.address match "${locationQuery}*"]{
        slug,
        name,
        reviews,
        categories,
        price,
        established,
        location,
        images[] {"url": asset->url}
        }
    `, { domain, locationQuery });
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
    images: {
        url: string;
    }[]
}

export type ListResponse = ListItem[]