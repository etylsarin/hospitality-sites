import { FunctionComponent, ReactNode } from 'react';
import { PageWrapper } from 'ui-kit';

import cfg from '../package.json';

export const metadata = {
  title: 'testebeer.eu',
  description: 'Welcome to testebeer.eu',
};

export interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FunctionComponent<RootLayoutProps> = ({ children }) => {
  return (
    <PageWrapper version={cfg.version}>
      {children}
    </PageWrapper>
  );
};

export default RootLayout;
