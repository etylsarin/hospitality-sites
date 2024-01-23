'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { AnchorHTMLAttributes, FunctionComponent, ReactNode } from 'react';

import { TasteBeer } from './tastebeer';
import { TasteCoffee } from './tastecoffee';


export interface LogoProps {
  title: string;
  description: string;
}

const logoMap: {[key: string]: ReactNode} = {
  'tastebeer.eu': <TasteBeer />,
  'tastecoffee.eu': <TasteCoffee />,
}

export const Logo: FunctionComponent<AnchorHTMLAttributes<object> & LogoProps> = ({
  className,
  title,
  description,
  ...props
}) => {
  return (
    <Link
      href='/'
      className={clsx(
        'brand-logo inline-flex w-full max-h-[24px] text-black focus:outline-none sm:text-white xl:max-h-[26px] 2xl:max-h-[28px] 3xl:max-h-[34px]',
        className
      )}
      {...props}
    >
      {logoMap[title]}
    </Link>
  );
};

Logo.displayName = 'Logo';