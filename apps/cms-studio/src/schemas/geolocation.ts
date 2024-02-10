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
            type: 'string',
        },
    ],
});
