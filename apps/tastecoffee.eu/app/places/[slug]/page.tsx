import { FunctionComponent } from 'react';
import { DetailWrapper } from 'ui-kit';

export interface PlaceDetailPageProps {
    params: {
        slug: string;
    };
} 

const PlaceDetailPage: FunctionComponent<PlaceDetailPageProps> = ({ params }) => (
    <DetailWrapper slug={params.slug} />
);

export default PlaceDetailPage;
