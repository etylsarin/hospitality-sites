'use client';

import clsx from 'clsx';
import { FunctionComponent, useRef } from 'react';
import { useScrollingClass } from '../../utils';
import { SearchIconBtn } from '../search-icon-btn/search-icon-btn';
import { Menu } from '../menu/menu';
import { Logo } from '../logo/logo';
import { SideNavButton } from '../side-nav-button/side-nav-button';

export interface TransparentHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export const TransparentHeader: FunctionComponent<TransparentHeaderProps> = (props) => {
  const headerRef = useRef(null);
  useScrollingClass(headerRef);

  return (
    <header
      ref={headerRef}
      className={
        clsx(
          'transparent-header fixed left-0 top-0 z-[100] flex w-full justify-between bg-white px-4 py-3.5 sm:bg-transparent sm:px-6 lg:py-6 2xl:px-7 3xl:px-8 4xl:px-16 4xl:py-9',
          props.className,
        )
      }
    >
      <div className="flex items-center gap-2 md:gap-4">
        <SideNavButton />
        <Logo {...props} />
      </div>
      <div className="flex items-center">
        <SearchIconBtn className="md:hidden" />
        <Menu />
      </div>
    </header>
  );
}
