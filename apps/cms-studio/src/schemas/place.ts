// import { MapPinIcon } from '@heroicons/react/24/outline';
import {defineField, defineType} from 'sanity';

export const place = defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
//  icon: MapPinIcon as any,
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
      name: 'sections',
      title: 'Sections',
      type: 'string',
      options: {
        list: [
          {title: 'Beer', value: 'beer'},
          {title: 'Coffee', value: 'coffee'}
        ]
      }
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
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
  ],
  preview: {
    select: {title: 'name', media: 'images.0'},
  },
});
