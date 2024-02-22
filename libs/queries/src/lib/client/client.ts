import { memoize } from 'lodash/fp';
import { createClient } from 'next-sanity';

export interface SanityConfigProps {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export const sanityClient = ({ projectId, dataset, apiVersion }: SanityConfigProps) => createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const client = memoize(sanityClient);
