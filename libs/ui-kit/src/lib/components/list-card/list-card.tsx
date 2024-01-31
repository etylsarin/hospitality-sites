'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { ListItem } from 'queries';
import { FunctionComponent } from 'react';
import { CurrencyEuroIcon } from '@heroicons/react/24/outline';

import { ActionIcon } from '../action-icon/action-icon';
import { AddToWishlist } from '../add-to-wishlist/add-to-wishlist';
import { ChevronRightIcon, ChevronLeftIcon } from '../icons';
import { Rating } from '../rating/rating';
import {
  Swiper,
  SwiperSlide,
  Navigation,
  Pagination,
} from '../slider/slider';

export interface ListCardProps extends Omit<ListItem, 'slug'> {
  id: string;
  category?: string;
};

export const ListCard: FunctionComponent<ListCardProps> = ({
  id,
  name,
  reviews,
  established,
  images,
  category,
}) => {
  const rating = reviews && reviews.length ? reviews.reduce((prev, curr) => prev + curr.rating, 0) / reviews.length : 0;
  const reviewCount = `${reviews?.length || 0} ${reviews?.length === 1 ? 'review' : 'reviews'}`;
  const est = established ? `Since ${established}` : '';
  const detailUrl = `places/${id}`;

  return (
    <>
      <div className="listing-card group/item relative inline-flex w-full flex-col">
        <div className="relative w-full overflow-hidden rounded-xl">
          <AddToWishlist
            isWishListed={false}
            onClick={(data: unknown) => console.log('Item added to Wishlist.', data)}
          />
          <Link href={detailUrl}>
            <div className="listing-item after:absolute after:bottom-0 after:left-0 after:z-[1] after:h-1/4 after:w-full after:bg-gradient-to-t after:from-black/25">
              <Swiper
                className="!static"
                modules={[Pagination, Navigation]}
                pagination={{
                  clickable: true,
                }}
                slidesPerView={1}
                navigation={{
                  nextEl: `.${id}-listing-item-button-next`,
                  prevEl: `.${id}-listing-item-button-prev`,
                }}
              >
                {images?.map((slide, index) => (
                  <SwiperSlide key={`slide-${index}`}>
                    <Image
                      className="aspect-[34/25] bg-gray-lighter"
                      src={slide.url}
                      width={816}
                      height={600}
                      alt="boat"
                      priority
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <ActionIcon
                rounded="full"
                color="light"
                size="sm"
                className={clsx(
                  'absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 shadow-md !transition-all focus:!ring-0 md:invisible md:flex md:disabled:hidden md:group-hover/item:visible',
                  `${id}-listing-item-button-prev`
                )}
              >
                <ChevronLeftIcon className="-ml-0.5 h-auto w-[7px]" />
              </ActionIcon>
              <ActionIcon
                rounded="full"
                size="sm"
                color="light"
                className={clsx(
                  'absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 opacity-80 shadow-md !transition-all duration-300 focus:!ring-0 md:invisible md:flex md:disabled:hidden md:group-hover/item:visible md:group-hover/item:opacity-100',
                  `${id}-listing-item-button-next`
                )}
              >
                <ChevronRightIcon className="-mr-0.5 h-auto w-[7px]" />
              </ActionIcon>
            </div>
          </Link>
        </div>
        <Link href={detailUrl}>
          <div className="content pt-3">
            <div className="mb-1 flex items-center gap-5">
              <span className="relative flex items-center font-bold text-gray-dark before:absolute before:-right-3 before:block before:h-1 before:w-1 before:rounded-full before:bg-gray-dark">
                #12 of 243 {category}
              </span>
              <span className="font-bold">{est}</span>
            </div>
            <h4 className="text-ellipsis text-gray-dark 2xl:mb-1.5">{name}</h4>
            <p className="mb-3 text-gray-light xl:mb-3">LOCATION</p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-gray-light">
                <div
                  className={clsx(
                    '[&>svg]:outline-current',
                    'flex h-[14px] w-[28px] 3xl:h-[18px] 3xl:w-[36px]'
                  )}
                >
                  <CurrencyEuroIcon />
                  <CurrencyEuroIcon />
                </div>
              </div>
              <div className="flex items-center gap-3 leading-7">
                <Rating
                  allowHalf
                  allowClear
                  defaultValue={rating}
                  characterClassName="h-[14px] w-[14px] 3xl:h-[18px] 3xl:w-[18px]"
                />
                ({reviewCount})
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

ListCard.displayName = 'ListCard';
