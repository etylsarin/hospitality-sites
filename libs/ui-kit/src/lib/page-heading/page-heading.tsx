import { Heading } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';

export interface PageHeadingProps {
    children?: ReactNode;
}

export const PageHeading: FunctionComponent<PageHeadingProps> = ({ children }) => (
    <Heading as="h1" size="4xl" noOfLines={1}>
      {children}
    </Heading>
);