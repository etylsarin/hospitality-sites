'use client';

import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { Checkbox } from '../form-fields';
import { Text } from '../text/text';

interface CheckboxProps {
  items: { id: string; label: string; checked?: boolean }[];
  label: string;
  labelClassName?: string;
  onChange: (_selected: object) => void;
}

export const CheckboxGroup: FunctionComponent<CheckboxProps> = ({
  items,
  label,
  labelClassName,
  onChange,
}) => {
  return (
    <div>
      {label && (
        <Text
          tag="span"
          className={clsx(
            'block text-base font-bold capitalize text-gray-dark',
            labelClassName
          )}
        >
          {label}
        </Text>
      )}

      {items.map((item) => (
        <Checkbox
          onChange={() => onChange(item)}
          key={item.id}
          name={item.label}
          label={item.label}
          size="lg"
          inputClassName="!text-gray-dark"
          labelClassName="!text-base !capitalize !text-gray !font-normal"
          labelPlacement="start"
          className="mb-3"
          containerClassName="justify-between"
          checked={!!item.checked}
          // {...register('remember')}
        />
      ))}
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';
