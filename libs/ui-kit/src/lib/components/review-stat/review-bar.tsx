'use client';

import { FunctionComponent } from 'react';

export interface ReviewBarProps {
  count: number;
  percent: number;
}

export const ReviewBar: FunctionComponent<ReviewBarProps> = ({ count, percent }) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <p className="text-sm capitalize text-gray-dark sm:text-base">
        {count && count} Star
      </p>
      <div className="w-28 overflow-hidden rounded-lg bg-gray-lighter sm:w-[200px]">
        <div
          className="h-1 rounded-lg bg-gray-dark transition-all duration-300 sm:h-[6px]"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-xs capitalize text-gray sm:text-sm">
        {percent > 9 ? percent : `0${percent}`} %
      </p>
    </div>
  );
};

ReviewBar.displayName = 'ReviewBar';
