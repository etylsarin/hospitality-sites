'use client';

import { FunctionComponent } from 'react';
import { Text } from '../text/text';
import { ShareIcons } from './share-icons';
import { ShareMenu } from './share-menu';

export type ListingDetailsHeroBlockProps = {
  name: string;
  location: string;
  category: string;
  established: string;
};

export const ListingDetailsHeroBlock: FunctionComponent<ListingDetailsHeroBlockProps> = ({ location, name, category, established }) => {
  return (
    <div className="flex justify-between border-b border-gray-lighter pb-6 md:pb-8 2xl:pb-10">
      <div>
        <p className="text-gray-dark">{location}</p>
        <Text
          tag="h2"
          className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
        >
          {name}
        </Text>
        <div className="mt-3 flex items-center gap-2 leading-4 text-gray-dark md:mt-4">
          <p>#12 of 243 {category}</p>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          <p>Since {established}</p>
        </div>
      </div>
      <div className="relative">
        <ShareMenu />
        <ShareIcons />
      </div>
    </div>
  );
}

ListingDetailsHeroBlock.displayName = 'ListingDetailsHeroBlock';
