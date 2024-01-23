import { groq } from 'next-sanity';

import { client } from '../client';

export interface QueryDetailParams {
    slug: string;
}

export const queryDetail = async ({ slug }: QueryDetailParams) => {
    return await client.fetch(groq`
        *[_type == "place" && slug.current == $slug][0]{
            name,
            images[] {"url": asset->url}
          }`, { slug });
};

export interface DetailResponse {
    name: string;
    images: {
        url: string;
    }[]
}