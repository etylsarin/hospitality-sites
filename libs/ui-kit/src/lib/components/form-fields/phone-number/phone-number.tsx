import clsx from 'clsx';
import { FunctionComponent } from 'react';

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

const inputClasses = {
  base: 'block peer !w-full focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-200 disabled:!bg-gray-100 disabled:!text-gray-500 disabled:placeholder:!text-gray-400 disabled:!cursor-not-allowed disabled:!border-gray-200',
  error:
    '!border-red not-read-only:hover:enabled:!border-red not-read-only:focus:enabled:!border-red not-read-only:focus:!ring-red/30',
  size: {
    sm: 'py-1 !text-xs !h-8 !leading-[32px]',
    DEFAULT:
      'px-4 py-2 !text-sm !h-10 lg:!h-11 2xl:!h-12 !leading-[40px] lg:!leading-[44px] 2xl:!leading-[48px]',
    lg: 'py-2 !text-base !h-12 !leading-[48px]',
    xl: 'py-2.5 !text-base !h-14 !leading-[56px]',
  },
  rounded: {
    none: '!rounded-none',
    sm: '!rounded-sm',
    DEFAULT: '!rounded-md',
    lg: '!rounded-lg',
    pill: '!rounded-full',
  },
  variant: {
    active: {
      base: '!border !bg-gray-0 placeholder:!opacity-80 read-only:focus:!ring-0',
      color: {
        DEFAULT:
          '!border-gray-900 focus:enabled:!border-gray-1000 focus:!ring-gray-900/20 !text-gray-1000',
        primary:
          '!border-primary focus:enabled:!border-primary focus:!ring-primary/30 !text-primary-dark',
        secondary:
          '!border-secondary focus:enabled:!border-secondary focus:!ring-secondary/30 !text-secondary-dark',
        danger:
          '!border-red focus:enabled:!border-red focus:!ring-red/30 !text-red-dark',
        info: '!border-blue focus:enabled:!border-blue focus:!ring-blue/30 !text-blue-dark',
        success:
          '!border-green focus:enabled:!border-green focus:!ring-green/30 !text-green-dark',
        warning:
          '!border-orange focus:enabled:!border-orange-dark/70 focus:!ring-orange/30 !text-orange-dark',
      },
    },
    flat: {
      base: '!border-0 placeholder:!opacity-90 read-only:focus:!ring-0',
      color: {
        DEFAULT:
          '!bg-gray-200/70 hover:enabled:!bg-gray-200/90 focus:!ring-gray-900/20 !text-gray-1000 placeholder:!text-gray-600',
        primary:
          '!bg-primary-lighter/70 hover:enabled:!bg-primary-lighter/90 focus:!ring-primary/30 !text-primary-dark',
        secondary:
          '!bg-secondary-lighter/70 hover:enabled:!bg-secondary-lighter/90 focus:!ring-secondary/30 !text-secondary-dark',
        danger:
          '!bg-red-lighter/70 hover:enabled:!bg-red-lighter/90 focus:!ring-red/30 !text-red-dark',
        info: '!bg-blue-lighter/70 hover:enabled:!bg-blue-lighter/90 focus:!ring-blue/30 !text-blue-dark',
        success:
          '!bg-green-lighter/70 hover:enabled:!bg-green-lighter/90 focus:!ring-green/30 !text-green-dark',
        warning:
          '!bg-orange-lighter/80 hover:enabled:!bg-orange-lighter/90 focus:!ring-orange/30 !text-orange-dark',
      },
    },
    outline: {
      base: '!bg-transparent !border !border-gray-300 read-only:!border-gray-300 read-only:focus:!ring-0 placeholder:!text-gray-500 focus:!ring-1',
      color: {
        DEFAULT: 'focus:!border-gray-1000 focus:!ring-gray-900/20',
        primary:
          'hover:!border-primary focus:!border-primary focus:!ring-primary/30',
        secondary:
          'hover:!border-secondary focus:!border-secondary focus:!ring-secondary/30',
        danger: 'hover:!border-red focus:!border-red focus:!ring-red/30',
        info: 'hover:!border-blue focus:!border-blue focus:!ring-blue/30',
        success: 'hover:!border-green focus:!border-green focus:!ring-green/30',
        warning:
          'hover:!border-orange focus:!border-orange-dark/70 focus:!ring-orange/30',
      },
    },
    text: {
      base: '!border-0 !bg-transparent',
      color: {
        DEFAULT:
          'hover:!text-gray-1000 focus:!ring-gray-900/20 placeholder:!text-gray-500',
        primary:
          'hover:!text-primary-dark focus:!ring-primary/30 !text-primary',
        secondary:
          'hover:!text-secondary-dark focus:!ring-secondary/30 !text-secondary',
        danger: 'hover:!text-red-600 focus:!ring-red/30 !text-red',
        info: 'hover:!text-blue-dark focus:!ring-blue/30 !text-blue',
        success:
          'hover:!text-green-dark focus:!ring-green/30 !text-green placeholder:!opacity-100',
        warning:
          'hover:!text-orange-dark focus:!ring-orange/30 !text-orange placeholder:!opacity-100',
      },
    },
  },
};

export interface PhoneNumberProps {
  /** Set field label */
  label?: string;
  /** Show error message using this prop */
  error?: string;
  /** The size of the component. `"sm"` is equivalent to the dense input styling. */
  size?: keyof typeof inputClasses.size;
  /** The rounded variants are: */
  rounded?: keyof typeof inputClasses.rounded;
  /** The variants of the component are: */
  variant?: keyof typeof inputClasses.variant;
  /** Change input color */
  color?: keyof (typeof inputClasses.variant)['active']['color'];
  /** add clearable option */
  clearable?: boolean;
  /** add search filed at the top of dropdown list */
  enableSearch?: boolean;
  /** clear icon event */
  onClearClick?: (event: React.MouseEvent) => void;
  /** Use labelClassName prop to do some addition style for the field label */
  labelClassName?: string;
  /** Add custom classes for the input field */
  inputClassName?: string;
  /** Add custom classes for dropdown button */
  buttonClassName?: string;
  /** Add custom classes for dropdown */
  dropdownClassName?: string;
  /** Add custom classes for dropdown's search */
  searchClassName?: string;
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
