import { kebabCase } from 'lodash';
import Link from 'next/link';
import { ListResponse, queryList } from 'queries';
import { FunctionComponent } from 'react';

import { ListCard } from '../list-card/list-card';
import { Section } from '../section/section';
import { SeeMore } from '../see-more/see-more';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { use } = require('react');

export interface ListWrapperProps {
    title: string;
    type: string;
}

export const ListWrapper: FunctionComponent<ListWrapperProps> = ({ title, type }) => {
  const data: ListResponse = use(queryList({ type }));
  const desc = "";
  return (
    <Section
      className="container-fluid mt-12 overflow-hidden lg:mt-16"
      title={title}
      description={desc}
      headerClassName="items-end mb-4 lg:mb-5 xl:mb-6 gap-5"
      rightElement={<SeeMore href="/" />}
    >
      <div>
          {data.map(item => <Link key={item.slug.current} href={`${kebabCase(title)}/${item.slug.current}`}><ListCard {...item} /></Link>)}
      </div>
    </Section>
  );
}
