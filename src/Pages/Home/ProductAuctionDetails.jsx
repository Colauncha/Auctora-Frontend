import { useState, useEffect, useMemo } from "react";
import { PropTypes } from "prop-types";
import { useLocation } from 'react-router-dom';
import {
  // FiArrowLeft, FiHeart, FiShare2,
  FiClock,
  FiDollarSign,
  FiUser,
  FiCheck,
  FiEye,
} from 'react-icons/fi';
import { BsLightningCharge, BsStarFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { RiRefund2Line } from 'react-icons/ri';
import { capitalize, currencyFormat, current } from '../../utils';
import style from './css/ProductAuctionDetails.module.css';
import Loading from '../../assets/loader2';
import Alerts from '../../Components/alerts/Alerts';
import { shipping, delivery } from '../../Constants';

const ProductAuctionDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [auction, setAuction] = useState(null);
  const [seller_, setSeller] = useState(null);
  const [bids, setBids] = useState(null);
  const [biddersPrice, setBiddersPrice] = useState(0);
  const [images, setImages] = useState([]);

  // Loaders
  const [loading, setLoading] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [biddersLoading, setBiddersLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [placeBidLoading, setPlaceBidLoading] = useState(false);

  // Time
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });

  // Websocket
  const [live, setLive] = useState(false);
  const [watchers, setWatchers] = useState(0);
  const [socket, setSocket] = useState(null);

  // misc
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: '',
    message: '',
    detail: '',
  });
  const id = useLocation().pathname.split('/').pop();
  const endpoint = current;
  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 5000);
  };

  // Status tag color scheme
  const statusTagColor = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

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
        let error = await response.json();
        showAlert(
          'fail',
          error.message || 'An error occurred while fetching data.',
          error.detail || 'Please try again later.',
        );
        // alert(`Error: ${error.message}`);
        setLoading(false);
        setBuyNowLoading(false);
        setPlaceBidLoading(false);
        throw new Error(`Unable to fetch auction data: ${error}`);
      }
      const resp = await response.json();
      return resp.data;
    } catch (error) {
      setLoading(false);
      setBuyNowLoading(false);
      setPlaceBidLoading(false);
      console.error('Error fetching data:', error);
      return null;
    }
  };

  // Auction effects
  useEffect(() => {
    window.scrollTo(0, 0);
    setSellerLoading(true);
    setBiddersLoading(true);

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
      setBids(data.bids);
      setSeller(data.user);
      setSellerLoading(false);
      setBiddersLoading(false);
      // await fetchBiddersData(data.id);
      // await fetchSellerData(data.users_id);
    };
    fetchAuctionData();
  }, [endpoint, id]);

  // Optimized countdown timer
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

      setTimeLeft(() => {
        if (distance <= 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          days,
          hours,
          minutes,
          seconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  // websocket effects
  useEffect(() => {
    let socket_;

    if (live) {
      const token = JSON.parse(sessionStorage.getItem('websocket-allowance'));
      socket_ = new WebSocket(
        `wss://api.biddius.com/api/auctions/bids/ws/${id}/${token}`,
      );
      // socket_ = new WebSocket(
      //   `ws://localhost:8000/api/auctions/bids/ws/${id}/${token}`,
      // );
      setSocket(socket_);

      socket_.onopen = () => {
        console.log('WebSocket connected');
      };

      socket_.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.type === 'bids') {
            setBids(data?.payload.sort((a, b) => b.amount - a.amount));
          } else if (data?.type === 'count') {
            setWatchers(data?.Watchers);
          } else if (data?.type === 'new_bid') {
            setBids(data?.payload.sort((a, b) => b.amount - a.amount));
          }
        } catch (error) {
          showAlert('fail', 'Error parsing WebSocket message', error.message);
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket_.onerror = (error) => {
        showAlert('fail', 'WebSocket error', error);
        console.error('WebSocket error:', error);
      };

      socket_.onclose = () => {
        console.log('WebSocket closed');
      };
    }

    return () => {
      if (socket_ && socket_.readyState === WebSocket.OPEN) {
        socket_.close();
      }
    };
  }, [live, id]);

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
    setPlaceBidLoading(true);

    // live
    if (live) {
      setPlaceBidLoading(true);
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        showAlert('fail', 'WebSocket Error', 'WebSocket is not connected.');
        // alert('WebSocket is not connected. Please try again later.');
        setPlaceBidLoading(false);
        return;
      } else if (!amount) {
        showAlert('warn', 'Invalid Bid', 'Please enter a bid amount.');
        // alert('Please enter a bid amount');
        setPlaceBidLoading(false);
        return;
      } else if (amount < bids[0]?.amount) {
        setPlaceBidLoading(false);
        showAlert(
          'warn',
          'Invalid Bid',
          'Bid amount must be greater than the current price.',
        );
        // alert('Bid amount must be greater than the current price');
        return;
      }

      const data = {
        auction_id: id,
        amount,
      };

      socket.send(JSON.stringify(data));
      setPlaceBidLoading(false);
      return;
    }

    // Static
    if (!amount) {
      // alert('Please enter a bid amount');
      showAlert('warn', 'Invalid Bid', 'Please enter a bid amount.');
      setPlaceBidLoading(false);
      return;
    } else if (amount < auction?.current_price) {
      setPlaceBidLoading(false);
      showAlert(
        'warn',
        'Invalid Bid',
        'Bid amount must be greater than the current price.',
      );
      // alert('Bid amount must be greater than the current price');
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
        setPlaceBidLoading(false);
        setBiddersPrice(0);
        setBids((prevBids) => [
          ...prevBids,
          {
            id: resp.id,
            username: resp.username,
            amount: resp.amount,
          },
        ]);
        setAuction((prevAuction) => ({
          ...prevAuction,
          current_price: resp.amount,
        }));
        showAlert('success', 'Bid Successfully Placed');
        // alert('Bid placed successfully');
      }
    } catch (error) {
      setPlaceBidLoading(false);
      // alert('An error occurred while processing your request.');
      console.error('An error occured: ', error);
      return;
    }
  };

  const handleBuyNow = async (auction_id) => {
    setBuyNowLoading(true);
    try {
      const resp = await runFetch({
        endpoint: `${current}auctions/bids/buy_now`,
        method: 'POST',
        data: { auction_id },
      });
      if (resp) {
        console.log(resp);
        setBuyNowLoading(false);
        setBiddersPrice(0);
        setBids((prevBids) => [
          ...prevBids,
          {
            id: resp.id,
            username: resp.username,
            amount: resp.amount,
          },
        ]);
        setAuction((prevAuction) => ({
          ...prevAuction,
          current_price: resp.amount,
          status: 'Completed',
        }));
        showAlert(
          'success',
          'Bid successful',
          'You have successfully placed your bid.',
        );
        // alert('Purchase successful');
      }
    } catch (error) {
      setBuyNowLoading(false);
      setBiddersPrice(0);
      showAlert(
        'fail',
        'Bid failed',
        'An error occurred while processing your request.',
      );
      // alert('An error occurred while processing your request.');
      console.error('An error occurred: ', error);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-40" id="Top">
      {alertT.isAlert && (
        <Alerts
          key={`${alertT.level}-${alertT.message}`}
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/3">
            <div className="flex w-full gap-5">
              <div className="grid w-[15%] grid-rows-4 gap-2">
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

              <div className="flex w-[85%] items-center bg-[#252525] rounded-xl shadow-md overflow-hidden mb-4 relative">
                {loading ? (
                  <div className="w-full h-96 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <img
                    src={images[selectedImage]}
                    alt={capitalize(auction?.item[0]?.name)}
                    className="w-full h-96 object-contain"
                    loading="lazy"
                  />
                )}
                <div className="absolute bottom-4 left-4 bg-maroon bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1}/{images.length}
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-6 p-6 rounded-md border border-gray-200">
              {auction && (
                <div className="flex gap-4 mb-6 pb-6 items-center border-b border-gray-200 justify-between">
                  <h1 className="text-2xl font-bold text-maroon">
                    {capitalize(auction?.item[0]?.name)}
                  </h1>
                  <div className="flex gap-2">
                    <div
                      className={`flex items-center rounded-full px-3 py-1 justify-center
                    ${statusTagColor[auction?.status.toLowerCase()]}`}
                    >
                      <span
                        className={`text-sm ${
                          statusTagColor[auction?.status.toLowerCase()]
                        }`}
                      >
                        {capitalize(auction?.status)}
                        {auction?.status === 'completed' ||
                        auction?.status === 'active' ? (
                          <FiCheck className="inline ml-1" />
                        ) : (
                          auction?.status ===
                          'pending'(<FiClock className="inline ml-1" />)
                        )}
                      </span>
                    </div>
                    {auction?.refundable && (
                      <div className="flex items-center justify-center bg-gray-200 rounded-full px-3 py-1">
                        <span className="text-sm text-gray-500">
                          Refundable
                          <RiRefund2Line className="inline ml-1 text-green-500" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="mb-6 pb-6 bg-gray-50 rounded-sm border-b border-gray-200">
                <h3 className="text-xl mb-3 text-maroon">Description</h3>
                <p className="text-black-700 text-sm">
                  {auction?.item[0]?.description ||
                    'No description available for this auction.'}
                </p>
              </div>
              {auction?.logistic_type.length > 0 && (
                <div className="mb-6 pb-6 bg-gray-50 rounded-sm border-b border-gray-200">
                  <h3 className="text-xl mb-3 text-maroon">
                    Pickup and Logistics
                  </h3>
                  <div className="flex flex-col text-black-700 text-sm">
                    {auction?.logistic_type.map((logistic, ind) => (
                      <span
                        key={ind}
                        className="flex justify-between bg-gray-200 w-[30%] rounded-full px-3 py-1 mr-2 mb-2 text-sm font-medium text-gray-700"
                      >
                        {capitalize(logistic)}
                        {logistic === 'Self pickup' ? (
                          <img
                            className="w-[25px] h-[25px]"
                            src={delivery}
                            alt="Pickup icon"
                          />
                        ) : (
                          <img
                            className="w-[25px] h-[25px]"
                            src={shipping}
                            alt="Delivery Icon"
                          />
                        )}
                      </span>
                    ))}
                  </div>
                  {auction?.logistic_type.includes('Self pickup') && (
                    <p className="text-black-700 text-sm mt-2">
                      <span className="text-maroon font-medium">
                        Pickup Address:{' '}
                      </span>
                      {auction?.pickup_address}
                    </p>
                  )}
                </div>
              )}
              <h2 className="text-xl mb-4 text-maroon">Sellers Information</h2>
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

          {/* Product Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-3 sticky">
              {/* Active Bids */}
              <div className={`${style.container} mb-6 border-gray-200`}>
                <div className="flex items-center justify-between w-full sticky top-0 bg-white border-b border-gray-200">
                  <div className="flex items-center gap-2 ">
                    <h2 className="text-xl mb-4 text-maroon">Active Bids</h2>
                    <span className="rounded-md mb-4 bg-blue-100 text-sm w-5 text-center text-blue-800 font-medium">
                      {bids?.length || 0}
                    </span>
                    <span
                      className={`flex items-center text-sm mb-4 text-gray-500 ${
                        live ? '' : 'hidden'
                      }`}
                    >
                      <FiEye className="text-gray-500" size={20} />
                      <span className="text-sm ml-1 text-gray-500">
                        {watchers} viewers
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm mb-4 text-gray-500">
                      {live ? 'Live' : 'Static'}
                    </span>
                    <label className="relative mb-4 pr-2 inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        onChange={(e) => setLive(e.target.checked)}
                        checked={live}
                        aria-label="Toggle live auction"
                        defaultValue
                      />
                      <div className="group peer bg-white rounded-full duration-300 w-10 h-5 ring-1 ring-gray-500 after:duration-300 after:bg-gray-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-3 after:w-3 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95" />
                    </label>
                  </div>
                </div>
                {!bids || bids.length <= 0 ? ( // Check if `bids` is undefined or empty
                  <div className="flex items-center bg-black bg-opacity-5 p-4 rounded-lg text-gray-500">
                    <div>No active Bidders</div>
                  </div>
                ) : biddersLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loading />
                  </div>
                ) : (
                  [...(bids || [])] // Fallback to empty array if `bids` is undefined
                    .sort((a, b) => {
                      // Handle null or invalid dates
                      const dateA = a.amount ? new Date(a.amount) : 0;
                      const dateB = b.amount ? new Date(b.amount) : 0;
                      return dateB - dateA; // Newest first
                    })
                    .map((bid_) => (
                      <div
                        key={bid_?.id || Math.random()} // Fallback key if `id` is missing
                        className={`${style.activeBids} bg-black bg-opacity-5 p-4 rounded-lg`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-4">
                            <FiUser className="text-gray-500" size={20} />
                          </div>
                          <div>{bid_?.username || 'Unknown Bidder'}</div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm ml-2">
                            {bid_?.amount ? currencyFormat(bid_.amount) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* place bid btn */}
              <div className="space-y-3 mb-5">
                <input
                  type="text"
                  placeholder="Enter your bid amount"
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Bid amount"
                  onChange={(e) => setBiddersPrice(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                      aria-label="Place a bid"
                      disabled={placeBidLoading || buyNowLoading}
                      onClick={() => placeBid(auction?.id, biddersPrice)} // To be updated
                    >
                      <BsLightningCharge className="mr-2" />
                      Place Bid
                    </button>
                    {placeBidLoading && (
                      <div className="ml-2 transition-opacity duration-300 ease-in-out opacity-100">
                        <Loading />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between transition-gap">
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                      aria-label="Buy now"
                      disabled={buyNowLoading || placeBidLoading}
                      onClick={() => handleBuyNow(auction?.id)} // To be updated
                    >
                      <FiCheck className="mr-2" />
                      Buy Now
                    </button>
                    {buyNowLoading && (
                      <div className="ml-2 transition-opacity duration-300 ease-in-out opacity-100">
                        <Loading />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col gap-2 justify-center items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center">
                      <FaEthereum className="text-blue-500 mr-1" />
                      {currencyFormat(auction?.current_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Buy Now Price</p>
                    <p className="text-2xl font-bold text-green-600 flex items-center">
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
                    <BsLightningCharge className="inline mr-1" /> {bids?.length}{' '}
                    bids
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductAuctionDetails;