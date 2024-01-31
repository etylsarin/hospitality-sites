'use client';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import { ReviewCard } from '../review-card/review-card';
import { ReviewStat } from '../review-stat/review-stat';
import { useModal } from '../modals/context';
import { Section } from '../section/section';
import { Button } from '../button/button';
import { Text } from '../text/text';
import { FunctionComponent } from 'react';
import { Review } from 'queries';

interface ReviewBlockProps {
  reviews: Review[];
}

export const ReviewBlock: FunctionComponent<ReviewBlockProps> = ({ reviews }) => {
  const { openModal } = useModal();
  const totalReviews = reviews.length;
  const totalOverviews = reviews.reduce((prev, curr) => prev + curr.overview ? 1 : 0, 0);
  const totalRating = reviews.reduce((prev, curr) => prev + curr.rating, 0);
  const averageRating = totalReviews ? totalRating / totalReviews : 0;
  const reviewsPage = totalReviews > 3 ? reviews.slice(0, 3) : reviews;
  const starsCount = reviews.reduce((prev, curr) => {
    const key = `${curr.rating}`;
    prev[key] ? prev[key] += 1 : prev[key] = 1;
    return prev;
  }, {} as { [key: string]: number });
  const stars = Array.from({length: 5}, (v, i) => ({ count: i + 1, percent: totalReviews && starsCount[i + 1] ? starsCount[i + 1] * 100 / totalReviews : 0})) 
  const stats = {
    totalReviews,
    averageRating,
    stars: stars.reverse(),
  };
  return (
    <Section
      id="reviews"
      title={`${totalOverviews} reviews`}
      className="scroll-mt-20 py-5 xl:py-7"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl hidden md:block"
      rightElement={
        <Button
          size="xl"
          variant="outline"
          className="hidden !border-gray-dark !px-4 !py-[10px] !text-sm !font-bold !leading-[18px] text-gray-dark hover:bg-gray-1000 hover:text-white md:block md:border-gray md:!text-base lg:!px-[30px] lg:!py-[14px]"
          onClick={() => openModal('ADD_REVIEW')}
        >
          Add Review
        </Button>
      }
    >
      <Text tag="h2" className="mb-2 flex items-center gap-2 text-xl md:hidden">
        <StarIcon className="h-auto w-6" />
        4.9 - 35 Reviews
      </Text>
      <ReviewStat {...stats}  />
      <div className="md:mt-8">
        {reviewsPage
          .map((item, index: number) => (
            <ReviewCard
              key={`review-${index}`}
              avatar={item.author.avatar}
              name={item.author.name}
              date={item.date}
              rating={item.rating}
              review={item.overview}
              totalReviews={123}
            />
          ))}
      </div>
      <div className="mt-8 hidden items-center justify-between md:flex xl:mt-12">
        <Button size="lg" variant="text" className="!p-0 !ring-0">
          <span className="flex items-center gap-6 font-medium text-gray-dark drop-shadow-sm hover:text-gray">
            <ArrowLeftIcon className="h-auto w-6" />
            Previous Page
          </span>
        </Button>
        <Button size="lg" variant="text" className="!p-0 !ring-0">
          <span className="flex items-center gap-6 font-medium text-gray-dark drop-shadow-sm hover:text-gray">
            Next Page
            <ArrowRightIcon className="h-auto w-6" />
          </span>
        </Button>
      </div>
    </Section>
  );
}

ReviewBlock.displayName = 'ReviewBlock';
