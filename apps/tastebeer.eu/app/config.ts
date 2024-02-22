import cfg from '../package.json';

export const appConfig = {
    domain: 'beer',
    version: cfg.version,
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
        title: 'tastebeer.eu',
        description: 'Welcome to tastebeer.eu',
        // icons: ['/images/logo.svg'],
        viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
    },
    categories: [
        { id: 'breweries', label: 'Breweries' },
        { id: 'pubs', label: 'Pubs' },
        { id: 'beer-gardens', label: 'Beer gardens' },
        { id: 'shops', label: 'Shops' },
    ],
}