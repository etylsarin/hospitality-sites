import { FunctionComponent, ReactNode } from 'react';
import { PageHeader } from 'ui-kit';

export interface PlacesLayoutProps {
  children: ReactNode;
}

const PlacesLayout: FunctionComponent<PlacesLayoutProps> = ({ children }) => {
  return (
    <>
      <PageHeader title='tastebeer.eu' description='Welcome to tastebeer.eu' />
      {children}
    </>
  );
};

export default PlacesLayout;
