import {
  setKey,
  geocode,
  RequestType,
} from 'react-geocode';

import { FunctionComponent, useEffect, useState } from 'react';
import { TextInput } from '@sanity/ui';
import { StringInputProps, set, unset } from 'sanity';
import { Geopoint } from '@sanity/google-maps-input';

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
                const { formatted_address, address_components } = results[0];
                const addresJson = address_components ? JSON.stringify({key: latLngStr, value: address_components}) : '';
                setValue(formatted_address);
                onChange(addresJson ? set(addresJson) : unset());
            })
            .catch(console.error);
        }
      } else {
        onChange(unset());
      }
  }, [geopoint])

  return (
    <TextInput {...elementProps} readOnly value={value} />
  );
};
