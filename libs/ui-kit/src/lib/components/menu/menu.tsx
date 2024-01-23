'use client';

import Link from 'next/link';

const menuItems = [
  {
    id: 1,
    label: 'Home',
    path: '/',
  },
  {
    id: 2,
    label: 'Explore',
    path: '/',
  },
  {
    id: 3,
    label: 'Help',
    path: '/',
  },
];

export const Menu = () => (
  <nav className="primary-nav hidden items-center justify-between md:flex">
    <ul className="hidden flex-wrap md:flex">
      {menuItems.map((item) => (
        <li key={item.id}>
          <Link href={item.path} className="px-5 capitalize text-white">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
