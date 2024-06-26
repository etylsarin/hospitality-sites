import { googleMapsInput } from '@sanity/google-maps-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { markdownSchema } from 'sanity-plugin-markdown';
import { tags } from 'sanity-plugin-tags';

import { schemaTypes } from './src';

export default defineConfig({
  name: 'hospitality-sites',
  title: 'CMS for Next.js hospitality sites',
  basePath: '/cms-studio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,
  plugins: [
    tags(),
    markdownSchema(),
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
