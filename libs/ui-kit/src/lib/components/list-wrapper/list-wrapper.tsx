'use client';

import { ListResponse, MapsConfigProps, SanityConfigProps, queryList } from 'queries';
import { FunctionComponent } from 'react';
import { useSearchParams } from 'next/navigation';

import { FilterTopbar } from '../filter-topbar/filter-topbar';
import { Filter } from '../filter/filter';
import { CategoryFilterItemProps } from '../filter/category-filter';
import { ResultsList } from '../results-list/results-list';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { use } = require('react');

export interface ListWrapperProps {
  domain: string;
  categories: CategoryFilterItemProps[];
  sanity: SanityConfigProps;
  maps: MapsConfigProps;
}

export const ListWrapper: FunctionComponent<ListWrapperProps> = ({ categories, domain, sanity, maps }) => {
  const searchParams = useSearchParams();
  const locationQuery = searchParams.get('location') || undefined;

  // console.log('APP_CONFIG', sanity, maps);
  
  const data: ListResponse = use(queryList({ domain, sanity, locationQuery }));
  return (
    <div className="container-fluid mb-12 pt-6 lg:mb-16" data-config-sanity={sanity.projectId} data-config-maps={maps.apiKey}>
      <FilterTopbar totalCount={data.length} />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[330px_5fr] 3xl:gap-12">
        <Filter categories={categories} className="hidden xl:block" maps={maps} />
        <ResultsList data={data} />
      </div>
    </div>
  );
}

ListWrapper.displayName = 'ListWrapper';
