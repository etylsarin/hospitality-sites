'use client';

import { useSearchParams } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';

import { useQueryParam } from '../../hooks';
import { SelectBox } from '../select-box/select-box';

const options = [
  { label: 'Select distance', disabled: true },
  { label: '20 km' },
  { label: '40 km' },
  { label: '60 km' },
  { label: '80 km' },
  { label: '100 km' },
];

export const DistanceFilter: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const dis = searchParams?.get('distance');
  const { clearFilter, updateQueryparams } = useQueryParam();
  const [selected, setSelected] = useState(options[0]);

  useEffect(() => {
    if (selected.disabled) {
      clearFilter(['distance']);
    } else {
      updateQueryparams('distance', selected.label);
    }
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
      setSelected(options[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setSelected(options[0]);
      }}
    />
  );
};

DistanceFilter.displayName = 'DistanceFilter';
