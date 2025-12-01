import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

const errorTextClasses = {
  base: 'text-red',
  size: {
    sm: 'text-[10px] mt-0.5',
    DEFAULT: 'text-xs mt-0.5',
    lg: 'text-xs mt-1',
    xl: 'text-sm mt-1',
  },
};

interface FieldErrorProps
  extends React.HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
  tag?: 'div' | 'span';
  error: string | null | undefined;
  size?: keyof typeof errorTextClasses.size;
  className?: string;
}

export const FieldError: FunctionComponent<FieldErrorProps> = ({
  tag = 'div',
  error,
  size,
  className,
}) => {
  const Component = tag;
  return (
    <Component
      role="alert"
      className={clsx(
        errorTextClasses.base,
        size && errorTextClasses.size[size],
        className
      )}
    >
      {error}
    </Component>
  );
};

FieldError.displayName = 'FieldError';
