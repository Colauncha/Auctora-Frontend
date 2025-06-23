import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../Components/Breadcrumbs';
import { capitalize, currencyFormat, formatDateTime } from '../../../utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';
import { API_BASE_URL } from '../../Sell/AddProduct/config';
import { current } from '../../../utils';
import Loader from '../../../assets/loaderWhite';
import LoaderM from '../../../assets/loader2';
import { MdModeEdit } from 'react-icons/md';
import uploadIcon from '../../../assets/icons/upload.png';
import { CiCircleCheck } from 'react-icons/ci';
import { HiOutlineReceiptRefund } from 'react-icons/hi2';
import { TbClockHour4 } from 'react-icons/tb';
import { MdViewInAr } from 'react-icons/md';
import {
  IoChevronDownCircleOutline,
  IoChevronUpCircleOutline,
  IoRefreshCircleOutline,
} from 'react-icons/io5';

const AuctionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [images, setImages] = useState({
    0: '',
    1: '',
    2: '',
    3: '',
    4: '',
  });
  const [imageLink, setImageLink] = useState('');

  const [updateImages, setUpdateImages] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
  });

  const [iUpdateData, setIUpdateData] = useState({
    name: '',
    description: '',
    height: 0.0,
    width: 0.0,
    length: 0.0,
    weight: 0.0,
  });
  const [aUpdateData, setAUpdateData] = useState({
    startDate: auction?.start_date || '',
    endDate: auction?.end_date || '',
    pickUpAddress: auction?.pickup_address || '',
    buyNowPrice: auction?.buy_now_price || '',
    buyNow: auction?.buy_now || false,
    refundable: auction?.refundable || false,
    startPrice: auction?.start_price || '',
    currentPrice: auction?.start_price || '',
  });
  const [restartData, setRestartData] = useState({
    startDate: '',
    endDate: '',
    startPrice: '',
    buyNowPrice: '',
    buyNow: false,
  });
  const id = location.pathname.split('/').pop();

  // Loader
  const [aloading, setALoading] = useState(false);
  const [iloading, setILoading] = useState(false);
  const [ploading, setPLoading] = useState(false);
  const [rloading, setRLoading] = useState(false);
  const [isRestartingLoading, setIsRestartingLoading] = useState(false);

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

  const getUpdatedAuction = useCallback(async () => {
    setALoading(true);
    setILoading(true);
    setPLoading(true);
    setRLoading(true);
    setIsRestartingLoading(true);

    try {
      const response = await fetch(`${current}auctions/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const auction = await response.json();
      const auctionData = auction.data;
      setAuction(auctionData);
      setPayment(auctionData.payment);
      setImages((prev) => ({
        ...prev,
        0: auctionData.item[0].image_link?.link || '',
        1: auctionData.item[0].image_link_2?.link || '',
        2: auctionData.item[0].image_link_3?.link || '',
        3: auctionData.item[0].image_link_4?.link || '',
        4: auctionData.item[0].image_link_5?.link || '',
      }));
      setImageLink(auctionData.item[0].image_link?.link || '');
      setAUpdateData((prev) => ({
        ...prev,
        startDate: auctionData?.start_date || '',
        endDate: auctionData?.end_date || '',
        pickUpAddress: auctionData?.pickup_address || '',
        buyNowPrice: auctionData?.buy_now_price || '',
        buyNow: auctionData?.buy_now || false,
        refundable: auctionData?.refundable || false,
        startPrice: auctionData?.start_price || '',
        currentPrice: auctionData?.current_price || '',
      }));
      setIUpdateData((prev) => ({
        ...prev,
        name: auctionData?.item[0].name || '',
        description: auctionData?.item[0].description || '',
        height: auctionData?.item[0].height || '',
        width: auctionData?.item[0].width || '',
        length: auctionData?.item[0].length || '',
        weight: auctionData?.item[0].weight || '',
      }));
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.message || 'Failed to fetch auction details');
    } finally {
      setALoading(false);
      setILoading(false);
      setPLoading(false);
      setRLoading(false);
      setIsRestartingLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('_user'));
    if (!userData) {
      navigate('/sign-in');
    } else {
      const auction = userData.auctions.find((auction) => auction.id === id);
      setAuction(auction);
      setPayment(auction?.payment);
      setImages((prev) => ({
        ...prev,
        0: auction.item[0].image_link?.link || '',
        1: auction.item[0].image_link_2?.link || '',
        2: auction.item[0].image_link_3?.link || '',
        3: auction.item[0].image_link_4?.link || '',
        4: auction.item[0].image_link_5?.link || '',
      }));
      setImageLink(auction.item[0].image_link?.link || '');
      setAUpdateData((prev) => ({
        ...prev,
        startDate: auction?.start_date || '',
        endDate: auction?.end_date || '',
        pickUpAddress: auction?.pickup_address || '',
        buyNowPrice: auction?.buy_now_price || '',
        buyNow: auction?.buy_now || false,
        refundable: auction?.refundable || false,
        startPrice: auction?.start_price || '',
        currentPrice: auction?.current_price || '',
      }));
      setIUpdateData((prev) => ({
        ...prev,
        name: auction?.item[0].name || '',
        description: auction?.item[0].description || '',
        height: auction?.item[0].height || '',
        width: auction?.item[0].width || '',
        length: auction?.item[0].length || '',
        weight: auction?.item[0].weight || '',
      }));
      if (!auction) {
        toast.info('Auction not found in user data');
        navigate('/products');
        try {
          getUpdatedAuction();
        } catch (error) {
          console.error('Error fetching auction:', error);
          toast.error('Failed to fetch auction details');
        }
      }
    }
  }, [id, getUpdatedAuction, navigate]);

  const nextImage = () => {
    const validImages = Object.values(images).filter(Boolean); // only non-empty images
    const currentIndex = validImages.indexOf(imageLink);
    const nextIndex = (currentIndex + 1) % validImages.length;
    setImageLink(validImages[nextIndex]);
  };

  const prevImage = () => {
    const validImages = Object.values(images).filter(Boolean); // only non-empty images
    const currentIndex = validImages.indexOf(imageLink);
    const prevIndex =
      (currentIndex - 1 + validImages.length) % validImages.length;
    setImageLink(validImages[prevIndex]);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this auction?'))
      return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = JSON.parse(sessionStorage.getItem('_user'));
      const updatedAuctions = userData.auctions.filter((a) => a.id !== id);
      sessionStorage.setItem(
        '_user',
        JSON.stringify({
          ...userData,
          auctions: updatedAuctions,
        }),
      );

      toast.success('Auction deleted successfully');
      navigate('/products');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete auction');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleUpdate = () => {
    console.log(auction);
    if (!isUpdating) {
      window.scroll(0, 800);
    }
    setIsUpdating(!isUpdating);
  };

  const handleAUpdateData = (e) => {
    const { name, value, type, checked } = e.target;
    setAUpdateData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleIUpdateData = (e) => {
    const { name, value } = e.target;
    setIUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRestartData = (e) => {
    const { name, value, type, checked } = e.target;
    setRestartData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  function removeFalsyValues(obj) {
    const cleanedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (
        value !== null &&
        value !== 0 &&
        value !== '' &&
        value !== undefined &&
        value !== false &&
        !Number.isNaN(value)
      ) {
        cleanedObj[key] = value;
      }
    }
    return cleanedObj;
  }

  const updateAuction = async (e) => {
    e.preventDefault();
    setALoading(true);
    const endpoint = `${current}auctions/${auction.id}`;

    const udata = {
      start_date: auction.status === 'pending' ? aUpdateData.startDate : 0.0,
      end_date: aUpdateData.endDate,
      pickup_address: aUpdateData.pickUpAddress,
      buy_now_price: aUpdateData.buyNowPrice || 0.0,
      buy_now: aUpdateData.buyNow,
      refundable: aUpdateData.refundable,
      start_price: auction.status === 'pending' ? aUpdateData.startPrice : 0.0,
      current_price:
        auction.status === 'pending' ? aUpdateData.startPrice : 0.0,
    };

    // Remove falsy values from udata
    const cleanedUdata = removeFalsyValues(udata);
    console.log('Cleaned Udata:', cleanedUdata);

    const response = await fetch(endpoint, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedUdata),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success('Auction updated successfully');
      setALoading(false);
    } else {
      toast.error(data.message || 'Failed to update item');
      setALoading(false);
    }
    getUpdatedAuction();
  };

  const updateItem = async (e) => {
    e.preventDefault();
    setILoading(true);
    const endpoint = `${current}items/${auction.item[0].id}`;

    const idata = {
      name: iUpdateData.name,
      description: iUpdateData.description,
      height: iUpdateData.height || 0.0,
      width: iUpdateData.width || 0.0,
      length: iUpdateData.length || 0.0,
      weight: iUpdateData.weight || 0.0,
    };

    // Remove falsy values from idata
    const cleanedIData = removeFalsyValues(idata);
    console.log('Cleaned Idata:', cleanedIData);

    const response = await fetch(endpoint, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedIData),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success('Item updated successfully');
      setILoading(false);
      await getUpdatedAuction();
    } else {
      setILoading(false);
      toast.error(data.message || 'Failed to update item');
    }
  };

  const restartAuction = async () => {
    setIsRestartingLoading(true);
    const endpoint = `${current}auctions/restart/${auction.id}`;
    const cleanedRestartdata = removeFalsyValues(restartData);
    const validData = {
      start_date: cleanedRestartdata.startDate,
      end_date: cleanedRestartdata.endDate,
      start_price: cleanedRestartdata.startPrice || 0.0,
      buy_now_price: cleanedRestartdata.buyNowPrice || 0.0,
      buy_now: cleanedRestartdata.buyNow,
    };
    console.log(validData);

    const response = await fetch(endpoint, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validData),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success('Auction Restarted successfully');
      setIsRestartingLoading(false);
      setRestartData({
        startDate: '',
        endDate: '',
        startPrice: '',
        buyNowPrice: '',
        buyNow: false,
      });
    } else {
      toast.error(data.message || 'Failed to restart auction');
      setIsRestartingLoading(false);
    }
    getUpdatedAuction();
  };

  const handleFileUpload = (event, id) => {
    setPLoading(true);
    const file = event.target.files[0];

    if (!file) {
      setPLoading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warn(`${file.name} exceeds 5mb limit`);
      setPLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUpdateImages((prev) => ({
        ...prev,
        [`image${id}`]: {
          url: e.target.result,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          file: file,
        },
      }));
      setPLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateImages = async () => {
    setPLoading(true);
    if (auction.status !== 'active') {
      setPLoading(false);
      toast.warn(
        'You cannot update the images of and Auction that is not active',
      );
      return;
    }

    let newImages = removeFalsyValues(updateImages);
    console.log(newImages);

    const endpoint = `${current}items/upload_images?item_id=${auction.item[0]?.id}`;
    const formData_ = new FormData();

    for (const [key, value] of Object.entries(newImages)) {
      if (value?.file) formData_.append(key, value.file);
    }

    try {
      const resp = await fetch(endpoint, {
        method: 'PUT',
        credentials: 'include',
        body: formData_,
      });

      const response = await resp.json();

      if (!resp.ok) {
        console.error(response);
        throw new Error(`Error: ${response.message} - ${response.detail}`);
      }

      toast.success('Image updated successfully');
      console.log(response);
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setPLoading(false);
      getUpdatedAuction();
    }
  };

  const handleCompleteRefund = async () => {
    setRLoading(true);
    const endpoint = `${current}auctions/complete_refund/${payment.auction_id}`;
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success('Refund completed successfully');
      console.log(data);
      setRLoading(false);
    } catch (error) {
      console.error('Refund error:', error);
      toast.error(error.message || 'Failed to complete refund');
      setRLoading(false);
    } finally {
      getUpdatedAuction();
    }
  };

  const clearUpdateImages = () => {
    setUpdateImages({
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
    });
  };

  if (!auction) {
    return <div className="bg-[#F2F0F1] min-h-screen">Product not found</div>;
  }

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex items-center justify-center mb-6">
            <div className="w-full max-w-full bg-white rounded-lg py-10 px-5 mb-6 mt-4">
              <div className="flex justify-between mb-4 border-b items-center gap-3">
                <h1 className="text-2xl font-bold text-[#9F3247]">
                  Auction Details
                </h1>

                {/* Action Buttons */}
                <div className="flex gap-1 mb-[6px] flex-col sm:flex-row sm:gap-4">
                  <div className="relative group">
                    <IoRefreshCircleOutline
                      size={25}
                      onClick={getUpdatedAuction}
                      className="cursor-pointer text-gray-400 hover:text-gray-800 transition-colors"
                    />
                    <span className="absolute text-xs w-max text-white font-light bg-black rounded-md p-1 -left-1/2 transform -translate-x-5 translate-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Refresh Auction
                    </span>
                  </div>
                  <div className="relative group">
                    <button
                      className="bg-green-400 hover:bg-green-600 text-sm text-white px-3 py-1 rounded-md transition"
                      onClick={() => toggleUpdate()}
                    >
                      Update
                    </button>
                    <span className="absolute text-xs w-max text-white font-light bg-black rounded-md p-1 -left-2 top-9 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Update Auction
                    </span>
                  </div>
                  <div className="relative group">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-sm text-white px-3 py-1 rounded-md transition disabled:bg-red-400"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <span className="absolute text-xs w-max text-white font-light bg-black rounded-md p-1 -left-2 top-9 transform opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Delete Auction
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Image */}
                <div className="w-full md:w-1/2 sm:w-full border-2 border-gray-100 rounded-lg">
                  <div className="relative group w-full h-64 md:h-96 rounded-lg overflow-hidden">
                    <div
                      onClick={prevImage}
                      className="absolute top-[48%] left-[2%] bg-gray-200 rounded-full p-2 cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity duration-300"
                    >
                      <FiChevronLeft className="" />
                    </div>
                    <img
                      src={
                        imageLink ||
                        'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg'
                      }
                      alt="Product"
                      className="w-full h-full rounded-lg object-contain"
                    />
                    <div
                      onClick={nextImage}
                      className="absolute top-[48%] right-[2%] bg-gray-200 rounded-full p-2 cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity duration-300"
                    >
                      <FiChevronRight className="" />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium mb-2">
                      {auction?.item[0].name || 'Product Name'}
                    </h2>

                    <div className="mb-4 flex items-center space-y-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          auction.status === 'active' ||
                          auction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {capitalize(auction.status)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3>Description:</h3>
                    <p className="text-gray-700 text-sm font-light mb-4 whitespace-pre">
                      {auction?.item[0]?.description}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Bidding Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Highest Bid</p>
                        <p className="font-bold">
                          {currencyFormat(auction?.current_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bids Count</p>
                        <p className="font-bold">
                          {/* {auction?.watchers_count.match(
                            /\((\d+) bids\)/,
                          )?.[1] || '0'} */}
                          {auction?.bids.length || '0'}
                        </p>
                      </div>
                      {auction?.buy_now_price && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Buy Now Price</p>
                          <p className="font-bold">
                            {currencyFormat(auction?.buy_now_price)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Auction{' '}
                      {auction.status === 'completed' ? 'ended' : 'ends'} on
                    </p>
                    <p className="font-medium">
                      {new Date(auction.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Restart */}
          <div
            className={`${
              auction.status === 'completed' &&
              (!payment || payment.status === 'refunded')
                ? 'flex'
                : 'hidden'
            } flex-col items-start justify-center mb-10 max-w-full bg-white rounded-lg mx-auto p-4`}
          >
            {auction.status === 'completed' &&
              (!payment || payment.status === 'refunded') && (
                <>
                  <div
                    className="flex justify-between border-b border-gray-200 px-2 py-3 w-full"
                    onClick={() => setIsRestarting(!isRestarting)}
                  >
                    <div className="relative group w-2/5">
                      <p className="text-2xl text-[#9f3247] font-bold">
                        Restart Auction
                      </p>
                      <span className="absolute text-xs text-white font-light bg-black rounded-md p-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        You can restart this auction by clicking here.
                      </span>
                    </div>
                    {!isRestarting ? (
                      <IoChevronDownCircleOutline
                        size={18}
                        onClick={() => setIsRestarting(!isRestarting)}
                      />
                    ) : (
                      <IoChevronUpCircleOutline
                        size={18}
                        onClick={() => setIsRestarting(!isRestarting)}
                      />
                    )}
                  </div>
                  {isRestarting && (
                    <div className="flex flex-col gap-6 w-full p-4 sm:p-6">
                      {/* Date inputs row */}
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date (optional)
                          </label>
                          <input
                            type="datetime-local"
                            name="startDate"
                            onChange={handleRestartData}
                            value={restartData.startDate}
                            className="w-full border-2 border-gray-100 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#9F3247] transition-colors"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date (optional)
                          </label>
                          <input
                            type="datetime-local"
                            name="endDate"
                            onChange={handleRestartData}
                            value={restartData.endDate}
                            className="w-full border-2 border-gray-100 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#9f3247] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Price inputs row */}
                      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Price (optional)
                          </label>
                          <input
                            type="text"
                            name="startPrice"
                            onChange={handleRestartData}
                            value={restartData.startPrice}
                            placeholder="Enter starting price"
                            className="w-full border-2 border-gray-100 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#9F3247] transition-colors"
                          />
                        </div>

                        {/* Buy now section */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buy now Price (optional)
                          </label>

                          {/* Fused input container - minimal */}
                          <div className="flex items-center border-2 border-gray-100 rounded-md shadow-sm focus-within:border-[#9F3247] transition-colors bg-white overflow-hidden">
                            {/* Checkbox section */}
                            <label className="flex items-center gap-2 px-3 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                name="buyNow"
                                checked={restartData.buyNow}
                                onChange={handleRestartData}
                                className="w-4 h-4 text-[#9F3247] bg-white border-2 border-gray-300 rounded focus:ring-[#9F3247] focus:ring-1"
                              />
                              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Buy now
                              </span>
                            </label>

                            {/* Price input section */}
                            <input
                              type="text"
                              name="buyNowPrice"
                              onChange={handleRestartData}
                              disabled={!restartData.buyNow}
                              value={restartData.buyNowPrice}
                              placeholder={
                                restartData.buyNow
                                  ? 'Enter price'
                                  : 'Check box to enable'
                              }
                              className={`flex-1 px-3 py-3 bg-white border-none outline-none transition-all ${
                                !restartData.buyNow
                                  ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                  : 'text-gray-900'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit button */}
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={restartAuction}
                          className="flex items-center justify-center w-full justify-self-center sm:w-auto min-w-[200px] bg-[#9F3247] text-white px-6 py-3 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-[#9F3247] focus:ring-offset-2 transition-all duration-200 font-medium"
                        >
                          {isRestartingLoading ? (
                            <Loader otherStyles="h-[20px] w-[20px] border-2" />
                          ) : (
                            'Restart Auction'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
          </div>

          {/* Payment */}
          <div
            className={`flex flex-col items-start justify-center ${
              isUpdating ? 'mb-4' : 'mb-32'
            } max-w-full bg-white rounded-lg mx-auto p-4`}
          >
            <h2 className="flex justify-between w-full text-2xl font-bold text-[#9F3247] mb-6 border-b pb-2">
              Payment Details
              <span className="text-sm font-light">
                <div
                  className={`rounded-md p-2 text-right ${
                    paymentStatMap[payment?.status || 'pending']?.cls ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {Icon && <Icon className="inline mx-1" size={20} />}
                  {capitalize(payment?.status) || 'No payment'}
                </div>
              </span>
            </h2>
            {/* Buyers details */}
            <div className="flex flex-col items-start px-2 pb-2 justify-start gap-5 mb-4 md:flex-row md:items-center">
              <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center border-2 justify-center mr-4 overflow-hidden">
                {payment?.buyer?.image_link?.link ? (
                  <img
                    src={payment?.buyer?.image_link?.link}
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
                    Buyer&apos;s email:
                  </span>
                  {payment?.buyer?.email || 'None'}
                </p>
                <p className="text-md text-gray-500 font-light">
                  <span className="text-gray-600 mr-2 font-bold">
                    Buyer&apos;s Phone:
                  </span>
                  {payment?.buyer?.phone_number || 'none'}
                </p>
              </div>
            </div>
            {/* Amount / refunds */}
            <div className="px-2 py-4 w-full">
              <p className="text-md text-gray-500 font-light">
                <span className="text-gray-600 mr-2 font-bold">Amount:</span>
                {payment?.amount ? currencyFormat(payment?.amount) : 'None'}
              </p>
              <p className="text-md text-gray-500 font-light">
                <span className="text-gray-600 mr-2 font-bold">Due date:</span>
                {payment?.due_data ? formatDateTime(payment?.due_data) : 'None'}
              </p>
              {auction?.refundable &&
                payment?.refund_requested &&
                payment?.status === 'refunding' && (
                  <>
                    <p className="text-sm text-gray-500 font-light mt-3">
                      A refund has been requested for this payment. click the
                      button below to confirm receipt of the item and complete
                      the refund.
                      <button
                        onClick={() => handleCompleteRefund()}
                        className="flex items-center justify-center w-26 mt-2 font-normal bg-maroon text-white px-4 py-2 rounded-lg hover:bg-red-800"
                      >
                        {rloading ? (
                          <Loader otherStyles="h-[20px] w-[20px] border-2" />
                        ) : (
                          'Complete refund'
                        )}
                      </button>
                    </p>
                  </>
                )}
            </div>
          </div>

          {isUpdating && (
            <div className="flex items-center justify-center max-w-full mb-20 p-6">
              <div className="flex w-full max-w-6xl gap-4 flex-col">
                {/* --- */}
                <div className="flex w-full gap-2 flex-col lg:flex-row">
                  {/* Items Section */}
                  <div className="flex-1 w-[100%] bg-white rounded-lg p-5 flex flex-col lg:w-[100%]">
                    <div className="flex w-full border-b pb-2 justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-[#9F3247]">
                        Update Item
                      </h2>
                    </div>
                    <form className="space-y-4 w-full">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={iUpdateData.name}
                          onChange={handleIUpdateData}
                          className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows="3"
                          value={iUpdateData.description}
                          onChange={handleIUpdateData}
                          className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            name="height"
                            value={iUpdateData.height}
                            onChange={handleIUpdateData}
                            className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            name="weight"
                            value={iUpdateData.weight}
                            onChange={handleIUpdateData}
                            className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Width (cm)
                          </label>
                          <input
                            type="number"
                            name="width"
                            value={iUpdateData.width}
                            onChange={handleIUpdateData}
                            className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Length (cm)
                          </label>
                          <input
                            type="number"
                            name="length"
                            value={iUpdateData.length}
                            onChange={handleIUpdateData}
                            className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={updateItem}
                        className="flex items-center justify-center w-[100%] mt-8s bg-[#9F3247] text-white px-4 py-2 rounded-md hover:bg-red-800"
                      >
                        {iloading ? (
                          <Loader otherStyles="h-[20px] w-[20px] border-2" />
                        ) : (
                          'Update Item'
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Auction Section */}
                  <div className="flex-1 w-[100%] bg-white rounded-lg p-5 flex flex-col lg:w-[100%]">
                    <div className="flex w-full border-b pb-2 justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-[#9F3247]">
                        Update Auction
                      </h2>
                    </div>
                    <form className="space-y-4 w-full">
                      {auction.status !== 'pending' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="datetime-local"
                            name="endDate"
                            value={aUpdateData.endDate}
                            onChange={handleAUpdateData}
                            className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                          />
                        </div>
                      ) : (
                        <>
                          {/* Date section */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Start Date
                              </label>
                              <input
                                type="datetime-local"
                                name="startDate"
                                disabled={auction.status !== 'pending'}
                                value={aUpdateData.startDate}
                                onChange={handleAUpdateData}
                                className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                End Date
                              </label>
                              <input
                                type="datetime-local"
                                name="endDate"
                                value={aUpdateData.endDate}
                                onChange={handleAUpdateData}
                                className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                              />
                            </div>
                          </div>

                          {/* Price section */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Start price
                              </label>
                              <input
                                type="number"
                                name="startPrice"
                                disabled={auction.status !== 'pending'}
                                value={aUpdateData.startPrice}
                                onChange={handleAUpdateData}
                                className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Current price
                              </label>
                              <input
                                type="number"
                                name="currentPrice"
                                disabled={auction.status !== 'pending'}
                                value={aUpdateData.startPrice}
                                onChange={handleAUpdateData}
                                className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pick-up Address
                        </label>
                        <input
                          type="text"
                          name="pickUpAddress"
                          value={aUpdateData.pickUpAddress}
                          onChange={handleAUpdateData}
                          className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Buy Now Price
                          <span className="text-red-500 font-ligter text-xs pl-2">
                            {!aUpdateData.buyNow &&
                              '(Disabled if Buy now is not selected)'}
                          </span>
                        </label>
                        <input
                          type="number"
                          name="buyNowPrice"
                          disabled={!aUpdateData.buyNow}
                          value={aUpdateData.buyNowPrice}
                          onChange={handleAUpdateData}
                          className="mt-1 block w-full border-2 border-gray-100 rounded-md shadow-sm p-2 focus:outline-none focus:border-[#9F3247]"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="buyNow"
                            value={aUpdateData.buyNow}
                            className="h-5 w-5 text-maroon"
                            onChange={handleAUpdateData}
                          />
                          <span className="text-sm text-gray-700">Buy Now</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="refundable"
                            value={aUpdateData.refundable}
                            className="h-5 w-5 text-maroon"
                            onChange={handleAUpdateData}
                          />
                          <span className="text-sm text-gray-700">
                            Refundable
                          </span>
                        </label>
                      </div>

                      <button
                        onClick={updateAuction}
                        className="flex items-center justify-center w-[100%] mt-10 bg-[#9F3247] text-white px-4 py-2 rounded-md hover:bg-red-800"
                      >
                        {aloading ? (
                          <Loader otherStyles="h-[20px] w-[20px] border-2" />
                        ) : (
                          'Update Auction'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
                {/* --- */}

                {/* Image section */}
                <div className="flex-auto flex-wrap bg-white width-full rounded-lg p-10 order-3 lg:order-last">
                  <div className="flex w-full border-b pb-2 justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-[#9F3247]">
                      Update Images
                    </h2>
                  </div>
                  <div className="flex flex-row items-center gap-2 overflow-x-auto">
                    {Object.keys(images).map((val) => (
                      <div key={val}>
                        {images[val] !== '' ? (
                          <div className="relative w-[100px] group border-2 rounded-lg">
                            <img
                              className="w-[100px] h-[100px] object-cover rounded-t-lg"
                              src={
                                updateImages[`image${Number(val) + 1}`]?.url ||
                                images[val]
                              }
                              alt={`image_${Number(val) + 1}`}
                            />
                            <label
                              htmlFor={`upload-photo-${Number(val) + 1}`}
                              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileUpload(e, Number(val) + 1)
                                }
                                className="hidden"
                                id={`upload-photo-${Number(val) + 1}`}
                              />
                              <MdModeEdit className="text-white text-xs" />
                            </label>
                            <p className="text-xs text-center truncate mt-1">
                              {Number(val) + 1}
                            </p>
                          </div>
                        ) : (
                          <div
                            className={`border-2 rounded-lg w-[100px] flex flex-col items-center justify-center cursor-pointer ${
                              !updateImages[`image${Number(val) + 1}`]?.url &&
                              'px-4 py-9'
                            }`}
                          >
                            <label htmlFor={`upload-photo-${Number(val) + 1}`}>
                              <img
                                src={
                                  updateImages[`image${Number(val) + 1}`]
                                    ?.url || uploadIcon
                                }
                                alt="Upload"
                                className={`mb-1 ${
                                  updateImages[`image${Number(val) + 1}`]?.url
                                    ? 'w-[100px] h-[100px]'
                                    : 'w-6 h-6'
                                } object-cover rounded-t-lg`}
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileUpload(e, Number(val) + 1)
                                }
                                className="hidden"
                                id={`upload-photo-${Number(val) + 1}`}
                              />
                              <p className="text-xs text-center truncate mt-1">
                                {Number(val) + 1}
                              </p>
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex w-full p-2 items-center justify-center">
                    {ploading && <LoaderM />}
                  </div>
                  <div className="w-full flex flex-row gap-[1%]">
                    <button
                      onClick={() => handleUpdateImages()}
                      className="flex items-center justify-center w-[78%] mt-10 bg-[#9F3247] text-white px-4 py-2 rounded-md hover:bg-red-800"
                    >
                      {ploading ? (
                        <Loader otherStyles="h-[20px] w-[20px] border-2" />
                      ) : (
                        'Update Images'
                      )}
                    </button>
                    <button
                      onClick={() => clearUpdateImages()}
                      className="flex items-center justify-center w-[20%] mt-10 bg-[#9F3247] text-white px-4 py-2 rounded-md hover:bg-red-800"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
