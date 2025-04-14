function Preloader() {
  return (
    <div className="w-full flex justify-center py-8">
      {' '}
      <div className="w-full max-w-[1280px] px-4 text-center">
        {' '}
        <div className="animate-pulse flex space-x-4">
          {' '}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 space-y-4 py-1">
              {' '}
              <div className="h-48 bg-gray-200 rounded"></div>{' '}
              <div className="space-y-2">
                {' '}
                <div className="h-4 bg-gray-200 rounded"></div>{' '}
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>{' '}
              </div>{' '}
            </div>
          ))}{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}

export default Preloader;
