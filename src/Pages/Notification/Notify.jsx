import { FaArrowDown, FaArrowUp, FaBell } from 'react-icons/fa';
import { Eye, Link } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { NotifContext } from '../../Store/notifContex';
import Loader from '../../assets/loader2';
import PropTypes from 'prop-types';
import { current } from '../../utils';

const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Previous
      </button>

      {pages
        .slice(
          Math.max(0, currentPage - 3),
          Math.min(totalPages, currentPage + 2),
        )
        .map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              currentPage === page
                ? 'bg-gradient-to-r from-[#9f3248] to-[#de506d] text-white shadow-lg'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20'
            }`}
          >
            {page}
          </button>
        ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

const Notify = () => {
  const { notifTotal, setNotifTotal } = useContext(NotifContext);
  const [notice, setNotice] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setLoading(true);
    const inboxEndpoint = `${current}users/notifications?page=${currentPage}&per_page=10`;
    const fetchNotifications = async (endpoint, func, func2) => {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          setLoading(false);
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch notifications');
        }
        const data = await response.json();
        console.log(data);
        func(data.data);
        func2(data.total);
        setTotalPages(data.pages);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications(inboxEndpoint, setNotice, setTotal);
  }, [currentPage]);

  const handleNotificationSort = () => {
    setNotice((prev) => prev.reverse());
    setSort((prevSort) => (prevSort === 'desc' ? 'asc' : 'desc'));
  };

  const toggleRead = async (id) => {
    setDeletingId(id);

    try {
      const endpoint = `${current}users/notifications/${id}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ read: true }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || 'An error occurred while updating the notification.',
        );
      }

      // const data = await response.json();

      // Animate removal
      setNotifTotal(notifTotal > 0 ? notifTotal - 1 : 0);
      setTimeout(() => {
        setNotice((prev) => prev.filter((item) => item.id !== id));
        setTotal((prev) => prev - 1);
        setDeletingId(null);
      }, 300);
    } catch (error) {
      console.error('Error updating notification:', error);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-[#9f3248] to-[#de506d] p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-white space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-white/20 rounded-full">
                  <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    Notifications
                  </h1>
                  <p className="text-red-100 mt-1 text-sm sm:text-base">
                    Stay updated with your latest activities
                  </p>
                </div>
              </div>
              <button
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                onClick={handleNotificationSort}
              >
                <span className="font-medium">Sort by Time</span>
                {sort === 'asc' ? (
                  <FaArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <FaArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <div className="flex">
              <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#9f3248] to-[#de506d] text-white rounded-lg shadow-lg text-sm sm:text-base">
                <span className="font-semibold">Inbox</span>
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                  {total}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notice?.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12">
              <div className="text-center">
                {loading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <Loader />
                    <p className="text-gray-600 font-medium">
                      Loading your notifications...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FaBell className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No notifications yet
                      </h3>
                      <p className="text-gray-500">
                        You&apos;re all caught up! Check back later for new
                        updates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            notice.map((item, index) => (
              <div
                key={item?.id}
                className={`group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  deletingId === item?.id
                    ? 'opacity-50 scale-95'
                    : 'hover:scale-[1.02]'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.5s ease-out forwards',
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between relative">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#9f3248] to-[#de506d] rounded-full"></div>
                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                          {item?.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 leading-relaxed pl-4">
                        {item?.message}
                      </p>

                      <div className="flex flex-col md:flex-row md:gap-0 items-start gap-2 md:items-center md:space-x-4 pl-4">
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{formatDateTime(item?.created_at)}</span>
                        </div>

                        {item?.class_name && (
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full">
                            {item.class_name}
                          </span>
                        )}
                        {item?.links && item?.links.length > 0 && (
                          <a
                            href={item.links[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#9f3248] font-medium hover:underline"
                          >
                            <Link className="inline-block w-4 h-4 mr-1" />
                            View Details
                          </a>
                        )}
                      </div>
                    </div>

                    <div
                      className="absolute bottom-0.5 right-1 md:relative ml-4 flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                      onClick={() => {
                        toggleRead(item?.id);
                      }}
                      disabled={deletingId === item?.id}
                    >
                      {deletingId === item?.id ? (
                        <Loader otherStyles="h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <div className="relative group flex items-center">
                          <Eye className="w-4 h-4 text-[#de506d]" />
                          <span className="absolute hidden group-hover:block -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-gray-700 text-white text-xs rounded shadow-lg">
                            Mark as Read
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {notice?.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="overflow-x-auto w-full flex justify-center">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>

              {loading && (
                <div className="flex items-center space-x-2">
                  <Loader otherStyles="h-4 w-4 sm:h-5 sm:w-5 border-2" />
                  <span className="text-gray-600 text-sm sm:text-base">
                    Loading...
                  </span>
                </div>
              )}

              <p className="text-gray-500 text-xs sm:text-sm text-center">
                Showing{' '}
                <span className="font-semibold text-gray-700">
                  {notice.length}
                </span>{' '}
                of <span className="font-semibold text-gray-700">{total}</span>{' '}
                notifications
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Notify;
