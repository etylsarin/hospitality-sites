import cfg from '../package.json';

export const appConfig = {
    domain: 'coffee',
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
        title: 'tastecoffee.eu',
        description: 'Welcome to tastecoffee.eu',
        icons: {
            icon: '/icon.png',
        },
        viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
    },
    categories: [
        { id: 'roasters', label: 'Roasters' },
        { id: 'cafes', label: 'Cafes' },
        { id: 'bakeries', label: 'Bakeries' },
    ],
}