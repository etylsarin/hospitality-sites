import { defineType } from 'sanity';

import { GeolocationObjectInput } from '../components/geolocation';

export const geolocation = defineType({
    title: 'Location',
    name: 'geolocation',
    type: 'object', 
    components: { input: GeolocationObjectInput },
    fields: [
        {
            title: 'Map',
            name: 'geopoint',
            type: 'geopoint'
        },
        {
            title: 'Address',
            name: 'address',
            type: 'object',
            fields: [
                { name: 'street', type: 'string', title: 'Street' },
                { name: 'streetNumber', type: 'string', title: 'Street Number' },
                { name: 'city', type: 'string', title: 'City' },
                { name: 'postalCode', type: 'string', title: 'Postal Code' },
                { name: 'region', type: 'string', title: 'Region/State' },
                { name: 'country', type: 'string', title: 'Country' },
                { name: 'countryCode', type: 'string', title: 'Country Code', description: 'ISO 3166-1 alpha-2 (e.g., CZ, DE, US)' },
                { name: 'formattedAddress', type: 'string', title: 'Formatted Address', description: 'Full display address' }
            ]
        },
    ],
});
