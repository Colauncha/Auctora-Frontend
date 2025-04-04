import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { current, formatDateTime } from "../../utils";
import Loader from "../../assets/loader2"; // Update the path to the correct location of the Loader component

const Notify = () => {
  const [notice, setNotice] = useState([]);
  const [read, setRead] = useState([]);
  const [activeTab, setActiveTab] = useState("notice");
  const [sort, setSort] = useState("asc");
  const [loading, setLoading] = useState(false);
  const notifications = {
    notice: notice,
    read: read,
  };

  useEffect(() => {
    setLoading(true);
    const inboxEndpoint = `${current}users/notifications`;
    const readEndpoint = `${current}users/notifications/?read=true`;
    const fetchNotifications = async (endpoint, func) => {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch notifications");
      }
      const data = await response.json();
      func(data.data);
      setLoading(false);
    }
    fetchNotifications(inboxEndpoint, setNotice);
    fetchNotifications(readEndpoint, setRead);
  }, []);

  const handleNotificationSort = () => {
    setNotice((prev) => prev.reverse());
    setRead((prev) => prev.reverse());
    setSort((prevSort) => (prevSort === "desc" ? "asc" : "desc"));
  };

  const toggleRead = async (id, read_) => {
    const tempNotice = notice;
    const tempRead = read;
    if (!read_) {
      setNotice((prev) => prev.filter((item) => item.id !== id));
      setRead((prev) => [...prev, tempNotice.find((item) => {
        item.read = true;
        return item.id === id
      })]);
    } else {
      setRead((prev) => prev.filter((item) => item.id !== id));
      setNotice((prev) => [...prev, tempRead.find((item) => {
        item.read = false;
        return item.id === id
      })]);
    }

    const endpoint = `${current}users/notifications/${id}`;
    const response = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify({ read: !read_ }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "An error occurred while updating the notification.");
    }
    const data = await response.json();
    if (!data.data && !read_) {
      setNotice(tempNotice);
      setRead(tempRead);
    } else if (!data.data && read_) {
      setRead(tempRead);
      setNotice(tempNotice);
    }
  };

  return (
    <div className="bg-[#FFEEF499] rounded-xl shadow-lg">
      {/* <Loader /> */}
      <div className="flex justify-between items-center border-b-[1px] p-4">
        <h1 className="text-[16px] lg:text-[28px] font-[700]">Notifications</h1>
        <button
          className="cursor-pointer font-[200] flex items-center gap-1"
          onClick={e => handleNotificationSort(e)}
        >
          Sort by Time {sort === "asc" ? <FaArrowDown className="inline" /> : <FaArrowUp className="inline" />}
        </button>
      </div>
      {/* Tabs */}
      <div className="flex mt-3 border-b">
        <button
          className={`flex-1 py-2 font-semibold ${
            activeTab === "notice"
              ? "border-b-2 border-[#9f3248] text-[#9f3248]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("notice")}
        >
          Inbox{" "}
          <span className="bg-[#9f3248] text-white px-2 rounded-full text-sm">
            {notice.length}

          </span>
        </button>
        <button
          className={`flex-1 py-2 font-semibold ${
            activeTab === "read"
              ? "border-b-2 border-gray-500 text-gray-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("read")}
        >
          Read{" "}
          <span className="bg-gray-500 text-white px-2 rounded-full text-sm">
            {read.length}
          </span>
        </button>
      </div>

      {/* Notification List */}
      <div className="flex flex-col mt-3">
        {notifications[activeTab]?.length === 0 ? (
          <div className="flex items-center justify-around h-[30vh] w-[60%] ml-[20%]">
            {loading ? <Loader /> : <p className="text-center text-gray-500">No notifications</p>}
          </div>

        ) : (
          notifications[activeTab]?.map((item) => (
            <div
              key={item?.id}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm mb-2"
            >
              <div className="ml-3 flex-1" onClick={async () => await toggleRead(item?.id, item?.read)}>
                <p className="font-bold text-[18px]">{item?.title}</p>
                <p className="text-red-500">
                  {item?.message}
                </p>
                <p className="text-gray-400 text-sm">{formatDateTime(item?.created_at)}</p>

              </div>
              <button
                className="text-gray-600"
                onClick={async () => await toggleRead(item?.id, item?.read)}
              >
                {activeTab == "notice" ? "Mark as read ✉️" : "Mark as unread 📩"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notify;