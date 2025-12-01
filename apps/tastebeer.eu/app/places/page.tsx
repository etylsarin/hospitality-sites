import type { Metadata } from 'next';
import { FunctionComponent, Suspense } from 'react';
import { ListWrapper } from 'ui-kit';
import { queryList, parseSortOption } from 'queries';
import { appConfig } from '../config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...appConfig.metadata,
  title: 'Browse Beer Places',
  description: 'Explore breweries, pubs, beer gardens, and shops. Find the perfect beer destination for your next visit.',
  openGraph: {
    ...appConfig.metadata.openGraph,
    title: 'Browse Beer Places | tastebeer.eu',
    description: 'Explore breweries, pubs, beer gardens, and shops. Find the perfect beer destination for your next visit.',
  },
};

export interface PlacesPageProps {
  searchParams: Promise<{ location?: string; sort?: string }>;
}

const PlacesPage: FunctionComponent<PlacesPageProps> = async ({ searchParams }) => {
  const { location, sort } = await searchParams;
  const sortBy = parseSortOption(sort);
  
  const dataPromise = queryList({ 
    domain: appConfig.domain, 
    sanity: appConfig.sanity, 
    locationQuery: location,
    sortBy,
  });
  
  return (
    <Suspense fallback={<div className="container-fluid mb-12 pt-6 lg:mb-16">Loading...</div>}>
      <ListWrapper 
        dataPromise={dataPromise} 
        categories={appConfig.categories} 
        maps={appConfig.maps}
        currentSort={sortBy}
      />
    </Suspense>
  );
}

export default PlacesPage;