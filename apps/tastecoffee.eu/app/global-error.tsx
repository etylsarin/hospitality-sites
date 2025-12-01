'use client';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Something went wrong!
          </h2>
          <p className="mb-6 text-gray-600">
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
