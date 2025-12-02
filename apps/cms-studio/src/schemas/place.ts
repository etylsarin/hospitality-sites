import { MapPinIcon } from '@heroicons/react/24/outline';
import {defineField, defineType} from 'sanity';

const DAYS_OF_WEEK = [
  { title: 'Monday', value: 'monday' },
  { title: 'Tuesday', value: 'tuesday' },
  { title: 'Wednesday', value: 'wednesday' },
  { title: 'Thursday', value: 'thursday' },
  { title: 'Friday', value: 'friday' },
  { title: 'Saturday', value: 'saturday' },
  { title: 'Sunday', value: 'sunday' },
];

export const place = defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  icon: MapPinIcon as any,
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'offerings', title: 'Offerings & Services' },
    { name: 'hours', title: 'Opening Hours' },
    { name: 'contact', title: 'Contact & Links' },
    { name: 'media', title: 'Media' },
    { name: 'advanced', title: 'Advanced' },
  ],
  fields: [
    // Basic Info Group
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 100,
      },
    }),
    defineField({
      name: 'domains',
      title: 'Domains',
      type: 'array',
      group: 'basic',
      of: [{ type: 'string' }],
      options: {
        list: [
          {title: 'Beer', value: 'beer'},
          {title: 'Coffee', value: 'coffee'},
          {title: 'Vino', value: 'vino'},
          {title: 'Guide', value: 'guide'},
        ]
      }
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'tags',
      group: 'basic',
      options: {
        predefinedTags: [
          { value: 'brewery', label: 'Brewery' },
          { value: 'pub', label: 'Pub' },
          { value: 'beer-garden', label: 'Beer garden' },
          { value: 'roaster', label: 'Roaster' },
          { value: 'cafe', label: 'Cafe' },
          { value: 'bakery', label: 'Bakery' },
          { value: 'bistro', label: 'Bistro' },
          { value: 'restaurant', label: 'Restaurant' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geolocation',
      group: 'basic',
    }),
    defineField({
      name: 'price',
      title: 'Price range',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Low', value: 'low'},
          {title: 'Average', value: 'average'},
          {title: 'High', value: 'high'},
          {title: 'Very high', value: 'very-high'},
        ]
      }
    }),
    defineField({
      name: 'established',
      title: 'Established',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
      group: 'basic',
    }),

    // Offerings & Services Group
    defineField({
      name: 'serving',
      title: 'Serving / Offerings',
      type: 'tags',
      group: 'offerings',
      description: 'What does this place serve?',
      options: {
        predefinedTags: [
          // Coffee
          { value: 'espresso', label: 'Espresso' },
          { value: 'filter-coffee', label: 'Filter Coffee' },
          { value: 'cold-brew', label: 'Cold Brew' },
          { value: 'nitro-coffee', label: 'Nitro Coffee' },
          { value: 'specialty-drinks', label: 'Specialty Drinks' },
          { value: 'decaf', label: 'Decaf Available' },
          { value: 'plant-based-milk', label: 'Plant-based Milk' },
          // Food
          { value: 'breakfast', label: 'Breakfast' },
          { value: 'brunch', label: 'Brunch' },
          { value: 'lunch', label: 'Lunch' },
          { value: 'dinner', label: 'Dinner' },
          { value: 'pastries', label: 'Pastries' },
          { value: 'sandwiches', label: 'Sandwiches' },
          { value: 'salads', label: 'Salads' },
          { value: 'desserts', label: 'Desserts' },
          // Beer
          { value: 'craft-beer', label: 'Craft Beer' },
          { value: 'draft-beer', label: 'Draft Beer' },
          { value: 'bottled-beer', label: 'Bottled Beer' },
          { value: 'house-brew', label: 'House Brew' },
          // Other beverages
          { value: 'wine', label: 'Wine' },
          { value: 'cocktails', label: 'Cocktails' },
          { value: 'non-alcoholic', label: 'Non-alcoholic Options' },
        ],
      },
    }),
    defineField({
      name: 'services',
      title: 'Services & Amenities',
      type: 'tags',
      group: 'offerings',
      options: {
        predefinedTags: [
          // Family & Kids
          { value: 'kids-play-area', label: 'Kids play area' },
          { value: 'outdoor-playground', label: 'Outdoor playground' },
          { value: 'high-chairs', label: 'High Chairs' },
          { value: 'changing-table', label: 'Baby Changing Table' },
          { value: 'kids-menu', label: 'Kids Menu' },
          // Outdoor & Seating
          { value: 'outdoor-seating', label: 'Outdoor seating' },
          { value: 'rooftop', label: 'Rooftop' },
          { value: 'garden', label: 'Garden' },
          // Accessibility
          { value: 'wheelchair-accessible-entrance', label: 'Wheelchair Accessible Entrance' },
          { value: 'wheelchair-accessible-restroom', label: 'Wheelchair Accessible Restroom' },
          { value: 'wheelchair-accessible-seating', label: 'Wheelchair Accessible Seating' },
          // Pet friendly
          { value: 'dog-friendly', label: 'Dog friendly' },
          { value: 'dog-friendly-outdoor', label: 'Dogs allowed (outdoor only)' },
          // Food options
          { value: 'vegan-options', label: 'Vegan options' },
          { value: 'vegetarian-options', label: 'Vegetarian options' },
          { value: 'gluten-free-options', label: 'Gluten-free options' },
          // Tech & Work
          { value: 'wifi', label: 'Free WiFi' },
          { value: 'power-outlets', label: 'Power Outlets' },
          { value: 'laptop-friendly', label: 'Laptop Friendly' },
          { value: 'coworking-friendly', label: 'Coworking Friendly' },
          // Atmosphere
          { value: 'quiet-space', label: 'Quiet Space' },
          { value: 'live-music', label: 'Live Music' },
          { value: 'sports-tv', label: 'Sports TV' },
          // Parking
          { value: 'parking-available', label: 'Parking Available' },
          { value: 'bike-parking', label: 'Bike Parking' },
          // Service options
          { value: 'takeaway', label: 'Takeaway' },
          { value: 'delivery', label: 'Delivery' },
          { value: 'reservations', label: 'Reservations Accepted' },
          { value: 'group-friendly', label: 'Group Friendly' },
          { value: 'private-events', label: 'Private Events' },
        ],
      },
    }),
    defineField({
      name: 'payment_options',
      title: 'Payment options',
      type: 'array',
      group: 'offerings',
      of: [{ type: 'string' }],
      options: {
        list: [
          {title: 'Cash', value: 'cash'},
          {title: 'Card', value: 'card'},
          {title: 'QR code', value: 'qr-code'},
          {title: 'Mobile payments', value: 'mobile-payments'},
          {title: 'Crypto', value: 'crypto'},
        ]
      }
    }),

    // Opening Hours Group
    defineField({
      name: 'openingHours',
      title: 'Opening Hours',
      type: 'object',
      group: 'hours',
      fields: [
        {
          name: 'regular',
          title: 'Regular Hours',
          type: 'array',
          of: [{
            type: 'object',
            name: 'dayHours',
            title: 'Day Hours',
            fields: [
              {
                name: 'day',
                title: 'Day',
                type: 'string',
                options: { list: DAYS_OF_WEEK }
              },
              {
                name: 'isClosed',
                title: 'Closed',
                type: 'boolean',
                initialValue: false,
              },
              {
                name: 'is24Hours',
                title: '24 Hours',
                type: 'boolean',
                initialValue: false,
              },
              {
                name: 'slots',
                title: 'Time Slots',
                type: 'array',
                description: 'Add multiple slots if closed during the day (e.g., lunch break)',
                of: [{
                  type: 'object',
                  name: 'timeSlot',
                  fields: [
                    {
                      name: 'open',
                      title: 'Opens',
                      type: 'string',
                      description: '24h format, e.g. 08:00',
                    },
                    {
                      name: 'close',
                      title: 'Closes',
                      type: 'string',
                      description: '24h format, e.g. 22:00',
                    }
                  ],
                  preview: {
                    select: { open: 'open', close: 'close' },
                    prepare({ open, close }) {
                      return { title: `${open || '?'} - ${close || '?'}` };
                    }
                  }
                }]
              }
            ],
            preview: {
              select: { day: 'day', isClosed: 'isClosed', is24Hours: 'is24Hours', slots: 'slots' },
              prepare({ day, isClosed, is24Hours, slots }) {
                const dayLabel = DAYS_OF_WEEK.find(d => d.value === day)?.title || day;
                let subtitle = 'Not set';
                if (isClosed) subtitle = 'Closed';
                else if (is24Hours) subtitle = '24 hours';
                else if (slots?.length) {
                  subtitle = slots.map((s: { open?: string; close?: string }) => `${s.open}-${s.close}`).join(', ');
                }
                return { title: dayLabel, subtitle };
              }
            }
          }]
        },
        {
          name: 'timezone',
          title: 'Timezone',
          type: 'string',
          initialValue: 'Europe/Prague',
          description: 'IANA timezone identifier',
        },
        {
          name: 'notes',
          title: 'Notes',
          type: 'text',
          rows: 2,
          description: 'e.g., "Kitchen closes at 21:00" or "Last entry 30 min before closing"',
        }
      ]
    }),

    // Contact & Links Group
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.email(),
        },
        {
          name: 'bookingUrl',
          title: 'Booking/Reservation URL',
          type: 'url',
        }
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social & External Links',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'website', type: 'url', title: 'Website' },
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'twitter', type: 'url', title: 'Twitter/X' },
        { name: 'tripadvisor', type: 'url', title: 'TripAdvisor' },
        { name: 'googleMaps', type: 'url', title: 'Google Maps' },
        { name: 'yelp', type: 'url', title: 'Yelp' },
        { name: 'untappd', type: 'url', title: 'Untappd' },
        { name: 'europeanCoffeeTrip', type: 'url', title: 'European Coffee Trip' },
      ]
    }),
    defineField({
      name: 'url',
      title: 'URL (Legacy)',
      type: 'url',
      group: 'contact',
      description: 'Deprecated: Use Social Links → Website instead',
      deprecated: { reason: 'Use socialLinks.website instead' },
    }),

    // Media Group
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      group: 'media',
      of: [{type: 'review'}],
    }),

    // Advanced Group
    defineField({
      name: 'externalIds',
      title: 'External Platform IDs',
      type: 'object',
      group: 'advanced',
      description: 'IDs for external platform integrations (for API use)',
      options: { collapsed: true },
      fields: [
        { name: 'googlePlaceId', type: 'string', title: 'Google Place ID' },
        { name: 'tripadvisorId', type: 'string', title: 'TripAdvisor ID' },
        { name: 'foursquareId', type: 'string', title: 'Foursquare ID' },
        { name: 'yelpId', type: 'string', title: 'Yelp ID' },
        { name: 'untappdVenueId', type: 'string', title: 'Untappd Venue ID' },
      ]
    }),
  ],
  preview: {
    select: {
      title: 'name',
      images: 'images'
    },
    prepare({ title, images }) {
      return {
        title: title,
        media: images?.[0]
      }
    }
  },
});
