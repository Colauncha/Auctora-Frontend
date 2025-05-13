import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alerts from '../../Components/alerts/Alerts';
import Loader from '../../assets/loader2';
import { current, currencyFormat } from '../../utils';

const ReviewPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="py-6 px-5">
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
                <p className="text-lg text-gray-600">
                  Auction ID: {auctions.id}
                </p>
                <p className="text-lg text-gray-600">
                  Item Name: {auctions?.item[0].name || 'null'}
                </p>
                <p className="text-lg text-gray-600">
                  Winning Bid: {currencyFormat(auctions.current_price)}
                </p>
                <p className="text-lg text-gray-600">
                  Auction Status: {auctions.status}
                </p>
              </div>
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-[#9F3247] mb-4">
                  Seller Details
                </h2>
                <p className="text-lg text-gray-600">
                  Seller email: {auctions?.user.email || 'null'}
                </p>
                <p className="text-lg text-gray-600">
                  Seller Phone: {auctions?.user.phone || 'null'}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#9F3247] mb-6 border-b pb-2">
                Finalize Auction
              </h2>
              <p className="text-gray-700 mb-6">
                You can proceed to contact the seller and pickup your product.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
