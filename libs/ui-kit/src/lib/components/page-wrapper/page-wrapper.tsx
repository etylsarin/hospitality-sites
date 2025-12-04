import { SpeedInsights } from '@vercel/speed-insights/next';
import { FunctionComponent, ReactNode } from 'react';
import clsx from 'clsx';
import { Satisfy, Lato } from 'next/font/google';

import { ModalContainer } from '../modals/view';
import { DrawerContainer } from '../drawers/view';
import GalleryCarouselView from '../gallery/view';
import { AssetProvider } from '../assets-provider/assets-provider';

import { Footer, MenuItem } from "../footer/footer";
import { SanityConfigProps } from 'queries';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
});

const satisfy = Satisfy({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
});

export interface PageWrapperProps {
  sanity: SanityConfigProps;
  children?: ReactNode;
  version?: string;
  menuItems?: MenuItem[];
}

export const PageWrapper: FunctionComponent<PageWrapperProps> = ({ version, sanity, menuItems, children }) => (
  <AssetProvider>
    <html
      lang="en"
      data-version={version} 
      className={clsx(
        'h-full font-lato antialiased',
        satisfy.variable,
        lato.variable
      )}
    >
      <head />
      <body className="flex min-h-full flex-col">
        {children}
        <Footer menuItems={menuItems} />
        <ModalContainer />
        <DrawerContainer sanity={sanity} menuItems={menuItems} />
        <GalleryCarouselView />
        <SpeedInsights />
      </body>
    </html>
  </AssetProvider>
);

PageWrapper.displayName = 'PageWrapper';