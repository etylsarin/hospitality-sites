import { groq } from 'next-sanity';

import { client } from '../client';

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

export interface Review {
    author: string;
    rating: number;
}

export interface ListItem {
    slug: {
        current: string;
    };
    name: string;
    reviews: Review[];
    established: string;
    location: unknown;
    images: {
        url: string;
    }[]
}

export type ListResponse = ListItem[]