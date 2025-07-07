import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { current, formatDateTime } from "../../utils";
import Loader from '../../assets/loader2';
import Pagination from '../../Components/Pagination';

const Notify = () => {
  const [notice, setNotice] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('asc');
  const [loading, setLoading] = useState(false);

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
    };
    fetchNotifications(inboxEndpoint, setNotice, setTotal);
  }, [currentPage]);

  const handleNotificationSort = () => {
    setNotice((prev) => prev.reverse());
    setSort((prevSort) => (prevSort === 'desc' ? 'asc' : 'desc'));
  };

  const toggleRead = async (id) => {
    const tempNotice = notice;
    const tempTotal = total;
    setNotice((prev) => prev.filter((item) => item.id !== id));

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
    const data = await response.json();
    setTotal((prev) => prev - 1);
    sessionStorage.setItem(
      'notification',
      JSON.stringify({
        data: tempNotice.filter((item) => item.id !== id),
        total: tempTotal - 1,
      }),
    );
    if (!data.data) {
      setNotice(tempNotice);
      setTotal(tempTotal);
      sessionStorage.setItem(
        'notification',
        JSON.stringify({ data: tempNotice, total: tempTotal }),
      );
    }
  };

  return (
    <div className="bg-[#FFEEF499] rounded-xl shadow-lg">
      {/* <Loader /> */}
      <div className="flex justify-between items-center border-b-[1px] p-4">
        <h1 className="text-[16px] lg:text-[28px] font-[700]">Notifications</h1>
        <button
          className="cursor-pointer font-[200] flex items-center gap-1"
          onClick={(e) => handleNotificationSort(e)}
        >
          Sort by Time{' '}
          {sort === 'asc' ? (
            <FaArrowDown className="inline" />
          ) : (
            <FaArrowUp className="inline" />
          )}
        </button>
      </div>
      {/* Tabs */}
      <div className="flex mt-3 border-b">
        <button
          className={`flex-1 py-2 font-semibold border-b-2 border-[#9f3248] text-[#9f3248]`}
          onClick={() => {}}
        >
          Inbox{' '}
          <span className="bg-[#9f3248] text-white px-2 rounded-full text-sm">
            {total}
          </span>
        </button>
      </div>

      {/* Notification List */}
      <div className="flex flex-col mt-3">
        {notice?.length === 0 ? (
          <div className="flex items-center justify-around h-[30vh] w-[60%] ml-[20%]">
            {loading ? (
              <Loader />
            ) : (
              <p className="text-center text-gray-500">No notifications</p>
            )}
          </div>
        ) : (
          notice.map((item) => (
            <div
              key={item?.id}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm mb-2"
            >
              <div className="ml-3 flex-1">
                <p className="font-bold text-[18px]">{item?.title}</p>
                <p className="text-red-500">{item?.message}</p>
                <p className="text-gray-400 text-sm">
                  {formatDateTime(item?.created_at)}
                </p>
              </div>
              <button
                className="text-gray-600"
                onClick={async () => await toggleRead(item?.id)}
              >
                Mark as read ✉️
              </button>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-full max-w-4xl flex flex-col items-center gap-4">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          {loading && (
            <div className="flex items-center justify-center">
              <Loader otherStyles="h-5 w-5 border-2" />
            </div>
          )}

          <div className="w-full text-center mt-2">
            <p className="text-gray-500 text-sm">
              Showing {notice.length} of {total} notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notify;