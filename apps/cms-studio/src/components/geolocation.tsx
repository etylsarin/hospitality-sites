import {
    setKey,
    geocode,
    RequestType,
  } from 'react-geocode';
import { ComponentType, useEffect, useState } from 'react';
import { FieldMember, MemberField, ObjectInputProps, ObjectSchemaType, set } from 'sanity';
import { Stack, Text } from '@sanity/ui';
import { Geopoint } from '@sanity/google-maps-input';

export const Geolocation: ComponentType<ObjectInputProps<Record<string, any>, ObjectSchemaType>> = ({ members, renderField, renderInput, renderItem, renderPreview }) => {
    const geopointMember = members.find(
        (member): member is FieldMember => member.kind === 'field' && member.name === 'geopoint'
    )
    const [address, setAddress] = useState('');

    setKey(process.env.SANITY_STUDIO_GMAPS_API_KEY as string);

    useEffect(() => {
        const geopoint = geopointMember?.field.value as Geopoint;
        geocode(RequestType.LATLNG, `${geopoint?.lat},${geopoint?.lng}`)
        .then(({ results }) => {
            const address = results[0].formatted_address;
            setAddress(address);
            set({ address }, ['geoaddress']);
        })
        .catch(console.error);
    }, [geopointMember?.field.value])

    return (
        <Stack space={4}>
            <Text size={1}>{address}</Text>
            {geopointMember && (
                <MemberField
                    member={geopointMember}
                    renderInput={renderInput}
                    renderField={renderField}
                    renderItem={renderItem}
                    renderPreview={renderPreview}
                />
            )}
        </Stack>
    );
};