'use client';

import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { FunctionComponent } from 'react';
import { Geopoint } from '@sanity/google-maps-input';

interface MapViewProps {
  geopoint: Geopoint;
  googleMapsApiKey: string;
  mapContainerClassName?: string;
}

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

export const MapView: FunctionComponent<MapViewProps> = ({ mapContainerClassName, geopoint, googleMapsApiKey }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
  });

  if (!isLoaded) {
    return <span>Loading...</span>;
  }

  return (
    <GoogleMap
      mapContainerClassName={mapContainerClassName}
      center={{ lat: geopoint.lat, lng: geopoint.lng }}
      zoom={16}
      options={options}
    ></GoogleMap>
  );
}

MapView.displayName = 'MapView';
