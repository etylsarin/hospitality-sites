import { FunctionComponent } from 'react';
import { DetailWrapper } from 'ui-kit';
import { appConfig } from '../../config';

export const metadata = appConfig.metadata;

export interface PlaceDetailPageProps {
    params: {
        slug: string;
    };
} 

const PlaceDetailPage: FunctionComponent<PlaceDetailPageProps> = async props => {
    const params = await props.params;
    return (<DetailWrapper slug={params.slug} sanity={appConfig.sanity} maps={appConfig.maps} />);
};

export default PlaceDetailPage;
