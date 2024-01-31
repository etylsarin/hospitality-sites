import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';

export interface PlacesPageProps {}

const categories = [
  { id: 'roasters', label: 'Roasters' },
  { id: 'cafes', label: 'Cafes' },
  { id: 'bakeries', label: 'Bakeries' },
];

const PlacesPage: FunctionComponent<PlacesPageProps> = () => (
  <ListWrapper section="coffee" categories={categories} />
)

export default PlacesPage;