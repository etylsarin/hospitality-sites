'use client';

import { Bars3CenterLeftIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { FunctionComponent } from 'react';

import { ActionIcon } from '../action-icon/action-icon';
import { drawerStateAtom } from '../drawers/view';

export interface SideNavButtonProps {
  className?: string;
}

export const SideNavButton: FunctionComponent<SideNavButtonProps> = ({ className }) => {
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);

  return (
    <ActionIcon
      variant="text"
      size="sm"
      className={clsx(
        '!w-6 -translate-x-1 !p-0 focus:!ring-0 md:!w-7 2xl:!w-8',
        className
      )}
      onClick={() =>
        setDrawerState({
          ...drawerSate,
          isOpen: true,
          placement: 'left',
          view: 'SIDE_MENU',
        })
      }
    >
      <Bars3CenterLeftIcon className="h-auto w-full" />
    </ActionIcon>
  );
}

SideNavButton.displayName = 'SideNavButton';
