import { Heading } from '@chakra-ui/react';
import Image from 'next/image';
import { DetailResponse, queryDetail } from 'queries';
import { FunctionComponent } from 'react';

import styles from './detail-wrapper.module.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { use } = require('react');

export interface DetailWrapperProps {
    type: string;
    slug: string;
} 

export const DetailWrapper: FunctionComponent<DetailWrapperProps> = ({ type, slug }) => {
    const data: DetailResponse = use(queryDetail({ type, slug }));
    const { image, name } = data;

    return (
        <>
            <Heading as="h1" size="4xl" noOfLines={1}>{name}</Heading>
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
