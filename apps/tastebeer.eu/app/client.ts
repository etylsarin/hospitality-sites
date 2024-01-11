import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,
  apiVersion: '2024-01-11',
  useCdn: false,
});