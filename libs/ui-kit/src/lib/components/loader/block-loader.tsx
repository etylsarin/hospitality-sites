/* eslint-disable react/no-multi-comp */
'use client';

import { FunctionComponent } from 'react';
import ContentLoader from 'react-content-loader';

export interface BlockProps {
  className?: string;
}

export const Block: FunctionComponent<BlockProps> = ({ className, ...props }) => {
  return (
    <ContentLoader
      speed={2}
      id="loader"
      width={'100%'}
      height={'100%'}
      viewBox="0 0 400 460"
      backgroundColor="#f1f1f1"
      foregroundColor="#dddddd"
      className={className}
      uniqueKey="block-loader"
      {...props}
    >
      <rect x="0" y="0" rx="12" ry="12" width="100%" height="100%" />
    </ContentLoader>
  );
}

export const BlockLoader = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      <Block />
      <Block className="hidden sm:block" />
      <Block className="hidden md:block" />
      <Block className="hidden xl:block" />
    </div>
  );
};

Block.displayName = 'Block';
