'use client';

import { useSearchParams } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';

import { useQueryParam } from '../../hooks';
import { CheckboxGroup } from '../checkbox-group/checkbox-group';

export interface CategoryFilterItemProps {
  id: string;
  label: string;
  checked?: boolean;
}

export interface CategoryFilterProps {
  data: CategoryFilterItemProps[];
}

export const CategoryFilter: FunctionComponent<CategoryFilterProps> = ({ data }) => {
  const searchParams = useSearchParams();
  const manf = searchParams?.get('category');
  const [selected, setSelected] = useState<CategoryFilterItemProps[]>(data);
  const { updateQueryparams } = useQueryParam();

  const handleInputChange = (item: CategoryFilterItemProps) => {
    const updatedItems = [...selected];
    const foundItem = updatedItems.find((elem) => elem.id === item.id);
    if (foundItem) {
      foundItem.checked = !foundItem.checked;
    }
    setSelected(updatedItems);
  };

  // if initial query
  useEffect(() => {
    const m = manf?.split(',');
    const updatedItems = [...selected];
    updatedItems.map((elem) => {
      if (m?.includes(elem.id)) elem.checked = true;
    });
    setSelected(updatedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // updates query
  useEffect(() => {
    const checkedItems = [];
    for (const item of selected) {
      if (item.checked) checkedItems.push(item.id);
    }
    updateQueryparams('category', checkedItems.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // reset
  useEffect(() => {
    if (!manf) {
      const updatedItems = [...selected];
      updatedItems.map((elem) => (elem.checked = false));
      setSelected(updatedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manf]);

  return (
    <CheckboxGroup
      label="Categories"
      labelClassName="!text-sm lg:!text-base mb-4 lg:mb-2"
      items={selected}
      onChange={(item: object) => handleInputChange(item as CategoryFilterItemProps)}
    />
  );
};

CategoryFilter.displayName = 'CategoryFilter';
