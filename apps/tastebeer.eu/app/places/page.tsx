import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';

export interface BreweriesListPageProps {}

const categories = [
  { id: 'brewery', label: 'Brewery' },
  { id: 'pub', label: 'Pub' },
  { id: 'beer-garden', label: 'Beer garden' },
];

const BreweriesListPage: FunctionComponent<BreweriesListPageProps> = () => (
  <ListWrapper section="beer" categories={categories} />
)

export default BreweriesListPage;