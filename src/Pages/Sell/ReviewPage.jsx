import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '../../utils/toast';
import Loader from '../../assets/loader2';
import LoaderW from '../../assets/loaderWhite';
import { current, currencyFormat, capitalize, authFetch } from '../../utils';
import { CiWarning, CiCircleCheck } from 'react-icons/ci';
import { HiOutlineReceiptRefund } from 'react-icons/hi2';
import { TbClockHour4 } from 'react-icons/tb';
import { MdViewInAr } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import { Star } from 'lucide-react';
import PropTypes from 'prop-types';
import useAuthStore from '../../Store/AuthStore';
import ChatSection from '../../Components/Chat/ChatSection';

const ReviewPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [payment, setPayment] = useState({});
  // const [images, setImages] = useState([]);
  const [userImage, setUserImages] = useState('');
  const [loading, setLoading] = useState(true);
  const [fLoading, setFLoading] = useState(false);
  const [iLoading, setILoading] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [showChatSection, setShowChatSection] = useState(false);
  // const [reviewSection, setReviewSection] = useState(false);
  const navigate = useNavigate();
  const id = useLocation().pathname.split('/').pop();
  const user = useAuthStore((state) => state.data);

  useEffect(() => {
    setReload(false);
    const endpoint = `${current}auctions/${id}`;
    const fetchAuctionDetails = async () => {
      try {
        const response = await authFetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Unable to fetch auction details');
        }
        const data = await response.json();
        console.log(data);
        if (data?.data?.payment?.from_id !== user.id) {
          toastError(
            'You did not win this auction',
            'Please check out other auctions, Redirecting to ongoing auction page'
          );
          navigate(`/Ongoing-Auction`);
          return;
        }
        if (data?.data?.status !== 'completed') {
          // 'active' is for demonstration, change this to 'completed'
          console.log(data?.data?.status);
          toastError(
            'Auction not completed',
            'Please check the auction status, Redirecting to auction page'
          );
          navigate(`/product-details/${id}`);
          return;
        }
        setAuctions(data?.data);
        setPayment(data?.data?.payment);
        setUserImages(data?.data?.user?.image_link?.link || '');
        setLoading(false);
      } catch (error) {
        toastError(error.message || 'Failed to fetch auction details');
        setLoading(false);
      }
    };
    fetchAuctionDetails();
  }, [id, navigate, user, reload]);

  const paymentStatMap = {
    pending: { cls: 'bg-blue-100 text-blue-800', icon: TbClockHour4 },
    completed: { cls: 'bg-green-100 text-green-800', icon: CiCircleCheck },
    inspecting: { cls: 'bg-yellow-100 text-yellow-800', icon: MdViewInAr },
    refunding: {
      cls: 'bg-yellow-100 text-yellow-800',
      icon: HiOutlineReceiptRefund,
    },
    refunded: { cls: 'bg-red-100 text-red-800', icon: HiOutlineReceiptRefund },
  };

  const Icon = paymentStatMap[payment?.status]?.icon || '';

  const runFetch = async ({ endpoint, method, body }) => {
    try {
      const response = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error:', error);
      toastError('Error', error.message);
      return false;
    }
  };

  const handleInspecting = async () => {
    setILoading(true);
    const endpoint = `${current}auctions/set_inspecting/${id}`;
    const method = 'PUT';

    let resp = await runFetch({ endpoint, method });
    console.log('Handle inspecting resp: ', resp);
    if (resp) {
      setILoading(false);
      toastSuccess('Inspection mode activated', 'Product is being inspected');
      setReload(true);
      // navigate(`/product/finalize/${id}`);
    } else {
      setILoading(false);
      toastError('Unable to start inspection', 'Please try again');
    }
  };

  const handleFinalize = async () => {
    setFLoading(true);
    const endpoint = `${current}auctions/finalize/${id}`;
    const method = 'GET';

    let resp = await runFetch({ endpoint, method });
    if (resp) {
      setFLoading(false);
      toastSuccess('Auction finalized', 'Auction has been finalized');
      setReload(true);
      // setReviewSection(true);
    } else {
      setFLoading(false);
      toastError('Unable to finalize auction', 'Please try again');
    }
  };

  const handleRequestRefund = async () => {
    setRLoading(true);
    const endpoint = `${current}auctions/refund/${id}`;
    const method = 'GET';

    let resp = await runFetch({ endpoint, method });
    if (resp) {
      setRLoading(false);
      toastSuccess('Refund requested', 'Refund request has been sent');
      setReload(true);
    } else {
      setRLoading(false);
      toastError('Unable to request refund', 'Please try again');
    }
    // navigate(`/product-details/${id}`);
  };

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const StarRating = ({ rating = 0 }) => {
    const displayRating = hoverRating || selectedRating || rating;

    return (
      <>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-7 h-7 cursor-pointer transition-colors ${
              i < displayRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-transparent'
            }`}
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setSelectedRating(i + 1)}
          />
        ))}
      </>
    );
  };

  StarRating.propTypes = {
    rating: PropTypes.number,
  };

  const handleRating = () => {
    // Handle the rating submission logic here
    const userId = payment.to_id || auctions.user.id;
    const endpoint = `${current}users/rating/${userId}?rating=${selectedRating}`;

    try {
      const resp = runFetch({
        endpoint,
        method: 'PUT',
        body: JSON.stringify({ rating: selectedRating }),
      });
      if (resp) {
        toastSuccess('Rating submitted', 'Thank you for your feedback!');
      }
    } catch (error) {
      toastError('Error', error.message || 'Failed to submit rating');
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="py-6 px-5 mb-[40px]">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#9F3247] mb-4">
                Congrat<span className="text-[#7B2334]">ulations</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                You have successfully purchased the auction item. Here are the
                details of your purchase:
              </p>

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-[#9F3247] mb-4">
                  Auction Details
                </h2>
                <div className="flex flex-col items-start w-full md:w-[60%] border-r flex-wrap">
                  <p className="text-md text-gray-500 font-light">
                    <span className="text-gray-600 font-bold">Auction ID:</span>{' '}
                    {auctions.id}
                  </p>
                  <p className="text-md text-gray-500 font-light">
                    <span className="text-gray-600 font-bold">Item Name:</span>{' '}
                    {capitalize(auctions?.item[0].name) || 'null'}
                  </p>
                  <p className="text-md text-gray-500 font-light">
                    <span className="text-gray-600 font-bold">
                      Winning Bid:
                    </span>{' '}
                    {currencyFormat(auctions.current_price)}
                  </p>
                  <p className="text-md text-gray-500 font-light">
                    <span className="text-gray-600 font-bold">
                      Auction Status:
                    </span>{' '}
                    {capitalize(auctions.status)}
                  </p>
                  <p className="text-md text-gray-500 font-light">
                    <span className="text-gray-600 font-bold">
                      Pickup Address:
                    </span>{' '}
                    {auctions.pickup_address || 'null'}
                  </p>
                  {auctions.pickup_latitude && auctions.pickup_latitude ? (
                    <p className="text-md text-gray-500 font-light">
                      <span className="text-gray-600 font-bold">
                        Pickup Location:
                      </span>{' '}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${auctions?.pickup_latitude},${auctions?.pickup_longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View on Google Maps
                      </a>
                    </p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>

            <div
              id="actions"
              className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-[#9F3247] mb-6 border-b pb-2">
                Seller&apos;s Details
              </h2>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex w-full  md:w-[90%] border-r flex-col items-start justify-start gap-5 mb-4 md:flex-row md:items-center">
                  <div className="w-20 h-20 rounded-full border-2 bg-purple-200 flex items-center justify-center mr-4 overflow-hidden">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt="Profile-photo"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FiUser className="text-gray-500" size={40} />
                    )}
                  </div>
                  <div>
                    <p className="text-md text-gray-500 font-light">
                      <span className="text-gray-600 mr-2 font-bold">
                        Seller email:
                      </span>
                      {auctions?.user.email || 'null'}
                    </p>
                    <p className="text-md text-gray-500 font-light">
                      <span className="text-gray-600 mr-2 font-bold">
                        Seller Phone:
                      </span>
                      {auctions?.user.phone_number || 'null'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => setShowChatSection(!showChatSection)}
                    className="px-5 py-2 rounded-full bg-[#9f3247] text-white shadow-md hover:shadow-lg"
                  >
                    chat
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <div className="flex justify-between items-end mb-6 border-b pb-2 gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-[#9F3247]">
                  Finalize Auction
                </h2>
                <div
                  className={`rounded-md p-2 ${
                    paymentStatMap[payment?.status]?.cls ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  <Icon className="inline mx-1" size={20} />
                  {capitalize(payment?.status) || 'Unknown'}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                You can proceed to contact the seller and/or pickup your
                product. Once you have received the product, start the
                inspection period by clicking on the{' '}
                <span className="font-bold bg-gray-200 p-[2px] rounded-md">
                  Inspecting
                </span>{' '}
                button below. After inspecting please confirm the integrity of
                the product and finalize the auction by clicking the{' '}
                <span className="font-bold bg-gray-200 p-[2px] rounded-md">
                  Finalize
                </span>{' '}
                button below.
              </p>
              <div className="flex flex-col justify-between gap-3 mb-3 w-full bg-yellow-100 text-sm md:flex-wrap">
                <h3 className="flex gap-2 items-center w-full p-2 bg-yellow-200">
                  <CiWarning />
                  Warning!
                </h3>
                <div className="text-md p-2 text-gray-600 font-light">
                  <ul className="list-disc pl-5">
                    <li className="pb-2">
                      If you do not click on inspecting within 5 days, the
                      seller will be credited automatically and the payment will
                      be finalized.
                    </li>
                    <li className="pb-2">
                      After clicking on inspecting, if you do not finalize
                      within 3 days, the seller will be credited automatically
                      and the payment will be finalized.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap w-full gap-5 justify-between">
                <div className="flex gap-5">
                  <button
                    className="bg-[#9F3247] text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleInspecting()}
                    disabled={
                      iLoading || fLoading || payment?.status === 'inspecting'
                    }
                  >
                    {iLoading ? <LoaderW /> : 'Inspecting'}
                  </button>
                  <button
                    className="bg-[#9F3247] text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleFinalize()}
                    disabled={
                      iLoading || fLoading || payment?.status === 'completed'
                    }
                  >
                    {fLoading ? <LoaderW /> : 'Finalize'}
                  </button>
                </div>
                {auctions?.refundable && (
                  <button
                    className="bg-[#9F3247] text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleRequestRefund()}
                  >
                    {rLoading ? <LoaderW /> : 'Request Refund'}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <div className="flex justify-between items-end mb-6 border-b pb-2 gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-[#9F3247]">
                  Review and Rate Seller
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                After finalizing the auction, you can leave a review and rate
                the seller based on your experience. Your feedback helps other
                buyers make informed decisions and helps maintain a trustworthy
                marketplace.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <StarRating />
                </div>
                <button
                  className="bg-[#9F3247] w-40 text-xs text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleRating()}
                  disabled={payment?.status !== 'completed'}
                >
                  Leave a Review
                </button>
              </div>
            </div>

            <ChatSection
              chatId={auctions?.chat?.id}
              showState={showChatSection}
              showFunc={setShowChatSection}
              profileImage={userImage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
