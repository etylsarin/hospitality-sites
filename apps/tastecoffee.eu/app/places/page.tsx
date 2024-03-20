import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';
import { appConfig } from '../config';

export const metadata = appConfig.metadata;

export interface PlacesPageProps {}

const PlacesPage: FunctionComponent<PlacesPageProps> = () => (
  <ListWrapper domain={appConfig.domain} categories={appConfig.categories} sanity={appConfig.sanity} maps={appConfig.maps} />
)

export default PlacesPage;