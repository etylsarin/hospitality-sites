import { FunctionComponent, PropsWithChildren } from 'react';
import { PageHeader } from 'ui-kit';
import { appConfig, getSiteTitle } from '../config';

const siteTitle = getSiteTitle();

const PlacesLayout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <>
    <PageHeader title={siteTitle} description={appConfig.metadata.description} />
    {children}
  </>
);

export default PlacesLayout;
