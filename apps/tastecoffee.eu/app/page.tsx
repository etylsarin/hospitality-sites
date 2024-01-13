import Image from 'next/image';
import { FunctionComponent } from 'react';

import styles from './page.module.scss';

export interface IndexProps {}

const Index: FunctionComponent<IndexProps> = () => (
  <div className={styles.bg}>
    <Image src="/images/logo.png" alt="" width={92} height={278} className={styles.logo} />
  </div>
);

export default Index;
