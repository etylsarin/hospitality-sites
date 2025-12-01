'use client';

import { FunctionComponent, useEffect } from 'react';

export interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = ({
  error,
  reset,
}) => {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-16">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="mb-6 max-w-md text-gray-600">
          We apologize for the inconvenience. Please try again or contact
          support if the problem persists.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

ErrorBoundary.displayName = 'ErrorBoundary';
