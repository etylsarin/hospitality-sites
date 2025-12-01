'use client';

import { FunctionComponent } from 'react';
import { ReviewBar, ReviewBarProps } from './review-bar';

export interface ReviewStatProps {
  totalReviews: number;
  averageRating: number;
  stars: ReviewBarProps[];
}

export const ReviewStat: FunctionComponent<ReviewStatProps> = ({ totalReviews, averageRating, stars }) => {
  return (
    <div className="mt-8 hidden items-center md:mt-8 md:flex">
      <div className="flex-shrink-0 border-r-[1px] border-gray-lighter py-3 pr-5 md:pr-14">
        <h3 className="text-center text-3xl font-bold sm:text-6xl md:text-left">
          {averageRating}
        </h3>
        <p className="mt-3 text-sm capitalize md:text-base">
          {totalReviews} Ratings
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-3 pl-5 md:pl-14">
        {stars.map((st: ReviewBarProps) => (
          <ReviewBar key={st.count} count={st.count} percent={st.percent} />
        ))}
      </div>
    </div>
  );
};

ReviewStat.displayName = 'ReviewStat';
