'use client';

import { StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';
import { MapsConfigProps } from 'queries';
import { FunctionComponent } from 'react';

export interface SearchAutocompleteProps {
  children: React.ReactNode;
  maps: MapsConfigProps;
  loader?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad: (ref: any) => void;
  onPlacesChanged: () => void;
};

type l = 'places'[];
const libraries: l = ['places'];

export const SearchAutocomplete: FunctionComponent<SearchAutocompleteProps> = ({
  children,
  maps,
  loader,
  onLoad,
  onPlacesChanged,
}) => {
  console.log('maps', maps);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: maps.apiKey,
    libraries,
  });

  return (
    <div className="map_autocomplete">
      {!isLoaded && loader}
      {isLoaded && (
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          {children}
        </StandaloneSearchBox>
      )}
    </div>
  );
}
