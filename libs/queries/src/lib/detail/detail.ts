import { groq } from 'next-sanity';

import { SanityConfigProps, client } from '../client/client';
import { PlaceDetail } from '../place/place';

export interface QueryDetailParams {
    slug: string;
    sanity: SanityConfigProps;
}

// GROQ projection for detail view - fetches all fields
const DETAIL_PROJECTION = `{
    _id,
    _createdAt,
    _updatedAt,
    name,
    slug,
    domains,
    categories,
    location,
    price,
    established,
    description,
    serving,
    services,
    "paymentOptions": payment_options,
    openingHours,
    contact,
    socialLinks,
    url,
    reviews,
    externalIds,
    images[] {"url": asset->url}
}`;

export const queryDetail = async ({ slug, sanity }: QueryDetailParams): Promise<PlaceDetail | null> => {
    return await client(sanity).fetch<PlaceDetail | null>(groq`
        *[_type == "place" && slug.current == $slug][0] ${DETAIL_PROJECTION}
    `, { slug });
};

// Re-export type for backward compatibility
export type DetailResponse = PlaceDetail;