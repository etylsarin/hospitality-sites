'use client';

import { Text } from '../text/text';
import { Section } from '../section/section';
import { FunctionComponent } from 'react';

interface DescriptionBlockProps {
  description: string;
}

export const DescriptionBlock: FunctionComponent<DescriptionBlockProps> = ({
  description,
}) => (
  <Section className="py-5 lg:py-6 xl:py-7">
    <Text className="!text-base !leading-7 !text-secondary">
      {description}
    </Text>
  </Section>
);
