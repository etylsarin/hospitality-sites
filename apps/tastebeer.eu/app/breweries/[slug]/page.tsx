import { FunctionComponent } from 'react';
import { DetailWrapper } from 'ui-kit';

export interface BreweryDetailPageProps {
    params: {
        slug: string;
    };
} 

const BreweryDetailPage: FunctionComponent<BreweryDetailPageProps> = ({ params }) => (
    <DetailWrapper slug={params.slug} type='brewery' />
);

export default BreweryDetailPage;
