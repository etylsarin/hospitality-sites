import { ListResponse, queryList } from 'queries';
import { FunctionComponent } from 'react';

import { ListCard } from '../list-card/list-card';
import { LoadMore } from '../load-more/load-more';
import { FilterTopbar } from '../filter-topbar/filter-topbar';
import { Filter } from '../filter/filter';
import { CategoryFilterItemProps } from '../filter/category-filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { use } = require('react');

export interface ListWrapperProps {
  section: string;
  categories: CategoryFilterItemProps[];
}

export const ListWrapper: FunctionComponent<ListWrapperProps> = ({ categories, section }) => {
  const data: ListResponse = use(queryList({ section }));

  return (
    <div className="container-fluid mb-12 pt-6 lg:mb-16">
      <FilterTopbar />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[330px_5fr] 3xl:gap-12">
        <Filter categories={categories} className="hidden xl:block" />
        <div>
          <div className="mt-1 grid grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 lg:grid-cols-3 3xl:gap-y-10 4xl:grid-cols-4">
            {data.map(({ slug, ...item}) => (
              <ListCard
                {...item}
                key={slug.current}
                id={slug.current}
              />
            ))}
          </div>
          <LoadMore itemCount={data.length} />
        </div>
      </div>
    </div>
  );
}

ListWrapper.displayName = 'ListWrapper';
