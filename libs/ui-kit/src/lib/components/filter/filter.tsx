'use client';

import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';

import { Button } from '../button/button';
import { drawerStateAtom } from '../drawers/view';
import { Text } from '../text/text';

import { CategoryFilter, CategoryFilterItemProps } from './category-filter';
import { DistanceFilter } from './distance-filter';
import { LocationInputFilter } from './location-input-filter';
import { MapsConfigProps } from 'queries';

interface FilterProps {
  categories: CategoryFilterItemProps[];
  maps: MapsConfigProps;
  className?: string;
}

export const Filter: FunctionComponent<FilterProps> = ({ categories, className, maps }) => {
  const router = useRouter();
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  const searchParams = useSearchParams();
  const params = searchParams?.toString();
  const [state, setState] = useState(false);

  // reset button true or false
  useEffect(() => {
    if (params) {
      setState(true);
    } else {
      setState(false);
    }
  }, [params]);

  return (
    <div
      className={clsx('h-full overflow-y-auto bg-white xl:px-0.5', className)}
    >
      <div className="mb-4 flex items-center justify-between px-5 py-2 pt-3 uppercase md:px-7 xl:px-0 xl:pt-0">
        <Text tag="h5" className="leading-8">
          Filter
        </Text>
        {state && (
          <Button
            type="reset"
            variant="text"
            className="hidden !p-0 text-base text-gray focus:!ring-0 sm:block"
            onClick={() => router.push('/places')}
          >
            Reset
          </Button>
        )}
        <Button
          type="reset"
          variant="text"
          className="!p-0 text-base text-gray focus:!ring-0 sm:hidden"
          onClick={() =>
            setDrawerState({
              ...drawerSate,
              isOpen: false,
            })
          }
        >
          Close
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 px-5 pb-3 md:px-7 xl:p-0 xl:pb-0">
        <LocationInputFilter maps={maps} />
        <CategoryFilter data={categories} />
        <DistanceFilter />
      </div>
      <div className="sticky inset-x-0 bottom-0 z-10 mt-4 flex items-center justify-between bg-white px-5 py-3 uppercase shadow-card sm:hidden md:px-7 xl:px-0">
        <div>
          {state && (
            <Button
              type="reset"
              variant="text"
              className="!p-0 text-base text-gray underline focus:!ring-0"
              onClick={() => router.push('/places')}
            >
              Reset
            </Button>
          )}
        </div>
        <Button
          variant="solid"
          rounded="DEFAULT"
          size="xl"
          className="!px-4 font-semibold"
          onClick={() =>
            setDrawerState({
              ...drawerSate,
              isOpen: false,
            })
          }
        >
          Show Items
        </Button>
      </div>
    </div>
  );
}

Filter.displayName = 'Filter';
