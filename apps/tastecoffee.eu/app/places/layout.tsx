import { FunctionComponent, ReactNode } from 'react';
import { PageHeader } from 'ui-kit';

export interface PlacesLayoutProps {
  children: ReactNode;
}

const PlacesLayout: FunctionComponent<PlacesLayoutProps> = ({ children }) => {
  return (
    <>
      <PageHeader title='tastecoffee.eu' description='Welcome to tastecoffee.eu' />
      {children}
    </>
  );
};

export default PlacesLayout;
