import { DetailResponse, queryDetail } from 'queries';
import { FunctionComponent } from 'react';

import { GallaryBlock } from '../gallery-block/gallary-block';
import { DescriptionBlock } from '../description-block/descripton-block';
// import { SpecificationBlock } from '../specification-block/specification-block';
import { LocationBlock } from '../location-block/location-block';
import { ListingDetailsHeroBlock } from '../hero-block/hero-block';
import { ReviewBlock } from '../review-block/review-block';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { use } = require('react');

export interface DetailWrapperProps {
    slug: string;
} 

export const DetailWrapper: FunctionComponent<DetailWrapperProps> = ({ slug }) => {
    const data: DetailResponse = use(queryDetail({ slug }));
    const { images, reviews, name, established, location, description } = data;

    console.log('location', location);
    return (
        <div className="container-fluid w-full 3xl:!px-12">
            <GallaryBlock images={images.map(image => image.url)} />
            <div className="flex justify-between gap-5 lg:gap-8 xl:gap-12 4xl:gap-16">
                <div className="w-full">
                <ListingDetailsHeroBlock name={name} category='CATEGORY' established={established} location='LOCATION' />
                <DescriptionBlock description={description} />
                {/* <SpecificationBlock specifications={[]} /> */}
                <LocationBlock location={location} />
                <ReviewBlock reviews={reviews || []} />
                </div>
                <div className="hidden w-full max-w-sm pb-11 lg:block xl:max-w-md 3xl:max-w-lg">
                <div className="sticky top-32 4xl:top-40">
                    aside
                </div>
                </div>
            </div>
        </div>
    );
};

DetailWrapper.displayName = 'DetailWrapper';
