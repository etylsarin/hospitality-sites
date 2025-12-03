'use client';

import Image from 'next/image';
import { useAtom } from 'jotai';
import { drawerStateAtom } from './view';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { ShareIcon } from '../icons';
import { useGallery } from '../gallery/context';
import { useModal } from '../../hooks';
import { ActionIcon } from '../action-icon/action-icon';
import { Text } from '../text/text';
import { Button } from '../button/button';
import { DetailResponse, SanityConfigProps, queryDetail } from 'queries';
import { FunctionComponent } from 'react';

 
const { use } = require('react');

export interface PhotoGallertProps {
  sanity: SanityConfigProps;
}

export const PhotoGallery: FunctionComponent<PhotoGallertProps> = ({ sanity }) => {
  const path = window.location.pathname;
  const slugIndex = path.lastIndexOf('/');
  const slug = path.substring(slugIndex + 1);
  const data: DetailResponse = use(queryDetail({ slug, sanity }));
  const { images } = data;
  const [drawerSate, setDrawerState] = useAtom(drawerStateAtom);
  const { openModal } = useModal();
  const { openGallery } = useGallery();

  return (
    <div className="min-h-full w-full bg-white">
      <div className="container-fluid sticky top-0 z-10 flex h-14 w-full items-center bg-white shadow-sm md:h-20">
        <div className="flex w-full items-center justify-between">
          <ActionIcon
            variant="outline"
            size="sm"
            rounded="full"
            className="border-none focus:ring-0 md:h-8 md:w-8"
            onClick={() =>
              setDrawerState({
                ...drawerSate,
                isOpen: false,
              })
            }
          >
            <ChevronLeftIcon className="h-auto w-6" />
          </ActionIcon>
          <div className="flex gap-10">
            <Button
              size="sm"
              className="group flex items-center hover:text-red focus:!ring-0"
              variant="text"
              onClick={() => openModal('SHARE')}
            >
              <ShareIcon className="h-4 w-4" />
              <span className="ml-3   text-sm font-normal text-gray-dark group-hover:text-red lg:text-base">
                Share
              </span>
            </Button>
          </div>
        </div>
      </div>
      <div className="m-auto w-full max-w-4xl px-4 py-4 pb-20 sm:py-6 md:py-10 lg:px-0 lg:py-16">
        <Text tag="h3" className="md:!text-xl">
          Photo Gallery
        </Text>
        <div className="mt-6 columns-2 gap-x-2 lg:gap-x-3">
          {images?.map((image, index) => (
            <div
              className="group relative mb-2 cursor-pointer overflow-hidden rounded-md transition-all duration-300 md:rounded-xl lg:mb-3"
              key={`gallery-img-${index}`}
              onClick={() => openGallery('MODAL_GALLERY', index)}
            >
              <Image
                src={image.url}
                alt="gallery-img"
                fill
                className="!static object-cover"
              />
              <span className="absolute left-0 top-0 z-10 h-full w-full bg-gray-dark opacity-0 transition-all duration-200 group-hover:opacity-10"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoGallery;