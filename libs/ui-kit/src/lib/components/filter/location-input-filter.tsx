'use client';

/* global google */

import { useRouter, useSearchParams } from 'next/navigation';
import { FunctionComponent, useEffect, useState, ChangeEvent } from 'react';

import { Input } from '../form-fields';
import { MapMarkerIcon } from '../icons';
import { SearchAutocomplete } from '../search-autocomplete/search-autocomplete';
import { MapsConfigProps } from 'queries';

export interface LocationInputFilterProps {
  maps: MapsConfigProps;
}

export const LocationInputFilter: FunctionComponent<LocationInputFilterProps> = ({ maps }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams?.get('location');

  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [locationInput, setLocationInput] = useState({
    searchedLocation: location || '',
  });

  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref);

  const onPlacesChanged = () => {
    if (!searchBox) return;
    
    const places = searchBox.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (!place) return;
    
    const address = place.formatted_address || place.name || '';
    
    setLocationInput({ searchedLocation: address });

    // Only pass location name - geocoding happens server-side
    const url = new URL(window.location.href);
    url.searchParams.set('location', address);
    
    router.push(`/places${url.search}`);
  };

  // Sync with URL when reset
  useEffect(() => {
    if (!location) {
      setLocationInput({ searchedLocation: '' });
    } else {
      setLocationInput({ searchedLocation: location });
    }
  }, [location]);

  function handleClearClick() {
    setLocationInput({ searchedLocation: '' });
    
    const url = new URL(window.location.href);
    url.searchParams.delete('location');
    router.push(`/places${url.search}`);
  }

  return (
    <SearchAutocomplete
      maps={maps}
      onLoad={onLoad}
      onPlacesChanged={onPlacesChanged}
      loader={
        <Input
          type="text"
          label="Search Destination"
          inputClassName="!text-sm !pl-12"
          labelClassName="lg:!text-base !mb-2 text-gray-dark"
          startIcon={<MapMarkerIcon className="h-5 w-5" />}
          startIconClassName="!left-1"
          placeholder="Loading . . ."
          disabled
        />
      }
    >
      <Input
        type="text"
        label="Search Destination"
        inputClassName="!text-sm !pl-12"
        labelClassName="lg:!text-base !mb-2 text-gray-dark"
        startIcon={<MapMarkerIcon className="h-5 w-5" />}
        startIconClassName="!left-1"
        placeholder="Pilsen, Prague..."
        required
        clearable={!!locationInput.searchedLocation}
        endIcon={true}
        onClearClick={handleClearClick}
        value={locationInput.searchedLocation}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setLocationInput({ searchedLocation: event.target.value });
        }}
      />
    </SearchAutocomplete>
  );
};

LocationInputFilter.displayName = 'LocationInputFilter';
