'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { FunctionComponent, useState } from 'react';

import { Button } from '../button/button';
import { drawerStateAtom } from '../drawers/view';
import { SelectBox } from '../select-box/select-box';
import { Text } from '../text/text';


const sortingOptions = [
  { id: 'opt-1', label: 'Recently listed', checked: true },
  { id: 'opt-1', label: 'Previous listed', checked: true },
  { id: 'opt-1', label: 'Newer listed', checked: true },
];

export interface FilterTopbarProps {
  totalCount: number;
}

export const FilterTopbar: FunctionComponent<FilterTopbarProps> = ({ totalCount }) => {
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  const [selected, setSelected] = useState(sortingOptions[0]);
  return (
    <div className="mb-8 flex items-center justify-between">
      <Text className="text-sm font-bold text-gray-dark md:text-base">
        Showing 1 - {totalCount}{' '}
        <Text className="font-normal text-gray" tag="span">
          out of {totalCount} Places{' '}
        </Text>
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
        optionsContainerClassName="max-w-[166px] right-0 md:[&>li]:!text-base"
        buttonClassName="!px-4 !py-2 flex justify-between w-full text-base cursor-pointer !pr-10"
        onChange={(data: { [key: string]: unknown; id: string; checked: boolean; label: string; }) => setSelected(data)}
      />
    </div>
  );
}

FilterTopbar.displayName = 'FilterTopbar';
