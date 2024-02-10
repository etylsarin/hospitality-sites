import { MapPinIcon } from '@heroicons/react/24/outline';
import {defineField, defineType} from 'sanity';

export const place = defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  icon: MapPinIcon as any,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    }),
    defineField({
      name: 'domains',
      title: 'Domains',
      type: 'array',
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
      options: {
        predefinedTags: [
          { value: 'breweries', label: 'Breweries' },
          { value: 'pubs', label: 'Pubs' },
          { value: 'beer-gardens', label: 'Beer gardens' },
          { value: 'roasters', label: 'Roasters' },
          { value: 'cafes', label: 'Cafes' },
          { value: 'bakeries', label: 'Bakeries' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geolocation',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'price',
      title: 'Price range',
      type: 'string',
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
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [{type: 'review'}],
    }),
    defineField({
      name: 'established',
      title: 'Established',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown'
    })
  ],
  preview: {
    select: {
      title: 'name',
      images: 'images'
    },
    prepare({ title, images }) {
      return {
        title: title,
        media: images[0]
      }
    }
  },
});
