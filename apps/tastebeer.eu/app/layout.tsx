import { SpeedInsights } from "@vercel/speed-insights/next"

import { version } from '../package.json';


import styles from './layout.module.scss';

export const metadata = {
  title: 'tastebeer.eu',
  description: 'Welcome to tastebeer.eu',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" data-version={version} className={styles.html}>
      <body className={styles.body}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
