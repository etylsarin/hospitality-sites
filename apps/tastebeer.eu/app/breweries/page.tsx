import { FunctionComponent } from 'react';
import { ListWrapper } from 'ui-kit';

export interface BreweriesListPageProps {}

const BreweriesListPage: FunctionComponent<BreweriesListPageProps> = () => (
  <ListWrapper title='Breweries' type='brewery' />
)

export default BreweriesListPage;