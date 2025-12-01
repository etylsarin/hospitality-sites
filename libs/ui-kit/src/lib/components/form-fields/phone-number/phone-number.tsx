import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import { FieldError } from '../field-error/field-error';
import { FieldHelperText } from '../field-helper-text/field-helper-text';

const labelClasses = {
  size: {
    sm: 'text-xs mb-1',
    DEFAULT: 'text-sm mb-1.5',
    lg: 'text-sm mb-2',
    xl: 'text-base mb-2',
  },
};

type InputSize = 'sm' | 'DEFAULT' | 'lg' | 'xl';

export interface PhoneNumberProps {
  /** Set field label */
  label?: string;
  /** Show error message using this prop */
  error?: string;
  /** The size of the component. `"sm"` is equivalent to the dense input styling. */
  size?: InputSize;
  /** Use labelClassName prop to do some addition style for the field label */
  labelClassName?: string;
  /** This prop allows you to customize the helper message style */
  helperClassName?: string;
  /** This prop allows you to customize the error message style */
  errorClassName?: string;
  /** Add helper text. It could be string or a React component */
  helperText?: React.ReactNode;
  /** Add custom classes into the component wrapper for extra style like spacing */
  className?: string;
}

/**
 * A basic widget for getting the user input. Here is the API documentation of the PhoneNumber component.
 * And the rest of the props are the same as props for PhoneInput component of `react-phone-input-2`.
 * Please follow their documentation for any query -> https://www.npmjs.com/package/react-phone-input-2
 */
export const PhoneNumber: FunctionComponent<PhoneNumberProps> = ({
  size = 'DEFAULT',
  label,
  helperText,
  error,
  labelClassName,
  helperClassName,
  errorClassName,
  className,
}) => {
  return (
    <div className={clsx('aegon-phone-number', className)}>
      {label && (
        <label
          className={clsx('block', labelClasses.size[size], labelClassName)}
        >
          {label}
        </label>
      )}
      <div className="group/phone-number relative" />
      {!error && helperText && (
        <FieldHelperText size={size} className={helperClassName}>
          {helperText}
        </FieldHelperText>
      )}
      {error && (
        <FieldError size={size} error={error} className={errorClassName} />
      )}
    </div>
  );
};

PhoneNumber.displayName = 'PhoneNumber';
