import { FunctionComponent } from 'react';
import { Location } from 'queries';

import { MapView } from '../map-view/map-view';
import { Section } from '../section/section';

export interface LocationBlockProps {
  location?: Partial<Location>;
  placeName?: string;
}

export const LocationBlock: FunctionComponent<LocationBlockProps> = ({ location, placeName }) => {
  const addressDisplay = typeof location?.address === 'string' 
    ? location.address 
    : location?.address?.formattedAddress || '';

  if (!location?.geopoint) {
    return null;
  }

  return (
    <Section
      className="py-5 xl:py-7"
      title="location"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl mb-2"
      description={addressDisplay}
      descriptionClassName="!text-gray !text-base"
    >
      <div className="mt-6 overflow-hidden rounded-xl">
        <MapView 
          mapContainerClassName="w-full h-[230px] sm:h-[400px] xl:h-[600px]" 
          geopoint={location.geopoint} 
          markerLabel={placeName}
        />
      </div>
    </Section>
  );
}

LocationBlock.displayName = 'LocationBlock';
