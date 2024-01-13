import Link from 'next/link';
import { ListGrid, ListCard, PageHeading } from 'ui-kit';

import { ListResponse, queryList } from '../query';

const BreweriesListPage = async () => {
  const data: ListResponse = await queryList({ type: 'brewery' });
  return (
    <>
        <PageHeading>Breweries</PageHeading>
        <ListGrid>
            {data.map(item => <Link key={item.slug.current} href={`breweries/${item.slug.current}`}><ListCard {...item} /></Link>)}
        </ListGrid>
    </>
  );
}

export default BreweriesListPage;