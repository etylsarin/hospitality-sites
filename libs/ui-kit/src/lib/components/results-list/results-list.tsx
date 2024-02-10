'use client';

import { useSearchParams } from 'next/navigation';
import { FunctionComponent } from "react";
import { Category, ListResponse } from "queries";

import { ListCard } from "../list-card/list-card";
import { LoadMore } from "../load-more/load-more";

import styles from "./results-list.module.scss";

interface ResultsListProps {
    data: ListResponse;
}

export const ResultsList: FunctionComponent<ResultsListProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const selectedCategories = searchParams?.get('category')?.split(',');
  const hasIntersection = (array1: Category[], array2: string[]) => !!array1.filter(item => array2.includes(item.value)).length;
  const filteredData = data.filter(item => selectedCategories ? hasIntersection(item.categories, selectedCategories) : true);
  return (
    <>
      <div className="mt-1 grid grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 lg:grid-cols-3 3xl:gap-y-10 4xl:grid-cols-4">
        {filteredData.length ? filteredData.map(({ slug, ...item }) => (
          <ListCard
            {...item}
            key={slug.current}
            id={slug.current} />
        )) : <div className={styles.noResults}>No results to display</div>}
      </div>
      <LoadMore itemCount={filteredData.length} />
    </>
  );
}

ResultsList.displayName = 'ResultsList';
