'use client';

import Image from 'next/image';
import { Text } from '../text/text';
import { Rating } from '../rating/rating';
import { FunctionComponent } from 'react';


export type ReviewCardProps = {
  avatar?: string;
  name: string;
  date: string;
  rating: number;
  review: string;
  totalReviews: number;
};

export const ReviewCard: FunctionComponent<ReviewCardProps> = ({
  avatar,
  name,
  date,
  rating,
  review,
  totalReviews,
}) => {
  return (
    <div className="border-b-[1px] border-gray-200 py-6   md:py-7">
      <div className="flex justify-between">
        <div className="flex items-center">
          {avatar ?
            <div className="relative h-12 w-12 overflow-hidden rounded-full md:h-16 md:w-16">
              <Image
                src={avatar}
                alt="icon"
                fill
                sizes="(min-width: 320) 100vw, 100vw"
                className="aspect-[1/1] rounded-full object-cover"
              />
            </div>
          : null}
          <div className="ml-3 md:ml-5">
            <Text tag="h6" className="uppercase leading-[22px]">
              {name}
            </Text>
            <p className="mt-0.5 text-sm leading-[22px] text-gray-dark md:mt-2 md:text-secondary">
              {date}
            </p>
          </div>
        </div>
        <div className="text-end">
          <Rating
            className="md:mt-2"
            allowHalf
            allowClear
            defaultValue={rating}
            size="lg"
          />
          <p className="mt-1 text-sm leading-5 text-gray-dark md:mt-2">
            {totalReviews} review(s)
          </p>
        </div>
      </div>
      <div className="mt-5">
        <p className="font-medium leading-7 tracking-wide text-secondary">
          {review}
        </p>
      </div>
    </div>
  );
}

ReviewCard.displayName = 'ReviewCard';
