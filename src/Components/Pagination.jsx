import { PropTypes } from 'prop-types';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    // Add the first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
    }

    // Add the current page and its neighbors
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Add the last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pages.push('..');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      {/* Previous Button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center px-2 py-1 text-[12px] md:text-[13px] lg:px-2 lg:py-1 lg:text-[14px] border rounded-md text-[#7B2334] border-[#7B2334] transition-all duration-200 ease-in-out ${
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#7B2334aa] hover:text-white'
        }`}
      >
        &larr;
      </button>

      {/* Page Numbers */}
      {renderPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 text-[12px] md:px-4 md:py-2 md:text-[14px] rounded-md transition-all duration-200 ease-in-out ${
              page === currentPage
                ? 'bg-[#7B2334] text-white'
                : 'text-[#7B2334] border border-[#7B2334] hover:bg-[#7B2334aa] hover:text-white'
            }`}
          >
            {page}
          </button>
        ) : (
          <span
            key={index}
            className="px-3 py-1 text-[12px] md:px-4 md:py-2 text-[#7B2334]"
          >
            ...
          </span>
        ),
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center px-2 py-1 text-[12px] md:text-[13px] lg:px-2 lg:py-1 lg:text-[14px] border rounded-md text-[#7B2334] border-[#7B2334] transition-all duration-200 ease-in-out ${
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#7B2334aa] hover:text-white'
        }`}
      >
        &rarr;
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
