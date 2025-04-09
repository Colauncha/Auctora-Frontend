import { useState, useEffect, useMemo } from "react";
import { PropTypes } from "prop-types";
import { useLocation } from 'react-router-dom';
import {
  // FiArrowLeft, FiHeart, FiShare2, FiClock,
  FiDollarSign,
  FiUser,
  FiCheck,
  FiShield,
  FiTruck,
} from 'react-icons/fi';
import { BsLightningCharge, BsStarFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { capitalize, currencyFormat, current } from '../../utils';
import style from './css/ProductAuctionDetails.module.css';
import Loading from '../../assets/loader2';

const ProductAuctionDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [auction, setAuction] = useState(null);
  const [seller_, setSeller] = useState(null);
  const [bids, setBids] = useState(null);
  const [biddersPrice, setBiddersPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [biddersLoading, setBiddersLoading] = useState(false);
  // const [timeString, setTimeString] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });
  const id = useLocation().pathname.split('/').pop();
  const endpoint = current;

  const runFetch = async ({
    data = null,
    method = 'GET',
    endpoint = endpoint,
  }) => {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: data ? JSON.stringify(data) : null,
      });
      if (!response.ok) {
        throw new Error(`Unable to fetch auction data: ${response.json()}`);
      }
      const resp = await response.json();
      return resp.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  // Optimized countdown timer
  useEffect(() => {
    window.scrollTo(0, 0);
    setSellerLoading(true);
    setBiddersLoading(true);

    const fetchSellerData = async (sellers_id) => {
      const seller = await runFetch({
        endpoint: `${endpoint}users/retrieve/${sellers_id}`,
        method: 'GET',
      });
      setSeller(seller);
      setSellerLoading(false);
    };

    const fetchBiddersData = async (auction_id) => {
      const bids = await runFetch({
        endpoint: `${endpoint}auctions/bids/?auction_id=${encodeURIComponent(
          auction_id,
        )}&per_page=5`,
        method: 'GET',
      });
      setBids(bids);
      setBiddersLoading(false);
    };

    const fetchAuctionData = async () => {
      setLoading(true);
      const data = await runFetch({
        endpoint: `${endpoint}auctions/${id}`,
        method: 'GET',
      });
      console.log(data);
      setAuction(data);
      setImages(() =>
        [
          data?.item[0]?.image_link?.link ||
            'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743011639/qet83lshyl43jfyfugoh.jpg',
          data?.item[0]?.image_link_1?.link || null,
          data?.item[0]?.image_link_2?.link || null,
          data?.item[0]?.image_link_3?.link || null,
          data?.item[0]?.image_link_4?.link || null,
        ].filter((val) => val !== null),
      );
      // setTimeString(data?.end_date);
      setLoading(false);
      await fetchBiddersData(data.id);
      await fetchSellerData(data.users_id);
    };
    fetchAuctionData();
  }, [endpoint, id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!auction) return;
      const endDate = new Date(auction?.end_date);
      const now = new Date().getTime();
      const distance = endDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft((prev) => {
        const totalSeconds =
          prev.days * days * 86400 +
          prev.hours * hours * 3600 +
          prev.minutes * minutes * 60 +
          prev.seconds * seconds -
          1;

        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          days: Math.floor(totalSeconds / 86400),
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  // Memoized star rating component
  const StarRating = useMemo(() => {
    const Component = ({ rating }) => (
      <>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <BsStarFill
              key={i}
              className={`${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              } w-4 h-4`}
            />
          ))}
      </>
    );

    Component.propTypes = {
      rating: PropTypes.number.isRequired,
    };

    return Component;
  }, []);

  const placeBid = async (auction_id, amount) => {
    if (!amount) {
      alert('Please enter a bid amount');
      return;
    } else if (amount < auction?.current_price) {
      alert('Bid amount must be greater than the current price');
      return;
    }
    try {
      const resp = await runFetch({
        endpoint: `${current}auctions/bids/`,
        method: 'POST',
        data: { auction_id, amount },
      });
      if (resp) {
        console.log(resp);
        alert('Bid placed successfully');
      }
    } catch (error) {
      console.error('An error occured: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-40" id="Top">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/3">
            <div className="flex items-center bg-[#252525] rounded-xl shadow-md overflow-hidden mb-4 relative">
              {loading ? (
                <div className="w-full h-96 flex items-center justify-center">
                  <Loading />
                </div>
              ) : (
                <img
                  src={images[selectedImage]}
                  alt={auction?.item[0]?.name}
                  className="w-full h-96 object-contain"
                  loading="lazy"
                />
              )}
              <div className="absolute bottom-4 left-4 bg-maroon bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1}/{images.length}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'ring-2 ring-maroon'
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-bold mb-4 text-maroon">
                {auction?.item[0]?.name} - Product Description
              </h3>
              <p className="text-gray-700">{auction?.item[0]?.description}</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-maroon mb-2">
                {auction?.item[0]?.name}
              </h1>

              <div className="flex items-center mb-6">
                <span className="bg-green-100 text-white-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {capitalize(auction?.status)}
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center">
                      <FaEthereum className="text-blue-500 mr-1" />
                      {currencyFormat(auction?.current_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Buy Now</p>
                    <p className="text-2xl font-bold text-green-600 flex items-center justify-end">
                      <FaEthereum className="text-green-500 mr-1" />
                      {currencyFormat(auction?.buy_now_price)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>
                    <FiDollarSign className="inline mr-1" /> Start:{' '}
                    {currencyFormat(auction?.start_price)}
                  </span>
                  <span>
                    <BsLightningCharge className="inline mr-1" />{' '}
                    {auction?.watchers_count} bids
                  </span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="text-sm font-medium text-maroon mb-2">
                  Auction Ending In!
                </h4>
                <div className="flex justify-between text-center">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex-1">
                      <div className="text-xl font-bold text-red-600">
                        {value}
                      </div>
                      <div className="text-xs text-black-500 capitalize">
                        {unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Bids */}
              <div
                className={`${style.container} mt-6 mb-6 pt-6 border-t border-gray-200`}
              >
                <h2 className="text-xl font-bold mb-4 text-maroon">
                  Active Bids
                </h2>
                {bids?.length <= 0 ? (
                  <div className="flex items-center bg-black bg-opacity-5 p-4 rounded-lg">
                    <div>No active Bidders</div>
                  </div>
                ) : biddersLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loading />
                  </div>
                ) : (
                  bids?.map((bid_) => (
                    <div
                      key={bid_.id}
                      className={`${style.activeBids} bg-black bg-opacity-5 p-4 rounded-lg`}
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center mr-4">
                        <FiUser className="text-gray-500" size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">{bid_?.username}</h4>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm ml-2">
                            {currencyFormat(bid_?.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your bid amount"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Bid amount"
                  onChange={(e) => setBiddersPrice(e.target.value)}
                />
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                  aria-label="Place a bid"
                  onClick={() => placeBid(auction?.id, biddersPrice)} // To be updated
                >
                  <BsLightningCharge className="mr-2" />
                  Place Bid
                </button>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                  aria-label="Buy now"
                  onClick={() => {}}
                >
                  <FiCheck className="mr-2" />
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiShield className="text-green-500 mr-2" />
                    <span>Authenticity Guaranteed</span>
                  </div>
                  <div className="flex items-center">
                    <FiTruck className="text-blue-500 mr-2" />
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-maroon">
                  Sellers Information
                </h2>
                <div className="flex items-center bg-black bg-opacity-5 p-4 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center mr-4">
                    <FiUser className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">{seller_?.username}</h4>
                    <div className="flex items-center">
                      <StarRating rating={seller_?.rating} />
                      <span className="text-gray-500 text-sm ml-2">
                        {sellerLoading ? <Loading /> : `${seller_?.rating}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductAuctionDetails;