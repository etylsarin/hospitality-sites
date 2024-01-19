import Image from 'next/image';
import { DetailResponse, queryDetail } from 'queries';
import { FunctionComponent } from 'react';

import { Text } from '../text/text';

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
            <Text
                tag="h2"
                className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
            >
                {name}
            </Text>
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
