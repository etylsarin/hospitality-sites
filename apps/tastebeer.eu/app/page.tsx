import { FunctionComponent } from 'react';
import { HeroBanner, TransparentHeader } from 'ui-kit';


export const metadata = {
  title: 'tastebeer.eu',
  description: 'Welcome to tastebeer.eu',
  // icons: ['/images/logo.svg'],
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
};


const Index: FunctionComponent = () => (
  <>
    <TransparentHeader title={metadata.title} description={metadata.description} />
    <main className="flex-grow"><HeroBanner imageUrl='/images/bg.jpg' imageAlt='' section='beer' /></main>
  </>
);

export default Index;
