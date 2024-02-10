import cfg from '../package.json';

export const appConfig = {
    domain: 'coffee',
    version: cfg.version,
    backgroundImage: '/images/bg.jpg',
    metadata: {
        title: 'tastecoffee.eu',
        description: 'Welcome to tastecoffee.eu',
        // icons: ['/images/logo.svg'],
        viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
    },
    categories: [
        { id: 'roasters', label: 'Roasters' },
        { id: 'cafes', label: 'Cafes' },
        { id: 'bakeries', label: 'Bakeries' },
    ],
}