import { FunctionComponent, Suspense } from 'react';
import { ListWrapper } from 'ui-kit';
import { appConfig } from '../config';

export const dynamic = 'force-dynamic';
export const metadata = appConfig.metadata;

export interface PlacesPageProps {}

const PlacesPage: FunctionComponent<PlacesPageProps> = () => (
  <Suspense fallback={<div className="container-fluid mb-12 pt-6 lg:mb-16">Loading...</div>}>
    <ListWrapper domain={appConfig.domain} categories={appConfig.categories} sanity={appConfig.sanity} maps={appConfig.maps} />
  </Suspense>
)

export default PlacesPage;