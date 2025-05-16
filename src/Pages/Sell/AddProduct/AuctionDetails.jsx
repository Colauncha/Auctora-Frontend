import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../Components/Breadcrumbs';
import { capitalize, currencyFormat } from '../../../utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../Sell/AddProduct/config';

const AuctionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [aUpdateData, setAUpdateData] = useState({});
  const [iUpdateData, setIUpdateData] = useState({});
  const id = location.pathname.split('/').pop();

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('_user'));
    if (!userData) {
      navigate('/sign-in');
    } else {
      const auction = userData.auctions.find((auction) => auction.id === id);
      setAuction(auction);
      if (!auction) {
        alert('Auction not found in user data');
        navigate('/products');
      }
    }
  }, [id, navigate]);

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
    setIsUpdating(!isUpdating);
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
              <div className="flex justify-between items-start mb-4">
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
                <div className="w-full md:w-1/2">
                  <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
                    <img
                      src={
                        auction?.item[0]?.image_link?.link ||
                        'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743008126/ddsdomp6w9lwqb2igqx7.jpg'
                      }
                      alt="Product"
                      className="w-full h-full rounded-lg object-contain"
                    />
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
            <div className="flex w-full max-w-6xl gap-4">
              {/* Items Section */}
              <div className="flex-1 bg-white rounded-lg p-10 flex flex-col">
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 bg-maroon text-white px-4 py-2 rounded-md hover:bg-red-800"
                  >
                    Save Item
                  </button>
                </form>
              </div>

              {/* Auction Section */}
              <div className="flex-1 bg-white rounded-lg p-10 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-extrabold text-maroon">
                    Update Auction
                  </h2>
                </div>
                <form className="space-y-4 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
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
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pick-up Address
                    </label>
                    <input
                      type="text"
                      name="pickUpAddress"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Buy Now Price
                    </label>
                    <input
                      type="number"
                      name="buyNowPrice"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="buyNow"
                        className="h-4 w-4 text-maroon"
                      />
                      <span className="text-sm text-gray-700">Buy Now</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="refundable"
                        className="h-4 w-4 text-maroon"
                      />
                      <span className="text-sm text-gray-700">Refundable</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 bg-maroon text-white px-4 py-2 rounded-md hover:bg-red-800"
                  >
                    Save Auction
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetails;
