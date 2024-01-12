import { SimpleGrid } from '@chakra-ui/react';
import { FunctionComponent, ReactNode } from 'react';

export interface ListGridProps {
    children?: ReactNode;
}

export const ListGrid: FunctionComponent<ListGridProps> = ({ children }) => (
    <SimpleGrid minChildWidth='100px' spacing='40px'>
      {children}
    </SimpleGrid>
);