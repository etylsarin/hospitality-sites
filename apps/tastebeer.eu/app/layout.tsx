import { version } from '../package.json';

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
    <html lang="en" data-version={version}>
      <body className={styles.body}>{children}</body>
    </html>
  );
}
