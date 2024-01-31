import { FunctionComponent, PropsWithChildren } from 'react';
import { PageHeader } from 'ui-kit';

const PlacesLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <>
    <PageHeader title='tastecoffee.eu' description='Welcome to tastecoffee.eu' />
    {children}
  </>
);

export default PlacesLayout;
