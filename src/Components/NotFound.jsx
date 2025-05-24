import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 mb-20">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-black-800 mb-2">
          404 Error
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          removed. Please check the URL or go back to our homepage.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700"
        >
          Return to Homepage
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Need help?{' '}
            <a href="/contact-us" className="text-red-500 hover:underline">
              Customer support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
