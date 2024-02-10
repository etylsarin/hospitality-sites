import cfg from '../package.json';

export const appConfig = {
    domain: 'beer',
    version: cfg.version,
    backgroundImage: '/images/bg.jpg',
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