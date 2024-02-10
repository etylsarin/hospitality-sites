import { FunctionComponent, PropsWithChildren } from 'react';
import { PageHeader } from 'ui-kit';
import { appConfig } from '../config';

const PlacesLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <>
    <PageHeader title={appConfig.metadata.title} description={appConfig.metadata.description} />
    {children}
  </>
);

export default PlacesLayout;
