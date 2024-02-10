'use client';

import { Text } from '../text/text';
import { Section } from '../section/section';
import { FunctionComponent } from 'react';
import { clsx } from 'clsx';

import styles from './description-block.module.scss';

interface DescriptionBlockProps {
  description: string;
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  description,
}) => (
  <Section className="py-5 lg:py-6 xl:py-7">
    <Text className={clsx("!text-base !leading-7 !text-secondary", styles.text)}>
      {description}
    </Text>
  </Section>
);
