import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../Components/Breadcrumbs';
import { capitalize, currencyFormat } from '../../../utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { API_BASE_URL } from '../../Sell/AddProduct/config';
import { current } from '../../../utils';
import Loader from '../../../assets/loaderWhite';
import LoaderM from '../../../assets/loader2';
import { MdModeEdit } from 'react-icons/md';
import uploadIcon from '../../../assets/icons/upload.png';

const AuctionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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
  const id = location.pathname.split('/').pop();

  // Loader
  const [aloading, setALoading] = useState(false);
  const [iloading, setILoading] = useState(false);
  const [ploading, setPLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('_user'));
    if (!userData) {
      navigate('/sign-in');
    } else {
      const auction = userData.auctions.find((auction) => auction.id === id);
      setAuction(auction);
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
        alert('Auction not found in user data');
        navigate('/products');
      }
    }
  }, [id, navigate]);

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
    } else {
      setILoading(false);
      toast.error(data.message || 'Failed to update item');
    }
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
          <div className="flex items-center justify-center mb-20">
            <div className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4">
              <div className="flex justify-between items-start mb-4 lg:flex-row md:flex-col md:gap-4 sm:flex-col sm:gap-4">
                <h1 className="text-4xl font-extrabold text-maroon">
                  Auction Details
                </h1>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-md transition"
                    onClick={() => toggleUpdate()}
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md transition disabled:bg-red-400"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Image */}
                <div className="w-full md:w-1/2 sm:w-full">
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
                        'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743008126/ddsdomp6w9lwqb2igqx7.jpg'
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
                  <h2 className="text-2xl font-bold mb-2">
                    {auction?.item[0].name || 'Product Name'}
                  </h2>

                  <div className="mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        auction.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {capitalize(auction.status)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {auction?.item[0]?.description}
                  </p>

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
        </div>
      </div>

      {isUpdating && (
        <div className="formatter">
          <div className="flex items-center justify-center gap-[2%] mb-20 py-6">
            <div className="flex w-full max-w-6xl gap-4 flex-col">
              {/* --- */}
              <div className="flex w-full gap-2 flex-col lg:flex-row">
                {/* Items Section */}
                <div className="flex-1 w-[100%] bg-white rounded-lg p-10 flex flex-col lg:w-[50%]">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-extrabold text-maroon">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                    </div>

                    <button
                      onClick={updateItem}
                      className="flex items-center justify-center w-[100%] mt-8s bg-maroon text-white px-4 py-2 rounded-md hover:bg-red-800"
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
                <div className="flex-1 w-[100%] bg-white rounded-lg p-10 flex flex-col lg:w-[50%]">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-extrabold text-maroon">
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
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="buyNow"
                          value={aUpdateData.buyNow}
                          className="h-4 w-4 text-maroon"
                          onChange={handleAUpdateData}
                        />
                        <span className="text-sm text-gray-700">Buy Now</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="refundable"
                          value={aUpdateData.refundable}
                          className="h-4 w-4 text-maroon"
                          onChange={handleAUpdateData}
                        />
                        <span className="text-sm text-gray-700">
                          Refundable
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={updateAuction}
                      className="flex items-center justify-center w-[100%] mt-10 bg-maroon text-white px-4 py-2 rounded-md hover:bg-red-800"
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
              <div className="flex-auto flex-wrap bg-white width-[80dvw] rounded-lg p-10 order-3 lg:order-last">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-extrabold text-maroon">
                    Update Images
                  </h2>
                </div>
                <div className="flex flex-row items-center gap-2">
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
                                updateImages[`image${Number(val) + 1}`]?.url ||
                                uploadIcon
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
                    className="flex items-center justify-center w-[78%] mt-10 bg-maroon text-white px-4 py-2 rounded-md hover:bg-red-800"
                  >
                    {ploading ? (
                      <Loader otherStyles="h-[20px] w-[20px] border-2" />
                    ) : (
                      'Update Images'
                    )}
                  </button>
                  <button
                    onClick={() => clearUpdateImages()}
                    className="flex items-center justify-center w-[20%] mt-10 bg-maroon text-white px-4 py-2 rounded-md hover:bg-red-800"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetails;
