import { Link } from 'react-router-dom';
import { Construction } from '../../Constants';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 mb-20">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-8">
          <img className="w-28 h-28" src={Construction} alt="" />
        </div>
        {/* 
        <h1 className="text-3xl font-extrabold text-black-800 mb-2">
          Page 
        </h1> */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Page under construction
        </h2>

        <p className="text-gray-500 mb-8">
          Oops! The page you&apos;re looking is currently under construction.
          Please check back some other time.
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
            <a href="/contact" className="text-red-500 hover:underline">
              Customer support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
