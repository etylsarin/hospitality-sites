import { groq } from 'next-sanity';

import { client } from '../../query/client';

export interface QueryDetailParams {
    slug: string;
    type: string;
}

export const queryDetail = async ({ slug, type }: QueryDetailParams) => {
    return await client.fetch(groq`
        *[_type == "place" && $type in tags && slug.current == $slug][0]{
            name,
            image {"url": asset->url}
          }`, { slug, type });
};

export interface DetailResponse {
    name: string;
    image: {
        url: string;
    }
}