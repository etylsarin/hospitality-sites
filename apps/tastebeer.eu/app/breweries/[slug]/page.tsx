import Image from 'next/image';
import { groq } from 'next-sanity';
import { FunctionComponent } from 'react';
import { PageHeading } from 'ui-kit';

import { client } from '../../client';

import styles from './page.module.scss';

const getData = async (slug: string) => {
    return await client.fetch(groq`
        *[_type == "place" && slug.current == $slug]{
            name,
            image {"url": asset->url}
          }`, { slug });
};

export interface BreweryDetailDataProps {
    name: string;
    image: {
        url: string;
    }
}

export interface BreweryDetailPageProps {
    params: {
        slug: string;
    };
} 

const BreweryDetailPage: FunctionComponent<BreweryDetailPageProps> = async ({ params }) => {
    const data: BreweryDetailDataProps[] = await getData(params.slug);
    const { image, name } = data[0];
    // const router = useRouter();
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
