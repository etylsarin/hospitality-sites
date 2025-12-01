'use client';

import { FunctionComponent } from 'react';
import { Loader } from '../loader/loader';

export interface PageLoaderProps {
  message?: string;
}

export const PageLoader: FunctionComponent<PageLoaderProps> = ({
  message = 'Loading...',
}) => (
  <div className="flex min-h-[400px] flex-col items-center justify-center">
    <Loader size="lg" color="primary" />
    <p className="mt-4 text-sm text-gray-500">{message}</p>
  </div>
);

PageLoader.displayName = 'PageLoader';
