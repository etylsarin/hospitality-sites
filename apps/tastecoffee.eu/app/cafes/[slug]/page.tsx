import { FunctionComponent } from 'react';
import { DetailWrapper } from 'ui-kit';

export interface CafeDetailPageProps {
    params: {
        slug: string;
    };
} 

const CafeDetailPage: FunctionComponent<CafeDetailPageProps> = ({ params }) => (
    <DetailWrapper slug={params.slug} type='cafe' />
);

export default CafeDetailPage;
