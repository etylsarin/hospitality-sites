import { groq } from 'next-sanity';

import { client } from '../../query/client';

export interface QueryListParams {
    type: string;
}

export const queryList = async ({ type }: QueryListParams) => {
    return await client.fetch(groq`
        *[_type == "place" && $type in tags]{
        slug,
        name,
        reviews,
        established,
        image {"url": asset->url}
        }
    `, { type });
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
    image: {
        url: string;
    }
}

export type ListResponse = ListItem[]