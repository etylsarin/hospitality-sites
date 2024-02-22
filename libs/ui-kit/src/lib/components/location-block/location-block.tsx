import { FunctionComponent } from 'react';
import { Location, MapsConfigProps } from 'queries';

import { MapView } from '../map-view/map-view';
import { Section } from '../section/section';

export interface LocationBlockProps {
  location: Location;
  maps: MapsConfigProps;
}

export const LocationBlock: FunctionComponent<LocationBlockProps> = ({ location, maps }) => {
  return (
    <Section
      className="py-5 xl:py-7"
      title="location"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl mb-2"
      description={location?.address}
      descriptionClassName="!text-gray !text-base"
    >
      <div className="mt-6 overflow-hidden rounded-xl">
        <MapView mapContainerClassName="w-full h-[230px] sm:h-[400px] xl:h-[600px]" geopoint={location.geopoint} googleMapsApiKey={maps.apiKey} />
      </div>
    </Section>
  );
}

LocationBlock.displayName = 'LocationBlock';
