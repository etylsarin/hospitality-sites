import type { Metadata } from 'next';
import { FunctionComponent } from 'react';
import { HeroBanner, TransparentHeader } from 'ui-kit';
import { appConfig, getSiteTitle } from './config';

export const metadata: Metadata = {
  ...appConfig.metadata,
  title: 'tastebeer.eu - Discover the Best Beer Places',
};

const siteTitle = getSiteTitle();

const Index: FunctionComponent = () => (
  <>
    <TransparentHeader title={siteTitle} description={appConfig.metadata.description} />
    <main className="flex-grow">
      <HeroBanner
        imageUrl={appConfig.backgroundImage}
        imageAlt={siteTitle}
        domain={appConfig.domain}
        maps={appConfig.maps}
      />
    </main>
  </>
);

export default Index;
