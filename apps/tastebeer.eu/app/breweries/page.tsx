import Link from 'next/link';
import { ListGrid, ListCard, PageHeading } from 'ui-kit';

import { client } from '../client';

const getData = async () => {
    return await client.fetch(`
      *[_type == "place"]{
        slug,
        name,
        stars,
        image {"url": asset->url}
      }
    `);
};

interface BreweryListDataProps {
    slug: {
        current: string;
    };
    name: string;
    stars: number;
    image: {
        url: string;
    }
}

const BreweriesListPage = async () => {
  const data: BreweryListDataProps[] = await getData();
  return (
    <>
        <PageHeading>Breweries</PageHeading>
        <ListGrid>
            {data.map(item => <Link key={item.slug.current} href={`breweries/${item.slug.current}`}><ListCard title={item.name} imageUrl={item.image.url} stars={item.stars} /></Link>)}
        </ListGrid>
    </>
  );
}

export default BreweriesListPage;