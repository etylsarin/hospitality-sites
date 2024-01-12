import Link from 'next/link';

import { client } from '../client';

const getData = async () => {
    return await client.fetch(`
        *[_type == "place"]
    `);
};

interface BreweryListDataProps {
    slug: {
        current: string;
    };
    name: string;
}

const BreweriesListPage = async () => {
  const data: BreweryListDataProps[] = await getData();
  return (
    <>
        <h1>Breweries</h1>
        <ul>
            {data.map(item => <li key={item.slug.current}><Link href={`breweries/${item.slug.current}`}>{item.name}</Link></li>)}
        </ul>
    </>
  );
}

export default BreweriesListPage;