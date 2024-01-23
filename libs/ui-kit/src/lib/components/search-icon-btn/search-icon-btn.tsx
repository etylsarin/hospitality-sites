'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { useModal } from '../../hooks';
import { ActionIcon } from '../action-icon/action-icon';

export interface SearchIconBtnProps {
  className?: string;
}

export const SearchIconBtn: FunctionComponent<SearchIconBtnProps> = ({
  className = 'lg:hidden',
}) => {
  const { openModal } = useModal();
  return (
    <ActionIcon
      variant="text"
      className={clsx('focus:!ring-0', className)}
      onClick={() => openModal('SEARCH_MODAL')}
    >
      <MagnifyingGlassIcon className="h-6 w-5 sm:w-6" />
    </ActionIcon>
  );
}

SearchIconBtn.displayName = 'SearchIconBtn';
