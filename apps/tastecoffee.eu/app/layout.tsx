import { FunctionComponent, PropsWithChildren } from 'react';
import type { Viewport } from 'next';
import { PageWrapper } from 'ui-kit';
import { appConfig } from './config';

export const viewport: Viewport = appConfig.viewport;

const RootLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <PageWrapper version={appConfig.version} sanity={appConfig.sanity}>
    {children}
  </PageWrapper>
);

export default RootLayout;
