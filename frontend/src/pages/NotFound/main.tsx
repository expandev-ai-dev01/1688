/**
 * @page NotFoundPage
 * @summary 404 error page
 * @domain core
 * @type error-page
 * @category public
 */

import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <p className="mb-6 text-xl text-gray-600">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
