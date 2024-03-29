import { FunctionComponent, PropsWithChildren } from 'react';
import { PageWrapper } from 'ui-kit';
import { appConfig } from './config';

const RootLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <PageWrapper version={appConfig.version} sanity={appConfig.sanity}>
    {children}
  </PageWrapper>
);

export default RootLayout;
