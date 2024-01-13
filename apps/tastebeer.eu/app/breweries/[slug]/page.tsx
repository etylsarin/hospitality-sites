import Image from 'next/image';
import { FunctionComponent } from 'react';
import { PageHeading } from 'ui-kit';

import { DetailResponse, queryDetail } from '../../query';

import styles from './page.module.scss';

export interface BreweryDetailPageProps {
    params: {
        slug: string;
    };
} 

const BreweryDetailPage: FunctionComponent<BreweryDetailPageProps> = async ({ params }) => {
    const data: DetailResponse = await queryDetail({ slug: params.slug, type: 'brewery' });
    const { image, name } = data;
    return (
        <>
            <PageHeading>{name}</PageHeading>
            <div className={styles.image}>
                <Image
                    src={image.url}
                    alt={name}
                    fill
                />
            </div>
        </>
    );
};

export default BreweryDetailPage;
