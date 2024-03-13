'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Checkbox } from '../form-fields';
import { Button } from '../button/button';
import { useAuth, useModal } from '../../hooks';
import { FunctionComponent } from 'react';

const loginInfoSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'The email is required.' })
    .email({ message: 'The email is invalid.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be 8 character long.' }),
  remember: z.boolean(),
});

type SignInType = z.infer<typeof loginInfoSchema>;

export const SigninForm: FunctionComponent = () => {
  const { authorize } = useAuth();
  const { closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(loginInfoSchema),
  });

  // TO-DO: Send data to API onSubmit.
  function handleFormSubmit(data: SignInType) {
    console.log('Submitted data', data);
    authorize();
    closeModal();
  }

  return (
    <form noValidate onSubmit={handleSubmit((d) => handleFormSubmit(d))}>
      <Input
        type="text"
        label="Email"
        className="mb-4"
        error={errors?.email?.message}
        required
        {...register('email')}
      />
      <Input
        type="password"
        label="Password"
        className="mb-4"
        error={errors?.password?.message}
        required
        {...register('password')}
      />
      <div className="mb-7 flex items-center justify-between">
        <Checkbox
          size="sm"
          label="Remember Me"
          labelClassName="ml-2"
          inputClassName="!text-gray-dark"
          {...register('remember')}
        />
        <Link
          href="#"
          className="  text-sm font-semibold leading-6 text-primary underline"
        >
          Forget Password?
        </Link>
      </div>
      <Button type="submit" className="mb-2 w-full" size="xl">
        Sign In
      </Button>
      <p className="text-sm font-semibold leading-6 text-gray">
        Not member yet?{' '}
        <Link href="#" className="text-primary underline">
          Create an account
        </Link>
      </p>
      <div className="relative mb-8 mt-7 text-center before:absolute before:left-0 before:top-1/2 before:h-[1px] before:w-full before:bg-gray-200">
        <span className="relative z-10 m-auto inline-flex bg-white px-5">
          Or
        </span>
      </div>
    </form>
  );
}
