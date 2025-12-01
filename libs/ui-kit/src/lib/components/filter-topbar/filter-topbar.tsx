'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunctionComponent, useCallback, useMemo } from 'react';
import type { SortOption } from 'queries';

import { Button } from '../button/button';
import { drawerStateAtom } from '../drawers/view';
import { SelectBox } from '../select-box/select-box';
import { Text } from '../text/text';


type SortingOptionItem = { id: SortOption; label: string; checked: boolean };

const sortingOptions: SortingOptionItem[] = [
  { id: 'distance', label: 'Distance', checked: false },
  { id: 'recently-added', label: 'Recently Added', checked: false },
  { id: 'rating', label: 'Highest Rated', checked: false },
  { id: 'name', label: 'Name (A-Z)', checked: false },
  { id: 'established', label: 'Newest Established', checked: false },
];

const defaultSortingOption: SortingOptionItem = { id: 'distance', label: 'Distance', checked: true };

export interface FilterTopbarProps {
  totalCount: number;
  searchLocation?: string;
  currentSort?: SortOption;
}

export const FilterTopbar: FunctionComponent<FilterTopbarProps> = ({ 
  totalCount, 
  searchLocation,
  currentSort = 'distance'
}) => {
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Find the current selected option based on URL param
  const selected = useMemo((): SortingOptionItem => {
    const option = sortingOptions.find(opt => opt.id === currentSort);
    return option ? { ...option, checked: true } : { ...defaultSortingOption, checked: true };
  }, [currentSort]);

  const handleSortChange = useCallback((data: { id: string; label: string; checked: boolean; [key: string]: unknown }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Set or update the sort parameter
    if (data.id === 'distance') {
      // Distance is default, remove param if it's selected
      params.delete('sort');
    } else {
      params.set('sort', data.id);
    }
    
    // Navigate to the new URL
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname);
  }, [router, searchParams]);

  return (
    <div className="mb-8 flex items-center justify-between">
      <Text className="text-sm font-bold text-gray-dark md:text-base">
        {searchLocation ? (
          <>
            {totalCount} places near{' '}
            <Text className="font-normal text-gray" tag="span">
              {searchLocation}
            </Text>
          </>
        ) : (
          <>
            Showing 1 - {totalCount}{' '}
            <Text className="font-normal text-gray" tag="span">
              out of {totalCount} Places
            </Text>
          </>
        )}
      </Text>
      <Button
        variant="text"
        type="button"
        className="!p-0 focus:!ring-0 xl:hidden"
        onClick={() =>
          setDrawerState({
            ...drawerSate,
            isOpen: true,
            placement: 'right',
            view: 'FILTER_MENU',
          })
        }
      >
        <AdjustmentsHorizontalIcon className="h-auto w-6 lg:w-7" />
      </Button>
      <SelectBox
        value={selected}
        label="Sort by:"
        variant="outline"
        options={sortingOptions}
        optionIcon={false}
        arrowIconClassName="!right-2"
        labelClassName="flex-shrink-0"
        className="hidden items-center gap-3 capitalize xl:flex md:[&>li]:!text-base"
        optionsContainerClassName="max-w-[200px] right-0 md:[&>li]:!text-base"
        buttonClassName="!px-4 !py-2 flex justify-between w-full text-base cursor-pointer !pr-10"
        onChange={handleSortChange}
      />
    </div>
  );
}

FilterTopbar.displayName = 'FilterTopbar';
