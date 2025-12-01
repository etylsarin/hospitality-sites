'use client';

import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';

import { HeartIcon } from '../icons';

export interface AddToWishlistProps {
  onClick: (_value: boolean) => void;
  isWishListed: boolean;
};
export const AddToWishlist: FunctionComponent<AddToWishlistProps>  = ({
  onClick,
  isWishListed,
}) => {
  const [addWishlist, setAddWishlist] = useState(isWishListed);

  function handleWishlistAdd() {
    setAddWishlist((prevState) => !prevState);
    onClick && onClick(!addWishlist);
  }

  return (
    <button
      type="button"
      className="absolute right-4 top-4 z-10 inline-block transition-transform duration-200 active:scale-75"
      onClick={() => handleWishlistAdd()}
    >
      <HeartIcon
        className={clsx('h-auto w-[22px] text-gray-dark/20', {
          '!text-red-500': addWishlist,
        })}
      />
    </button>
  );
}

AddToWishlist.displayName = 'AddToWishlist';
