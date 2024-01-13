import { Heading, SimpleGrid } from '@chakra-ui/react';
import { kebabCase } from 'lodash';
import Link from 'next/link';
import { ListResponse, queryList } from 'queries';
import { FunctionComponent } from 'react';

import { ListCard } from '../list-card/list-card';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { use } = require('react');

export interface ListWrapperProps {
    title: string;
    type: string;
}

export const ListWrapper: FunctionComponent<ListWrapperProps> = ({ title, type }) => {
  const data: ListResponse = use(queryList({ type }));
  return (
    <>
      <Heading as="h1" size="4xl" noOfLines={1}>{title}</Heading>
      <SimpleGrid minChildWidth='100px' spacing='40px'>
          {data.map(item => <Link key={item.slug.current} href={`${kebabCase(title)}/${item.slug.current}`}><ListCard {...item} /></Link>)}
      </SimpleGrid>
    </>
  );
}
