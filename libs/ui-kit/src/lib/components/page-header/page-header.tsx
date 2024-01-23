'use client';

import { FunctionComponent, useRef } from 'react';

import { addScrollingClass } from '../../utils';
import { Logo } from '../logo/logo';
import { Searchbox } from '../search-box/search-box';
import { SearchIconBtn } from '../search-icon-btn/search-icon-btn';
import { SideNavButton } from '../side-nav-button/side-nav-button';

export interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader: FunctionComponent<PageHeaderProps> = (props) => {
  const headerRef = useRef(null);
  addScrollingClass(headerRef);

  return (
    <header
      ref={headerRef}
      className="dashboard-header sticky top-0 z-30 flex h-16 w-full bg-white md:flex md:items-center lg:h-[72px] 2xl:h-20 4xl:h-24"
    >
      <div className="container-fluid grid w-full grid-cols-2 items-center gap-0 lg:grid-cols-3 3xl:!px-12">
        <div className="flex items-center gap-2 md:gap-4 2xl:gap-5">
          <SideNavButton className="!block" />
          <Logo {...props} className="!text-gray-dark" />
        </div>
        <Searchbox className="hidden lg:block" />
        <div className="flex items-center justify-end gap-5">
          <SearchIconBtn />
        </div>
      </div>
    </header>
  );
}

PageHeader.displayName = 'PageHeader';