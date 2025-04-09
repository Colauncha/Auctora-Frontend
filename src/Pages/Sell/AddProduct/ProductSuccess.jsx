import { Link } from 'react-router-dom';

function ProductSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 mb-20">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 7.293a1 1 0 00-1.414 0L9 13.586 6.707 11.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-black-800 mb-2">
          Product Added
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Success</h2>

        <p className="text-gray-500 mb-8">
          Your product has been successfully added! You can now manage your
          listings and start selling.
        </p>

        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700"
        >
          Dashboard
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Need help?{' '}
            <a href="/contact" className="text-red-500 hover:underline">
              Customer support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductSuccess;
