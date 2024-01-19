import { SpeedInsights } from "@vercel/speed-insights/next"
import { FunctionComponent, ReactNode } from 'react';

import { AssetProvider } from "../assets-provider/assets-provider";

import styles from './page-wrapper.module.scss';

export interface PageWrapperProps {
    children?: ReactNode;
    version?: string;
}

export const PageWrapper: FunctionComponent<PageWrapperProps> = ({ version, children }) => (
  <AssetProvider>
    <html lang="en" data-version={version} className={styles.html}>
      <body className={styles.body}>
          {children}
        <SpeedInsights />
      </body>
    </html>
  </AssetProvider>
);