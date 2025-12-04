'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FunctionComponent } from 'react';
import clsx from 'clsx';

import { ActionIcon } from '../action-icon/action-icon';
import { drawerStateAtom } from './view';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
}

export interface SideMenuProps {
  menuItems?: MenuItem[];
}

export const SideMenu: FunctionComponent<SideMenuProps> = ({ menuItems = [] }) => {
  const [drawerState, setDrawerState] = useAtom(drawerStateAtom);
  const pathname = usePathname();

  const closeDrawer = () => {
    setDrawerState({ ...drawerState, isOpen: false });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <span className="text-lg font-bold text-gray-900">Menu</span>
        <ActionIcon
          variant="text"
          size="sm"
          className="!p-1"
          onClick={closeDrawer}
        >
          <XMarkIcon className="h-6 w-6" />
        </ActionIcon>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  onClick={closeDrawer}
                  className={clsx(
                    'flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} All rights reserved
        </p>
      </div>
    </div>
  );
};

SideMenu.displayName = 'SideMenu';

export default SideMenu;
