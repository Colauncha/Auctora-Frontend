import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alerts from '../../Components/alerts/Alerts';
import Loader from '../../assets/loader2';
import { current, currencyFormat, capitalize } from '../../utils';
import { CiWarning } from 'react-icons/ci';

const ReviewPage = () => {
  const [auctions, setAuctions] = useState([]);
  // const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fLoading, setFLoading] = useState(false);
  const [iLoading, setILoading] = useState(false);
  // const [rLoading, setRLoading] = useState(false);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: '',
    message: '',
    detail: '',
  });
  const navigate = useNavigate();
  const id = useLocation().pathname.split('/').pop();

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 5000);
  };

  useEffect(() => {
    const endpoint = `${current}auctions/${id}`;
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Unable to fetch auction details');
        }
        const data = await response.json();
        console.log(data);
        if (data?.data?.status !== 'active') {
          // 'active' is for demonstration, change this to 'completed'
          console.log(data?.status);
          showAlert(
            'fail',
            'Auction not completed',
            'Please check the auction status',
          );
          navigate(`/product-details/${id}`);
          return;
        }
        setAuctions(data.data);
        setLoading(false);
      } catch (error) {
        showAlert('fail', error.message, 'Failed to fetch auction details');
        setLoading(false);
      }
    };
    fetchAuctionDetails();
  }, [id, navigate]);

  const runFetch = async ({ endpoint, method }) => {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error:', error);
      showAlert('fail', 'Error', error.message);
      return false;
    }
  };

  const handleInspecting = async () => {
    setILoading(true);
    const endpoint = `${current}auctions/set_inspecting/${id}`;
    const method = 'PUT';

    let resp = await runFetch({ endpoint, method });
    if (resp) {
      setILoading(false);
      showAlert(
        'success',
        'Inspection mode activated',
        'Product is being inspected',
      );
      // navigate(`/product-details/${id}`);
    } else {
      setILoading(false);
      showAlert('fail', 'Unable to start inspection', 'Please try again');
    }
  };

  const handleFinalize = async () => {
    setFLoading(true);
    const endpoint = `${current}auctions/finalize/${id}`;
    const method = 'GET';

    let resp = await runFetch({ endpoint, method });
    if (resp) {
      setFLoading(false);
      showAlert('success', 'Auction finalized', 'Auction has been finalized');
      // navigate(`/product-details/${id}`);
    } else {
      setFLoading(false);
      showAlert('fail', 'Unable to finalize auction', 'Please try again');
    }
  };

  const handleRequestRefund = () => {
    navigate(`/product-details/${id}`);
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
            {alertT.isAlert && (
              <Alerts
                level={alertT.level}
                message={alertT.message}
                detail={alertT.detail}
              />
            )}
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
                <div className="flex flex-col items-start w-[60%] border-r sm: w-full flex-wrap">
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
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#9F3247] mb-6 border-b pb-2">
                Seller&apos;s Details
              </h2>
              <p className="text-md text-gray-500 font-light">
                <span className="text-gray-600 font-bold">Seller email:</span>{' '}
                {auctions?.user.email || 'null'}
              </p>
              <p className="text-md text-gray-500 font-light">
                <span className="text-gray-600 font-bold">Seller Phone:</span>{' '}
                {auctions?.user.phone_number || 'null'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#9F3247] mb-6 border-b pb-2">
                Finalize Auction
              </h2>
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
              <div className="flex flex-col justify-between gap-3 mb-3 w-[60%] bg-yellow-100 text-sm sm: w-full flex-wrap">
                <h3 className="flex gap-2 items-center w-full p-2 bg-yellow-200">
                  <CiWarning />
                  Warning!
                </h3>
                <p className="text-md p-2 text-gray-600 font-light">
                  <ul className="list-disc pl-5">
                    <li>
                      If you do not click on inspecting within 5 days, the
                      seller will be credited automatically and the payment will
                      be finalized.
                    </li>
                    <li>
                      After clicking on inspecting, if you do not finalize
                      within 3 days, the seller will be credited automatically
                      and the payment will be finalized.
                    </li>
                  </ul>
                </p>
              </div>
              <div className="flex flex-wrap w-full gap-5 justify-between">
                <div className="flex gap-5">
                  <button
                    className="bg-[#9F3247] text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleInspecting()}
                  >
                    {iLoading ? <Loader /> : 'Inspecting'}
                  </button>
                  <button
                    className="bg-[#9F3247] text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleFinalize()}
                  >
                    {fLoading ? <Loader /> : 'Finalize'}
                  </button>
                </div>
                <button
                  className="bg-[#9F3247] text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleRequestRefund()}
                >
                  Request Refund
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
