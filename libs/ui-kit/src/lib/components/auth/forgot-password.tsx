'use client';

import { FunctionComponent } from 'react';
import { ForgotPasswordForm } from './forgot-password-form';

export const ForgotPassword: FunctionComponent = () => {
  return (
    <div className="container mb-12 mt-8 px-4 lg:mb-16">
      <div className="m-auto w-full max-w-[496px] rounded-lg border border-gray-200 p-6 pt-9 sm:p-12">
        <div className="mb-8">
          <h2 className="mb-3 text-3xl font-bold uppercase leading-[48px] text-primary">
            Forget password
          </h2>
          <p className="text-base leading-5 text-gray">
            Enter your email to recover your account
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}

export default ForgotPassword;
