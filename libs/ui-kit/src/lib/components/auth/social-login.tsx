'use client';

import { Button } from '../button/button';
import { AppleIcon, FBIcon, GoogleIcon } from '../icons';
import { useAuth, useModal } from '../../hooks';
import { FunctionComponent } from 'react';

export const SocialLogin: FunctionComponent = () => {
  const { closeModal } = useModal();
  const { authorize } = useAuth();

  const handleSocialLogin = () => {
    authorize();
    closeModal();
  };

  return (
    <>
      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
      >
        <FBIcon className="mr-5" />
        Sign up with Facebook
      </Button>
      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="mb-3 w-full"
      >
        <GoogleIcon className="mr-5" />
        Sign up with Google
      </Button>

      <Button
        onClick={handleSocialLogin}
        type="button"
        variant="outline"
        size="xl"
        className="w-full"
      >
        <AppleIcon className="mr-5" />
        Sign up with Apple
      </Button>
    </>
  );
}
