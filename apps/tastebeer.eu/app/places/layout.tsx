import { FunctionComponent, PropsWithChildren } from 'react';
import { PageHeader } from 'ui-kit';

const PlacesLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <>
    <PageHeader title='tastebeer.eu' description='Welcome to tastebeer.eu' />
    {children}
  </>
);

export default PlacesLayout;
