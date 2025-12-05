import type { Metadata } from 'next';
import { FunctionComponent } from 'react';
import { DetailWrapper } from 'ui-kit';
import { queryDetail } from 'queries';
import { appConfig } from '../../config';

export interface PlaceDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const data = await queryDetail({ slug: resolvedParams.slug, sanity: appConfig.sanity });
    
    const title = data?.name ?? 'Place Details';
    const description = data?.description 
        ? data.description.substring(0, 160) 
        : `Discover ${title} on tastebeer.eu`;
    const imageUrl = data?.images?.[0]?.url ?? '/images/og-image.jpg';

    return {
        ...appConfig.metadata,
        title,
        description,
        openGraph: {
            ...appConfig.metadata.openGraph,
            type: 'article',
            title: `${title} | tastebeer.eu`,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | tastebeer.eu`,
            description,
            images: [imageUrl],
        },
    };
}

const PlaceDetailPage: FunctionComponent<PlaceDetailPageProps> = async props => {
    const params = await props.params;
    return (<DetailWrapper slug={params.slug} sanity={appConfig.sanity} />);
};

export default PlaceDetailPage;
