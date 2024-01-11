import { version } from '../package.json';

import { SpeedInsights } from "@vercel/speed-insights/next"

import styles from './layout.module.scss';

export const metadata = {
  title: 'tastebeer.eu',
  description: 'Welcome to tastebeer.eu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-version={version} className={styles.html}>
      <body className={styles.body}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
