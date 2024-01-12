import { ChakraProvider } from '@chakra-ui/react'
import { FunctionComponent, ReactNode } from 'react';

export interface UiProviderProps {
    children?: ReactNode;
}

export const UiProvider: FunctionComponent<UiProviderProps> = ({ children }) => (
    <ChakraProvider>
      {children}
    </ChakraProvider>
);