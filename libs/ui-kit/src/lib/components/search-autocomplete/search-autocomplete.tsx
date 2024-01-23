'use client';

import { StandaloneSearchBox, useLoadScript } from '@react-google-maps/api';
import { FunctionComponent } from 'react';

export interface SearchAutocompleteProps {
  children: React.ReactNode;
  loader?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad: (ref: any) => void;
  onPlacesChanged: () => void;
};

type l = 'places'[];
const libraries: l = ['places'];

export const SearchAutocomplete: FunctionComponent<SearchAutocompleteProps> = ({
  children,
  loader,
  onLoad,
  onPlacesChanged,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
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
