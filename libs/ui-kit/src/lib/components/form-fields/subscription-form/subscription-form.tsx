'use client';

import clsx from 'clsx';
import { FunctionComponent } from 'react';

import { Button } from '../../button/button';
import { Input } from '../input/input';

interface SubscriptionFormProps {
  className?: string;
}

export const SubscriptionForm: FunctionComponent<SubscriptionFormProps> = ({ className }) => {
  return (
    <form
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className={clsx('relative', className)}
    >
      <div className="relative">
        <Input
          inputClassName="!bg-white h-[54px] md:!h-[56px] 3xl:!h-[60px] !pr-[140px]"
          labelClassName="!mb-0"
          rounded="DEFAULT"
          placeholder="Your email address"
          className="mb-3 rounded-none border-none md:mb-0 lg:!rounded-xl"
        />
        <Button
          type="submit"
          variant="solid"
          rounded="DEFAULT"
          className="right-[5px] block w-full py-4 text-sm tracking-wide md:absolute md:top-[5px] md:h-[46px] md:w-auto md:px-7 lg:!rounded-lg 3xl:h-[50px]"
        >
          Subscribe
        </Button>
      </div>
    </form>
  );
}

SubscriptionForm.displayName = 'SubscriptionForm';
