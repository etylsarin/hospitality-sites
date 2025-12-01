'use client';

import { useSearchParams } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';

import { useQueryParam } from '../../hooks';
import { SelectBox } from '../select-box/select-box';

type DistanceOption = { label: string; disabled?: boolean };

const options: DistanceOption[] = [
  { label: 'Select distance', disabled: true },
  { label: '20 km' },
  { label: '40 km' },
  { label: '60 km' },
  { label: '80 km' },
  { label: '100 km' },
];

const defaultOption: DistanceOption = { label: 'Select distance', disabled: true };

export const DistanceFilter: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const dis = searchParams?.get('distance');
  const { clearFilter, updateQueryparams } = useQueryParam();
  const [selected, setSelected] = useState<DistanceOption>(defaultOption);

  useEffect(() => {
    if (selected.disabled) {
      clearFilter(['distance']);
    } else {
      updateQueryparams('distance', selected.label);
    }
    // Intentionally excluding clearFilter and updateQueryparams to avoid infinite loops
    // These functions are stable references from useQueryParam hook
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // sets the state if in url
  useEffect(() => {
    if (dis) {
      const d = options.find((item) => item.label === dis);
      if (d) {
        setSelected(d);
      }
    } else {
      setSelected(defaultOption);
    }
  }, [dis]);

  return (
    <SelectBox
      value={selected}
      label="Distance"
      options={options}
      onChange={(data) => setSelected(data)}
      labelClassName="mb-2 !text-sm lg:!text-base"
      buttonClassName="h-10 lg:h-11 2xl:h-12"
      clearable={selected.disabled ? false : true}
      onClearClick={(e) => {
        e.stopPropagation();
        setSelected(defaultOption);
      }}
    />
  );
};

DistanceFilter.displayName = 'DistanceFilter';
