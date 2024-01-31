'use client';

import { Location } from 'queries';

import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { FunctionComponent, useEffect } from 'react';

interface MapViewProps {
  geopoint: Location;
  googleMapsApiKey: string;
  mapContainerClassName?: string;
}

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
};

export const MapView: FunctionComponent<MapViewProps> = ({ mapContainerClassName, geopoint, googleMapsApiKey }) => {
  useEffect(() => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${geopoint.lat},${geopoint.lng}&key=${googleMapsApiKey}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }, [])


  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
  });

  if (!isLoaded) {
    return <span>Loading...</span>;
  }

  return (
    <GoogleMap
      mapContainerClassName={mapContainerClassName}
      center={geopoint}
      zoom={16}
      options={options}
    ></GoogleMap>
  );
}

MapView.displayName = 'MapView';
