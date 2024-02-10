import { ComponentType, useCallback } from 'react';
import { FieldMember, InputProps, MemberField, ObjectInputProps, StringInputProps } from 'sanity';
import { Stack } from '@sanity/ui';
import { AddressInput } from './addressInput';

export interface GeolocationObjectProps {
    [key: string]: any;
}

export type GeolocationObjectInputProps = ObjectInputProps<GeolocationObjectProps>;

export const GeolocationObjectInput: ComponentType<GeolocationObjectInputProps> = ({ value, members, renderField, renderInput, renderItem, renderPreview }) => {
    const geopointMember = members.find(
        (member): member is FieldMember => member.kind === 'field' && member.name === 'geopoint'
    )
    const addressMember = members.find(
        (member): member is FieldMember => member.kind === 'field' && member.name === 'address'
    )

      // Define a custom renderInput function
  const customRenderInput = useCallback(
    (renderInputCallbackProps: Omit<InputProps, 'renderDefault'>) => {
      return (
          <AddressInput {...(renderInputCallbackProps as StringInputProps)} geopoint={value?.geopoint} />
      )
    },
    [renderInput, value?.geopoint]
  )

    return (
        <Stack space={4}>
            {addressMember && (
                <MemberField
                    member={addressMember}
                    renderInput={customRenderInput}
                    renderField={renderField}
                    renderItem={renderItem}
                    renderPreview={renderPreview}
                />
            )}
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