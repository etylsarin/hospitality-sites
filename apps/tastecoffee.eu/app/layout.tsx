import { FunctionComponent, PropsWithChildren } from 'react';
import { PageWrapper } from 'ui-kit';

import cfg from '../package.json';

const RootLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <PageWrapper version={cfg.version}>
    {children}
  </PageWrapper>
);

export default RootLayout;
