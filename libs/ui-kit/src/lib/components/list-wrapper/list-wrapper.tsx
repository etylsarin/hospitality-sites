'use client';

import { ListResponse, MapsConfigProps } from 'queries';
import { FunctionComponent, use } from 'react';

import { FilterTopbar } from '../filter-topbar/filter-topbar';
import { Filter } from '../filter/filter';
import { CategoryFilterItemProps } from '../filter/category-filter';
import { ResultsList } from '../results-list/results-list';

export interface ListWrapperProps {
  dataPromise: Promise<ListResponse>;
  categories: CategoryFilterItemProps[];
  maps: MapsConfigProps;
}

export const ListWrapper: FunctionComponent<ListWrapperProps> = ({ dataPromise, categories, maps }) => {
  const data = use(dataPromise);
  return (
    <div className="container-fluid mb-12 pt-6 lg:mb-16">
      <FilterTopbar totalCount={data.length} />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[330px_5fr] 3xl:gap-12">
        <Filter categories={categories} className="hidden xl:block" maps={maps} />
        <ResultsList data={data} />
      </div>
    </div>
  );
}

ListWrapper.displayName = 'ListWrapper';
