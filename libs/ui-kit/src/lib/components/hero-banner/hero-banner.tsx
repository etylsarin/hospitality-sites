'use client';

import Image from 'next/image';
import { SearchForm } from '../search-form/search-form';
import { FunctionComponent } from 'react';

export interface HeroBannerProps {
  imageUrl: string;
  imageAlt: string;
  domain: string;
}

export const HeroBanner: FunctionComponent<HeroBannerProps> = ({ domain, imageUrl, imageAlt }) => {
  return (
    <div className="relative flex min-h-full items-end justify-center px-4 pb-28 pt-48 before:absolute before:left-0 before:top-0 before:z-[1] before:block before:h-1/4 before:w-full before:bg-gradient-to-b before:from-black/60 sm:flex-none sm:justify-start sm:px-0 sm:pb-20 sm:pl-6 sm:pt-[120px] md:pl-16 3xl:pb-[132px] 3xl:pt-[142px] 4xl:pl-[200px]">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        className="aspect-[2/1] h-full bg-gray-lighter object-cover"
      />
      <SearchForm domain={domain} />
    </div>
  );
}
