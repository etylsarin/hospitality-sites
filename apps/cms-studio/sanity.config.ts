import {googleMapsInput} from '@sanity/google-maps-input';
import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';

import {schemaTypes} from './src';

export default defineConfig({
  name: 'default',
  title: 'hospitality-sites',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,

  plugins: [
    deskTool(),
    visionTool(),
    googleMapsInput({
      apiKey: process.env.SANITY_STUDIO_GMAPS_API_KEY as string,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
