import { memoize } from 'lodash/fp';
import { createClient, type SanityClient } from 'next-sanity';

export interface SanityConfigProps {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export const sanityClient = ({ projectId, dataset, apiVersion }: SanityConfigProps): SanityClient => createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const client = memoize(sanityClient);
