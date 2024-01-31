import { defineType } from 'sanity';

import { Geolocation } from '../components/geolocation';

export const geolocation = defineType({
    title: 'Location',
    name: 'geolocation',
    type: 'object', 
    components: { input: Geolocation },
    fields: [
        {
            title: 'Map',
            name: 'geopoint',
            type: 'geopoint'
        },
        {
            title: 'Address',
            name: 'geoaddress',
            type: 'object',
            fields: [
                {
                    title: 'Address',
                    name: 'address',
                    type: 'string',
                    hidden: true,
                },
                {
                    title: 'City',
                    name: 'city',
                    type: 'string',
                    hidden: true,
                },
                {
                    title: 'Country',
                    name: 'country',
                    type: 'string',
                    hidden: true,
                },
            ],
        },
    ],
});
