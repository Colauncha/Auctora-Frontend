// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Breadcrumbs from '../../../Components/Breadcrumbs';
// import { capitalize, currencyFormat } from '../../../utils';

// const AuctionDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [auction, setAuction] = useState(null);
//   const id = location.pathname.split('/').pop();

//   useEffect(() => {
//     const userData = JSON.parse(sessionStorage.getItem('_user'));
//     if (!userData) {
//       navigate('/sign-in');
//     } else {
//       const auction = userData.auctions.find((auction) => auction.id === id);
//       setAuction(auction);
//       if (!auction) {
//         alert('Auction not found in user data');
//         navigate('/products');
//       }
//     }
//   }, [id, navigate]);

//   if (!auction) {
//     return <div className="bg-[#F2F0F1] min-h-screen">Product not found</div>;
//   }

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen">
//       <div className="formatter">
//         <div className="py-6">
//           <Breadcrumbs />
//           <div className="flex items-center justify-center mb-20">
//             <div className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4">
//               <h1 className="text-left text-4xl mb-4 font-extrabold text-maroon">
//                 Auction Details
//               </h1>

//               <div className="flex flex-col md:flex-row gap-8">
//                 {/* Product Image */}
//                 <div className="w-full md:w-1/2">
//                   <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
//                     <img
//                       src={
//                         auction?.item[0]?.image_link?.link ||
//                         'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743008126/ddsdomp6w9lwqb2igqx7.jpg'
//                       }
//                       alt="Product"
//                       className="w-full h-full rounded-lg object-contain"
//                     />
//                   </div>
//                 </div>

//                 {/* Product Details */}
//                 <div className="w-full md:w-1/2">
//                   <h2 className="text-2xl font-bold mb-2">
//                     {auction?.item[0].name || 'Product Name'}
//                   </h2>

//                   {/* Auction Status */}
//                   <div className="mb-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         auction.status === 'active'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}
//                     >
//                       {capitalize(auction.status)}
//                     </span>
//                   </div>

//                   {/* Description */}
//                   <p className="text-gray-700 mb-4">
//                     {auction?.item[0]?.description}
//                   </p>

//                   {/* Bidding Info */}
//                   <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                     <h3 className="font-semibold text-lg mb-2">
//                       Bidding Information
//                     </h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="text-sm text-gray-500">Highest Bid</p>
//                         <p className="font-bold">
//                           {currencyFormat(auction?.current_price)}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-500">Bids Count</p>
//                         <p className="font-bold">
//                           {/* {auction?.watchers_count.match(
//                             /\((\d+) bids\)/,
//                           )?.[1] || '0'} */}
//                           {auction?.bids.length || '0'}
//                         </p>
//                       </div>
//                       {auction?.buy_now_price && (
//                         <div className="col-span-2">
//                           <p className="text-sm text-gray-500">Buy Now Price</p>
//                           <p className="font-bold">
//                             {currencyFormat(auction?.buy_now_price)}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* End Date */}
//                   <div className="mb-4">
//                     <p className="text-sm text-gray-500">
//                       Auction{' '}
//                       {auction.status === 'completed' ? 'ended' : 'ends'} on
//                     </p>
//                     <p className="font-medium">
//                       {new Date(auction.end_date).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionDetails;


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
  if (!window.confirm('Are you sure you want to delete this auction?')) return;
  
  setIsDeleting(true);
  try {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}` 
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

 
    const userData = JSON.parse(sessionStorage.getItem('_user'));
    const updatedAuctions = userData.auctions.filter(a => a.id !== id);
    sessionStorage.setItem('_user', JSON.stringify({
      ...userData,
      auctions: updatedAuctions
    }));
    
    toast.success('Auction deleted successfully');
    navigate('/products');
  } catch (error) {
    console.error('Delete error:', error);
    toast.error(error.message || 'Failed to delete auction');
  } finally {
    setIsDeleting(false);
  }
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
    </div>
  );
};

export default AuctionDetails;