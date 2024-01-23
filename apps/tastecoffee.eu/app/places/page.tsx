import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';

export interface CafesListPageProps {}

export const categories = [
  { id: 'roaster', label: 'Roaster' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'bakery', label: 'Bakery' },
];

const CafesListPage: FunctionComponent<CafesListPageProps> = () => (
  <ListWrapper section="coffee" categories={categories} />
)

export default CafesListPage;