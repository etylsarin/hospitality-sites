'use client';

import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { makeQueryString } from '../../utils';
import { LocationInput}  from '../location-input/location-input';
import { SearchAutocomplete } from '../search-autocomplete/search-autocomplete';
import { MapMarkerIcon } from '../icons';
import { Text } from '../text/text';
import { Button } from '../button/button';
import { MapsConfigProps } from 'queries';

type QueryStringType = {
  location?: string;
};

export interface SearchFormProps {
  domain: string;
  maps: MapsConfigProps;
}

export const SearchForm: FunctionComponent<SearchFormProps> = ({ domain, maps }) => {
  const router = useRouter();
  const [searchBox, setSearchBox] = useState<any>();
  const [locationInput, setLocationInput] = useState({
    searchedLocation: '',
    searchedPlaceAPIData: [],
  });

  const onLoad = (ref: any) => setSearchBox(ref);
  const onPlacesChanged = () => {
    const places = searchBox?.getPlaces();
    setLocationInput({
      searchedLocation: places && places[0] && places[0].formatted_address,
      searchedPlaceAPIData: places ? places : [],
    });
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    let queryString = '';
    const queryObj: QueryStringType = {
      location: locationInput.searchedLocation,
    };
    queryString = makeQueryString(queryObj);
    router.push(`/places?${queryString}`);
  };

  return (
    <form
      noValidate
      onSubmit={handleFormSubmit}
      className="relative z-[2] w-full max-w-[450px] rounded-lg bg-white p-6 shadow-2xl sm:m-0 sm:max-w-[380px] sm:p-7 sm:pt-9 md:max-w-[400px] md:shadow-none lg:rounded-xl xl:max-w-[460px] xl:p-9 4xl:max-w-[516px] 4xl:p-12"
    >
      <div className="mb-3 sm:mb-0">
        <span className="mb-2 hidden font-satisfy text-xl leading-7 text-gray-dark sm:block 4xl:text-[28px] 4xl:leading-[44px]">
          Enjoy your exploration
        </span>
        <Text
          tag="h1"
          className="leading-12 mb-2 !text-xl !font-black uppercase text-gray-dark sm:!text-[28px] sm:!leading-9  4xl:!text-4xl 4xl:!leading-[52px]"
        >
          Discover the <br className="hidden sm:block" />
          world of {domain}
        </Text>
        <Text className="mb-5 hidden leading-6 !text-secondary sm:block 3xl:leading-8 4xl:mb-6 4xl:text-lg">
          Find the best {domain} places in Eurpoe<br />and become real expert in {domain} tasting.
        </Text>
      </div>
      <SearchAutocomplete
        onLoad={onLoad}
        onPlacesChanged={onPlacesChanged}
        maps={maps}
        loader={
          <LocationInput
            label="Loading . . ."
            icon={<MapMarkerIcon className="h-6 w-6 text-gray" />}
            className="mb-3"
            disabled
          />
        }
      >
        <LocationInput
          label="Location"
          icon={<MapMarkerIcon className="h-6 w-6 text-gray" />}
          className="mb-3"
          value={locationInput.searchedLocation || ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setLocationInput({
              ...locationInput,
              searchedLocation: event.target.value,
            })
          }
        />
      </SearchAutocomplete>
      <Button
        type="submit"
        className="w-full !py-[14px] text-sm !font-bold uppercase leading-6 md:!py-[17px] md:text-base lg:!rounded-xl 3xl:!py-[22px]"
        rounded="lg"
        size="xl"
      >
        Submit
      </Button>
    </form>
  );
}

SearchForm.displayName = 'SearchForm';
