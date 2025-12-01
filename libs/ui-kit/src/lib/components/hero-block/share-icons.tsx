'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { ShareIcon } from '../icons';
import { useModal } from '../modals/context';
import { Button } from '../button/button';

export const ShareIcons = () => {
  const { openModal } = useModal();
  return (
    <div className="mt-1 hidden items-center gap-3 bg-white md:flex 3xl:gap-6">
      <Button
        className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
        size="sm"
        variant="outline"
        rounded="pill"
        onClick={() => openModal('SHARE')}
      >
        <ShareIcon className="h-auto w-5" />
      </Button>
      <Button
        className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
        size="sm"
        variant="outline"
        rounded="pill"
      >
        <HeartIcon className="h-auto w-5" />
      </Button>
    </div>
  );
};

ShareIcons.displayName = 'ShareIcons';
