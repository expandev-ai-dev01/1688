/**
 * @component ErrorMessage
 * @summary Error message display component
 * @domain core
 * @type ui-component
 * @category feedback
 */

import type { ErrorMessageProps } from './types';

export const ErrorMessage = (props: ErrorMessageProps) => {
  const { title, message, onRetry, onBack } = props;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="mb-2 text-xl font-semibold text-red-900">{title}</h2>
        <p className="mb-6 text-red-700">{message}</p>
        <div className="flex justify-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-md border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
