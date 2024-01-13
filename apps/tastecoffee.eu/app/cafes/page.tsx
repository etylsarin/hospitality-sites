import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';

export interface CafesListPageProps {}

const CafesListPage: FunctionComponent<CafesListPageProps> = () => (
  <ListWrapper title='Cafés' type='cafe' />
)

export default CafesListPage;