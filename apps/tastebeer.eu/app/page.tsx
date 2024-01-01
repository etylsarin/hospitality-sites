import Image from 'next/image';

import styles from './page.module.scss';

export default async function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <Image src="/images/logo.png" alt="" width={92} height={278} className={styles.logo} />
  );
}
