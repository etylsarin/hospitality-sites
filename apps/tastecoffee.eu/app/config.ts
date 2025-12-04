import type { Metadata } from 'next';
import cfg from '../package.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tastecoffee.eu';

export const appConfig = {
    domain: 'coffee',
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
            default: 'tastecoffee.eu - Discover the Best Coffee Places',
            template: '%s | tastecoffee.eu',
        },
        description: 'Discover the best roasters, cafes, and bakeries across Europe. Find specialty coffee destinations near you.',
        icons: {
            icon: '/icon.png',
        },
        metadataBase: new URL(siteUrl),
        openGraph: {
            type: 'website',
            locale: 'en_US',
            siteName: 'tastecoffee.eu',
            images: [
                {
                    url: '/images/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'tastecoffee.eu - Discover the Best Coffee Places across Europe',
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
        { id: 'roasters', label: 'Roasters' },
        { id: 'cafes', label: 'Cafes' },
        { id: 'bakeries', label: 'Bakeries' },
    ],
    menuItems: [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'discover', label: 'Discover', path: '/places' },
        { id: 'tasting', label: 'Tasting', path: '/tasting' },
        { id: 'drinks', label: 'Drinks', path: '/drinks' },
    ],
};

export const getSiteTitle = () => 
    typeof appConfig.metadata.title === 'string' 
        ? appConfig.metadata.title 
        : appConfig.metadata.title.default;