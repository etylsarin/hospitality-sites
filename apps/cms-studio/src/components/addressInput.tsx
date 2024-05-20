import { Geopoint } from '@sanity/google-maps-input';
import { TextInput } from '@sanity/ui';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  setKey,
  geocode,
  RequestType,
} from 'react-geocode';
import { StringInputProps, set, unset } from 'sanity';

import { getShortAddress } from '../utils/parse-address/parse-address';

export interface AddressInputProps extends StringInputProps {
  geopoint?: Geopoint;
}

export const AddressInput: FunctionComponent<AddressInputProps> = (props) => {
  const { onChange, elementProps, geopoint } = props;
  const [value, setValue] = useState<string>('');

  setKey(process.env.SANITY_STUDIO_GMAPS_API_KEY as string);

  useEffect(() => {
      if (geopoint) {
        const parsedValue = props.value ? JSON.parse(props.value) : {};
        const latLngStr = `${geopoint?.lat},${geopoint?.lng}`;
        if (latLngStr !== parsedValue.key) {
          geocode(RequestType.LATLNG, latLngStr)
            .then(({ results }) => {
                const { address_components } = results[0];
                const addresJson = address_components ? JSON.stringify({key: latLngStr, value: address_components}) : '';
                setValue(getShortAddress(JSON.stringify(address_components)));
                onChange(addresJson ? set(addresJson) : unset());
            })
            .catch((error) => {
              console.log('GEOCODE ERROR BELOW:');
              console.error(error);
            });
        } else {
          setValue(getShortAddress(props.value!));
        }
      } else {
        onChange(unset());
      }
  }, [geopoint])

  return (
    <TextInput {...elementProps} readOnly value={value} />
  );
};
