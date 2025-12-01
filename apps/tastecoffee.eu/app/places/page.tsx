import type { Metadata } from 'next';
import { FunctionComponent, Suspense } from 'react';
import { ListWrapper } from 'ui-kit';
import { queryList } from 'queries';
import { appConfig } from '../config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...appConfig.metadata,
  title: 'Browse Coffee Places',
  description: 'Explore roasters, cafes, and bakeries. Find the perfect coffee destination for your next visit.',
  openGraph: {
    ...appConfig.metadata.openGraph,
    title: 'Browse Coffee Places | tastecoffee.eu',
    description: 'Explore roasters, cafes, and bakeries. Find the perfect coffee destination for your next visit.',
  },
};

export interface PlacesPageProps {
  searchParams: Promise<{ location?: string }>;
}

const PlacesPage: FunctionComponent<PlacesPageProps> = async ({ searchParams }) => {
  const { location } = await searchParams;
  const dataPromise = queryList({ domain: appConfig.domain, sanity: appConfig.sanity, locationQuery: location });
  
  return (
    <Suspense fallback={<div className="container-fluid mb-12 pt-6 lg:mb-16">Loading...</div>}>
      <ListWrapper dataPromise={dataPromise} categories={appConfig.categories} maps={appConfig.maps} />
    </Suspense>
  );
}

export default PlacesPage;