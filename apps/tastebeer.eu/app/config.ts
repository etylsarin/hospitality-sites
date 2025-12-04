import type { Metadata } from 'next';
import cfg from '../package.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tastebeer.eu';

export const appConfig = {
    domain: 'beer',
    version: cfg.version,
    siteUrl,
    backgroundImage: '/images/bg.jpg',
    sanity: {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
        dataset: process.env.SANITY_STUDIO_DATASET as string,
        apiVersion: '2024-01-24',      
    },
    maps: {
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string,
    },
    metadata: {
        title: {
            default: 'tastebeer.eu - Discover the Best Beer Places',
            template: '%s | tastebeer.eu',
        },
        description: 'Discover the best breweries, pubs, beer gardens, and shops across Europe. Find craft beer destinations near you.',
        icons: {
            icon: '/icon.png',
        },
        metadataBase: new URL(siteUrl),
        openGraph: {
            type: 'website',
            locale: 'en_US',
            siteName: 'tastebeer.eu',
            images: [
                {
                    url: '/images/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'tastebeer.eu - Discover the Best Beer Places across Europe',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image' as const,
        },
        robots: {
            index: true,
            follow: true,
        },
    } satisfies Metadata,
    viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
    categories: [
        { id: 'breweries', label: 'Breweries' },
        { id: 'pubs', label: 'Pubs' },
        { id: 'beer-gardens', label: 'Beer gardens' },
        { id: 'shops', label: 'Shops' },
    ],
    menuItems: [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'discover', label: 'Discover', path: '/places' },
        { id: 'tasting', label: 'Tasting', path: '/tasting' },
        { id: 'styles', label: 'Styles', path: '/styles' },
    ],
};

export const getSiteTitle = () => 
    typeof appConfig.metadata.title === 'string' 
        ? appConfig.metadata.title 
        : appConfig.metadata.title.default;