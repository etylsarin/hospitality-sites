import { Location } from 'queries';
import { MapView } from '../map-view/map-view';
import { Section } from '../section/section';
import { FunctionComponent } from 'react';

export interface LocationBlockProps {
  location: Location;
}

export const LocationBlock: FunctionComponent<LocationBlockProps> = ({ location }) => {
  return (
    <Section
      className="py-5 xl:py-7"
      title="location"
      titleClassName="text-xl md:!text-[22px] 2xl:!text-2xl mb-2"
      description="Santa Maria Maggiore, Milazzo"
      descriptionClassName="!text-gray !text-base"
    >
      <div className="mt-6 overflow-hidden rounded-xl">
        <MapView mapContainerClassName="w-full h-[230px] sm:h-[400px] xl:h-[600px]" geopoint={location} googleMapsApiKey={`${process.env.SANITY_STUDIO_GMAPS_API_KEY}`} />
      </div>
    </Section>
  );
}

LocationBlock.displayName = 'LocationBlock';
