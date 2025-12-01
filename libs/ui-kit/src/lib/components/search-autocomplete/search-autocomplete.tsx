'use client';

import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { MapsConfigProps } from 'queries';
import React, { FunctionComponent } from 'react';

/* global google */

export interface SearchAutocompleteProps {
  children: React.ReactNode;
  maps: MapsConfigProps;
  loader?: React.ReactNode;
  onLoad: (_ref: google.maps.places.SearchBox) => void;
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
  const { isLoaded } = useJsApiLoader({
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
