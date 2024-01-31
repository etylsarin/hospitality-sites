import { groq } from 'next-sanity';

import { client } from '../client/client';
import { Review } from '../review/review';
import { Location } from '../location/location';

export interface QueryListParams {
    section: string;
}

export const queryList = async ({ section }: QueryListParams) => {
    return await client.fetch(groq`
        *[_type == "place" && $section == sections]{
        slug,
        name,
        reviews,
        established,
        location,
        images[] {"url": asset->url}
        }
    `, { section });
};

export interface ListItem {
    slug: {
        current: string;
    };
    name: string;
    reviews: Review[];
    established: string;
    location: Location;
    images: {
        url: string;
    }[]
}

export type ListResponse = ListItem[]