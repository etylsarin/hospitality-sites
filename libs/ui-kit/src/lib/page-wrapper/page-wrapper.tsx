import { ChakraProvider } from '@chakra-ui/react'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FunctionComponent, ReactNode } from 'react';

import styles from './page-wrapper.module.scss';

export interface PageWrapperProps {
    children?: ReactNode;
    version?: string;
}

export const PageWrapper: FunctionComponent<PageWrapperProps> = ({ version, children }) => (
  <html lang="en" data-version={version} className={styles.html}>
    <body className={styles.body}>
      <ChakraProvider>
        {children}
      </ChakraProvider>
      <SpeedInsights />
    </body>
  </html>
);