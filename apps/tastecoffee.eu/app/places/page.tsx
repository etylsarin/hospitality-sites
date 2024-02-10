import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';
import { appConfig } from '../config';

export interface PlacesPageProps {}

const PlacesPage: FunctionComponent<PlacesPageProps> = () => (
  <ListWrapper domain={appConfig.domain} categories={appConfig.categories} />
)

export default PlacesPage;