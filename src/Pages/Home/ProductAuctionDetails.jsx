import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiUser,
  FiCheck,
  FiEye,
  FiMaximize2,
  FiMinimize2,
} from 'react-icons/fi';
import { FaNairaSign, FaLink, FaTruckMoving } from 'react-icons/fa6';
import { BsLightningCharge, BsStarFill } from 'react-icons/bs';
import { FaEthereum } from 'react-icons/fa';
import { RiRefund2Line } from 'react-icons/ri';
import { capitalize, currencyFormat, current, Fetch } from '../../utils';
import style from './css/ProductAuctionDetails.module.css';
import Loading from '../../assets/loader2';
import { toastSuccess, toastError, toastWarn } from '../../utils/toast';
import { shipping, delivery } from '../../Constants';
import { ensureFreshToken } from '../../utils/Fetch';
import useAuthStore from '../../Store/AuthStore';
import { useInView } from 'react-intersection-observer';
import confetti from 'canvas-confetti';

const ProductAuctionDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [auction, setAuction] = useState(null);
  const [seller_, setSeller] = useState(null);
  const [sellerImage, setSellerImage] = useState('');
  const [bids, setBids] = useState(null);
  const [biddersPrice, setBiddersPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const completionHandledRef = useRef(false);

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
    totalInSeconds: 1,
  });

  // Websocket
  const [live, setLive] = useState(false);
  const [watchers, setWatchers] = useState(0);
  const [socket, setSocket] = useState(null);
  const [wsStatus, setWsStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected' | 'error'
  const websocketToken = useAuthStore((state) => state.websocketToken);
  const wsRetriesLeft = useRef(2);
  const wsRetryTimer = useRef(null);

  // misc
  const navigate = useNavigate();
  const id = useLocation().pathname.split('/').pop();
  const endpoint = current;
  const user = useAuthStore((state) => state.data);

  // Status tag color scheme
  const statusTagColor = {
    completed: 'bg-green-50 text-green-800',
    pending: 'bg-yellow-50 text-yellow-800',
    active: 'bg-blue-50 text-blue-800',
    cancelled: 'bg-red-50 text-red-800',
  };

  const runFetch = useCallback(
    async ({ data = null, method = 'GET', endpoint = endpoint }) => {
      try {
        const response = await Fetch({
          url: endpoint,
          method: method,
          requestData: data ? data : null,
        });
        if (!response.success) {
          toastError(
            response.error.message || 'An error occurred while fetching data.',
            response.error.detail || 'Please try again later.'
          );
          setLoading(false);
          setBuyNowLoading(false);
          setPlaceBidLoading(false);
          throw new Error(`Unable to fetch auction data: ${response.error}`);
        }
        // const resp = await response.json();
        return response.data;
      } catch (error) {
        setLoading(false);
        setBuyNowLoading(false);
        setPlaceBidLoading(false);
        console.error('Error fetching data:', error);
        return null;
      }
    },
    []
  );

  // Auction effects
  useEffect(() => {
    if (refresh) setRefresh(false);
    window.scrollTo(0, 0);
    setSellerLoading(true);
    setBiddersLoading(true);

    setLoading(true);

    const fetchAuctionData = async () => {
      const data = await runFetch({
        endpoint: `${endpoint}auctions/${id}`,
        method: 'GET',
      });
      console.log('Auction data', data);
      setAuction(data.data);
      setImages(() =>
        [
          data?.data?.item[0]?.image_link?.link ||
            'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg',
          data?.data?.item[0]?.image_link_1?.link || null,
          data?.data?.item[0]?.image_link_2?.link || null,
          data?.data?.item[0]?.image_link_3?.link || null,
          data?.data?.item[0]?.image_link_4?.link || null,
        ].filter((val) => val !== null)
      );
      setBids(data?.data.bids);
      setSeller(data?.data.user);
      setSellerLoading(false);
      setSellerImage(data?.data.user?.image_link?.link || '');
    };

    fetchAuctionData();
    setBiddersLoading(false);
    setLoading(false);
  }, [endpoint, id, runFetch, refresh]);

  // Optimized countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!auction) return;
      const endDate = new Date(auction?.end_date);
      const now = new Date().getTime();
      const distance = endDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(() => {
        if (distance <= 0) {
          clearInterval(timer);
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalInSeconds: distance,
          };
        }

        return {
          days,
          hours,
          minutes,
          seconds,
          totalInSeconds: distance,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  // websocket connection effect
  useEffect(() => {
    if (!live) {
      setWsStatus('idle');
      return;
    }

    setWsStatus('connecting');
    ensureFreshToken();
    let endpoint = current.replace('http', 'ws');
    const socket_ = new WebSocket(
      `${endpoint}auctions/bids/ws/${id}/${websocketToken}`
    );
    setSocket(socket_);

    socket_.onopen = () => {
      wsRetriesLeft.current = 2;
      setWsStatus('connected');
    };

    socket_.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.type === 'bids' || data?.type === 'new_bid') {
          setBids(data?.payload.sort((a, b) => b.amount - a.amount));
        } else if (data?.type === 'count') {
          setWatchers(data?.Watchers);
        }
      } catch (error) {
        toastError('Error parsing live data', error.message);
      }
    };

    socket_.onerror = () => {
      setWsStatus('error');
      setLive(false);
    };

    socket_.onclose = () => {
      setWsStatus((prev) => (prev === 'error' ? prev : 'idle'));
    };

    return () => {
      if (socket_.readyState === WebSocket.OPEN) {
        socket_.close();
      }
    };
  }, [live, id, websocketToken]);

  // websocket retry effect - runs whenever a connection attempt errors out
  useEffect(() => {
    if (wsStatus !== 'error') return;

    if (wsRetriesLeft.current <= 0) {
      toastError(
        'Connection failed',
        'Could not connect to live auction. Try again.'
      );
      return;
    }

    wsRetriesLeft.current -= 1;
    wsRetryTimer.current = setTimeout(async () => {
      await ensureFreshToken();
      setLive(true);
    }, 1000);

    return () => clearTimeout(wsRetryTimer.current);
  }, [wsStatus]);

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
        toastError('WebSocket Error', 'WebSocket is not connected.');
        setPlaceBidLoading(false);
        return;
      } else if (!amount) {
        toastWarn('Invalid Bid', 'Please enter a bid amount.');
        setPlaceBidLoading(false);
        return;
      } else if (amount <= bids[0]?.amount) {
        setPlaceBidLoading(false);
        toastWarn(
          'Invalid Bid',
          'Bid amount must be greater than the current price.'
        );
        return;
      } else if (amount <= auction.current_price) {
        setPlaceBidLoading(false);
        toastWarn(
          'Invalid Bid',
          'Bid amount must be greater than the current price.'
        );
        return;
      } else if (timeLeft.totalInSeconds <= 0) {
        setPlaceBidLoading(false);
        toastWarn(
          'Auction Ended',
          'Auction has ended, you will be notified of your standing.'
        );
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
      toastWarn('Invalid Bid', 'Please enter a bid amount.');
      setPlaceBidLoading(false);
      return;
    } else if (amount < auction?.current_price) {
      setPlaceBidLoading(false);
      toastWarn(
        'Invalid Bid',
        'Bid amount must be greater than the current price.'
      );
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
        // Replace the previous bids where Id == new bid
        let newBidList = bids.filter((bid) => bid.id !== resp.data.id);
        setBids([
          ...newBidList,
          {
            id: resp.data.id,
            username: resp.data.username,
            amount: resp.data.amount,
          },
        ]);

        // setBids((newBidList) => [
        //   ...newBidList,
        //   {
        //     id: resp.data.id,
        //     username: resp.data.username,
        //     amount: resp.data.amount,
        //   },
        // ]);
        setAuction((prevAuction) => ({
          ...prevAuction,
          current_price: resp.data.amount,
        }));
        toastSuccess('Bid Successfully Placed');
      }
    } catch (error) {
      setPlaceBidLoading(false);
      console.error('An error occured: ', error);
      return;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
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
        toastSuccess(
          'Bid successful',
          'You have successfully placed your bid.'
        );
        navigate(`/product/finalize/${auction_id}`);
      }
    } catch (error) {
      setBuyNowLoading(false);
      setBiddersPrice(0);
      toastError(
        'Bid failed',
        error.message || 'An error occurred while processing your request.'
      );
      console.error('An error occurred: ', error);
      return;
    }
  };

  const { ref: counterRef, inView } = useInView({
    threshold: 0.5,
  });

  const handleConfetti = () => {
    confetti({
      particleCount: 1000,
      spread: 90,
      origin: { y: 0 },
    });
  };

  useEffect(() => {
    if (!auction) return;
    if (timeLeft.totalInSeconds > 0) return;
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;

    setLoading(true);
    const timer = setTimeout(() => {
      if (auction?.payment?.from_id === user.id) {
        handleConfetti();
        return;
      }

      setRefresh(true);
    }, 5000);

    setLoading(false);
    return () => clearTimeout(timer);
  }, [timeLeft, auction, user]);

  // Floating overlay collapse/expand + drag-to-reposition (collapsed state only)
  const [overlayCollapsed, setOverlayCollapsed] = useState(true);
  const [dragPosition, setDragPosition] = useState(null); // {x, y} px within image container; null = default corner
  const imageContainerRef = useRef(null);
  const dragBadgeRef = useRef(null);
  const dragStateRef = useRef({ dragging: false });

  const handleDragPointerDown = (e) => {
    const container = imageContainerRef.current;
    const badge = dragBadgeRef.current;
    if (!container || !badge) return;

    const containerRect = container.getBoundingClientRect();
    const badgeRect = badge.getBoundingClientRect();

    dragStateRef.current = {
      dragging: true,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startLeft: dragPosition?.x ?? badgeRect.left - containerRect.left,
      startTop: dragPosition?.y ?? badgeRect.top - containerRect.top,
      maxLeft: Math.max(containerRect.width - badgeRect.width, 0),
      maxTop: Math.max(containerRect.height - badgeRect.height, 0),
    };
    badge.setPointerCapture(e.pointerId);
  };

  const handleDragPointerMove = (e) => {
    const ds = dragStateRef.current;
    if (!ds.dragging) return;

    const dx = e.clientX - ds.startClientX;
    const dy = e.clientY - ds.startClientY;
    setDragPosition({
      x: Math.min(Math.max(ds.startLeft + dx, 0), ds.maxLeft),
      y: Math.min(Math.max(ds.startTop + dy, 0), ds.maxTop),
    });
  };

  const handleDragPointerUp = () => {
    dragStateRef.current.dragging = false;
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-40" id="Top">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/3">
            <div className="flex flex-col-reverse gap-5 lg:flex-row">
              <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:grid lg:w-[15%] lg:grid-rows-4 lg:overflow-visible lg:pb-0">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden transition-all flex-shrink-0 ${
                      selectedImage === index
                        ? 'ring-2 ring-maroon'
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover lg:w-full lg:h-24"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              <div
                ref={imageContainerRef}
                className="flex w-full items-center bg-[#252525] rounded-xl shadow-md overflow-hidden mb-4 relative lg:w-[85%]"
              >
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
                <div className="absolute top-4 left-4 bg-[#fff] text-red-500 px-3 py-1 rounded-full text-xs">
                  {selectedImage + 1}/{images.length}
                </div>
                {timeLeft.totalInSeconds <= 0 && !loading && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50"></div>
                    <div className="absolute left-0 w-full bg-white py-5 flex justify-center font-extrabold text-lg text-maroon">
                      AUCTION COMPLETED
                    </div>
                  </>
                )}

                {overlayCollapsed ? (
                  <div
                    ref={dragBadgeRef}
                    onPointerDown={handleDragPointerDown}
                    onPointerMove={handleDragPointerMove}
                    onPointerUp={handleDragPointerUp}
                    onPointerCancel={handleDragPointerUp}
                    className="absolute z-10 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg px-2.5 py-1.5 text-xs font-medium text-red-600 cursor-grab active:cursor-grabbing touch-none opacity-100"
                    style={
                      dragPosition
                        ? { left: dragPosition.x, top: dragPosition.y }
                        : { right: 8, bottom: 8 }
                    }
                  >
                    <FiClock />
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
                    {timeLeft.seconds}s
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setOverlayCollapsed(false)}
                      aria-label="Expand price details"
                      className="ml-0.5 text-gray-500 hover:text-gray-800"
                    >
                      <FiMaximize2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-x-2 bottom-2 z-10 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg p-3 space-y-2 opacity-30 transition-opacity duration-300 ease-in-out hover:opacity-100">
                    <button
                      onClick={() => setOverlayCollapsed(true)}
                      aria-label="Collapse to compact view"
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow-md border border-gray-200 p-1 text-gray-500 hover:text-gray-800"
                    >
                      <FiMinimize2 size={12} />
                    </button>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center text-base sm:text-lg font-bold text-gray-900">
                        <FaEthereum className="text-blue-500 mr-1 flex-shrink-0" />
                        {currencyFormat(auction?.current_price)}
                      </div>
                      <div className="flex items-center text-base sm:text-lg font-bold text-green-600">
                        <FaEthereum className="text-green-500 mr-1 flex-shrink-0" />
                        {currencyFormat(auction?.buy_now_price)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center">
                        <FaNairaSign className="inline mr-1" />
                        Start: {currencyFormat(auction?.start_price)}
                      </span>
                      <span className="flex items-center">
                        <BsLightningCharge className="inline mr-1" />
                        {bids?.length} bids
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-md py-1">
                      <FiClock className="mr-1" />
                      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
                      {timeLeft.seconds}s left
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-6 p-6 rounded-xl border border-gray-200 shadow-sm bg-white">
              {auction && (
                <div className="flex flex-wrap gap-4 mb-6 pb-6 items-center border-b border-gray-200 justify-between">
                  <h1 className="text-2xl font-bold text-maroon">
                    {capitalize(auction?.item[0]?.name)}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`flex items-center gap-1 rounded-full px-3 py-1 justify-center font-medium shadow-sm
                    ${statusTagColor[auction?.status.toLowerCase()]}`}
                    >
                      <span className="text-sm">
                        {capitalize(auction?.status)}
                        {auction?.status === 'completed' ||
                        auction?.status === 'active' ? (
                          <FiCheck className="inline" />
                        ) : (
                          auction?.status === 'pending' && (
                            <FiClock className="inline" />
                          )
                        )}
                      </span>
                      {auction?.status === 'completed' && auction.payment && (
                        <span className="ml-2 pl-3 flex items-center gap-1 text-blue-600">
                          <FaLink className="inline" />
                          <a
                            href={`/product/finalize/${auction?.id}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-300 ease-in-out font-medium"
                            aria-label="View auction details"
                            // target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                          </a>
                        </span>
                      )}
                    </div>
                    {auction?.refundable && (
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 shadow-sm">
                        <span className="text-sm text-gray-600 font-medium">
                          Refundable
                          <RiRefund2Line className="inline ml-1 text-green-500" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl mb-3 text-maroon">Description</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {auction?.item[0]?.description ||
                    'No description available for this auction.'}
                </p>
              </div>
              {auction?.logistic_type.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl mb-3 text-maroon">
                    Pickup and Logistics
                  </h3>
                  <div className="flex flex-wrap gap-2 text-gray-700 text-sm">
                    {auction?.logistic_type.map((logistic, ind) => (
                      <span
                        key={ind}
                        className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                      >
                        {capitalize(logistic)}
                        {logistic === 'Self pickup' ? (
                          <img
                            className="w-5 h-5"
                            src={delivery}
                            alt="Pickup icon"
                          />
                        ) : (
                          <img
                            className="w-5 h-5"
                            src={shipping}
                            alt="Delivery Icon"
                          />
                        )}
                      </span>
                    ))}
                  </div>
                  {auction?.logistic_type.includes('Self pickup') && (
                    <p className="text-gray-700 text-sm mt-2">
                      <span className="text-maroon font-medium">
                        Pickup Address:{' '}
                      </span>
                      {auction?.pickup_address}
                    </p>
                  )}
                </div>
              )}
              <h2 className="text-xl mb-3 text-maroon">Sellers Information</h2>
              <div className="flex items-center gap-4 bg-black bg-opacity-5 p-4 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center overflow-hidden">
                  {sellerImage ? (
                    <img
                      src={sellerImage}
                      alt="Profile-photo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FiUser className="text-gray-500" size={20} />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{seller_?.username}</h4>
                  <div className="flex items-center">
                    <StarRating rating={seller_?.rating || 0} />
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
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 py-4 sticky">
              {/* Active Bids */}
              <div className={`${style.container} mb-6 border-gray-200`}>
                <div className="flex items-center justify-between w-full sticky top-0 bg-white border-b border-gray-200 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-maroon">
                      Active Bids
                    </h2>
                    <span className="rounded-full bg-blue-50 text-[8px] w-5 py-0.5 text-center text-blue-800 font-medium">
                      {bids?.length || 0}
                    </span>
                    {wsStatus === 'connected' && watchers > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiEye size={12} />
                        {watchers}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {wsStatus === 'connecting' && (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        Connecting
                      </span>
                    )}
                    {wsStatus === 'connected' && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    )}
                    <button
                      onClick={() => setLive((prev) => !prev)}
                      disabled={wsStatus === 'connecting'}
                      className={`group relative flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        live
                          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          : 'bg-maroon text-white hover:opacity-90 animate-pulse'
                      }`}
                    >
                      <BsLightningCharge
                        size={11}
                        className="group-hover:scale-125 transition-transform duration-300 ease-linear"
                      />
                      {live ? 'Disconnect' : 'Go Live'}
                    </button>
                  </div>
                </div>
                {!bids || bids.length <= 0 ? ( // Check if `bids` is undefined or empty
                  <div className="flex items-center border border-gray-200 bg-gray-50 p-4 rounded-lg text-gray-500">
                    <div>No active Bidders</div>
                  </div>
                ) : biddersLoading ? (
                  <div className="flex items-center justify-center h-24">
                    <Loading />
                  </div>
                ) : (
                  [...(bids || [])]
                    .sort((a, b) => b.amount - a.amount)
                    .map((bid_) => (
                      <div
                        key={bid_?.id || Math.random()} // Fallback key if `id` is missing
                        className={`${style.activeBids} border border-gray-200 bg-gray-50 p-4 rounded-lg transition-bg duration-500 ease-in-out hover:bg-gray-100`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-4">
                            <FiUser className="text-purple-500" size={20} />
                          </div>
                          <div>
                            <div>{bid_?.username || 'Unknown Bidder'}</div>
                            <div className="text-[10px] text-gray-400">
                              {bid_?.created_at &&
                                new Date(bid_?.created_at).toLocaleString()}
                            </div>
                          </div>
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
                  disabled={timeLeft.totalInSeconds <= 0}
                />
                <span className="text-gray-500 text-sm">
                  {formatCurrency(biddersPrice)}
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <button
                      className="w-full relative group bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors duration-300 ease-in-out"
                      aria-label="Place a bid"
                      disabled={placeBidLoading || buyNowLoading}
                      onClick={() => placeBid(auction?.id, biddersPrice)} // To be updated
                    >
                      <BsLightningCharge className="mr-2 group-hover:scale-125 transition-all duration-500" />
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
                      className="w-full relative group bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors duration-300 ease-in-out"
                      aria-label="Buy now"
                      disabled={buyNowLoading || placeBidLoading}
                      onClick={() => handleBuyNow(auction?.id)} // To be updated
                    >
                      <span className="flex items-center gap-3">
                        <FaTruckMoving className="group-hover:translate-x-2 group-hover:scale-105 transition-all duration-500" />
                        Buy Now
                      </span>
                      <span className="ml-3 text-xs font-light">
                        ({currencyFormat(auction?.buy_now_price)})
                      </span>
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
              <div
                ref={counterRef}
                className={`transition-opacity duration-800 ease-in-out ${
                  inView ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
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
                      <FaNairaSign className="inline mr-1" /> Start:{' '}
                      {currencyFormat(auction?.start_price)}
                    </span>
                    <span>
                      <BsLightningCharge className="inline mr-1" />{' '}
                      {bids?.length} bids
                    </span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="text-sm font-medium text-maroon mb-2">
                    Auction Ending In!
                  </h4>
                  <div className="flex justify-between text-center">
                    {Object.entries(timeLeft).map(
                      ([unit, value]) =>
                        unit !== 'totalInSeconds' && (
                          <div key={unit} className="flex-1">
                            <div className="text-xl font-bold text-red-600">
                              {value}
                            </div>
                            <div className="text-xs text-black-500 capitalize">
                              {unit}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};;

export default ProductAuctionDetails;
