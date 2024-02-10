import { FunctionComponent } from 'react';
import { HeroBanner, TransparentHeader } from 'ui-kit';
import { appConfig } from './config';


export const metadata = appConfig.metadata;


const Index: FunctionComponent = () => (
  <>
    <TransparentHeader title={metadata.title} description={metadata.description} />
    <main className="flex-grow"><HeroBanner imageUrl={appConfig.backgroundImage} imageAlt={appConfig.metadata.title} domain={appConfig.domain} /></main>
  </>
);

export default Index;
