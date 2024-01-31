import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';

export interface PlacesPageProps {}

const categories = [
  { id: 'breweries', label: 'Breweries' },
  { id: 'pubs', label: 'Pubs' },
  { id: 'beer-gardens', label: 'Beer gardens' },
  { id: 'shops', label: 'Shops' },
];

const PlacesPage: FunctionComponent<PlacesPageProps> = () => (
  <ListWrapper section="beer" categories={categories} />
)

export default PlacesPage;