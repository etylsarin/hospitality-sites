'use client';

import Link from 'next/link';
import { menuItems } from '../../configs';

export const Menu = () => (
  <nav className="primary-nav hidden items-center justify-between md:flex">
    <ul className="hidden md:flex">
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
