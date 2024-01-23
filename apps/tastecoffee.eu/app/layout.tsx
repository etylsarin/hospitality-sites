import { FunctionComponent, ReactNode } from 'react';
import { PageWrapper } from 'ui-kit';

import cfg from '../package.json';

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
