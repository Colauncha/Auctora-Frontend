// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Breadcrumbs from '../../../Components/Breadcrumbs';
// import { current, Fetch } from '../../../utils';
// import { FiPlus, FiLink } from 'react-icons/fi';
// import { currencyFormat } from '../../../utils';
// import Loader from '../../../assets/loader2';
// import { toast } from 'react-toastify';

// const YourProduct = () => {
//   const navigate = useNavigate();

//   const [auctions, setAuctions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchAuctions = useCallback(async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await Fetch({
//         url: `${current}users/auctions`,
//         method: 'GET',
//       });

//       if (error) {
//         throw error;
//       }
//       setAuctions(data.data || []);
//       console.log(data.data);
//     } catch (error) {
//       console.error('Error fetching Auctions:', error);
//       toast.error('Failed to load Auctions. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const tabs = [
//     { name: 'All', href: '#', current: false, filter: () => auctions },
//     {
//       name: 'Active',
//       href: '#',
//       current: true,
//       filter: () => {
//         return auctions.filter((a) => a.status === 'active');
//       },
//     },
//     {
//       name: 'Completed',
//       href: '#',
//       current: false,
//       filter: () => {
//         return auctions.filter((a) => a.status === 'completed');
//       },
//     },
//     {
//       name: 'Pending',
//       href: '#',
//       current: false,
//       filter: () => {
//         return auctions.filter((a) => a.status === 'pending');
//       },
//     },
//   ];

//   useEffect(() => {
//     fetchAuctions();
//   }, [fetchAuctions]);

//   const handleAddImage = () => {
//     navigate('/Add-Product');
//   };

//   const handleProductClick = (product, id) => {
//     navigate(`/dashboard/products/${id}`, { state: { product } });
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen">
//       <div className="formatter">
//         <div className="py-6">
//           <Breadcrumbs />
//           <div className="flex items-center justify-center">
//             <div
//               className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4"
//               style={{ minHeight: '500px' }}
//             >
//               {loading ? (
//                 <Loader otherStyles={'w-12 h-12'} />
//               ) : (
//                 <div className="flex justify-start items-start">
//                   <div></div>
//                   <div className="flex flex-wrap gap-6">
//                     {auctions.map((item) => (
//                       <div
//                         key={item.id}
//                         className="relative w-[100px] h-[100px] group cursor-pointer"
//                         onClick={() => handleProductClick(item, item.id)}
//                       >
//                         <div className="w-[100px] h-[100px] rounded-lg overflow-hidden">
//                           <img
//                             src={
//                               item?.item[0]?.image_link?.link ||
//                               'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg'
//                             }
//                             alt="Product"
//                             className="w-full h-full object-cover"
//                           />
//                           <div className="absolute top-0 left-0 w-full h-[100px] rounded-lg bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300">
//                             <FiLink />
//                           </div>
//                         </div>
//                         <div className="text-left mt-2">
//                           <p className="text-sm font-semibold text-black">
//                             {item.item[0]?.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {currencyFormat(item.start_price)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}

//                     {/* Plus Icon for Upload */}
//                     <div
//                       className="w-[100px] h-[100px] bg-red-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
//                       onClick={handleAddImage}
//                     >
//                       <FiPlus className="text-maroon text-3xl" />
//                       <input
//                         type="file"
//                         onChange=""
//                         accept="image/*"
//                         className="hidden"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YourProduct;

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../Components/Breadcrumbs';
import { current, Fetch } from '../../../utils';
import { Plus, Link, ChevronLeft, ChevronRight } from 'lucide-react';
import { currencyFormat } from '../../../utils';
import Loader from '../../../assets/loader2';
import { toast } from 'react-toastify';

const YourProduct = () => {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 11; // 11 items + 1 add button = 12 total

  const fetchAuctions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data, error } = await Fetch({
        url: `${current}users/auctions?page=${page}&limit=${itemsPerPage}`,
        method: 'GET',
      });

      if (error) {
        throw error;
      }
      setAuctions(data.data || []);
      setTotalPages(data.pages);
      setTotalItems(data.total);
      console.log(data.data);
    } catch (error) {
      console.error('Error fetching Auctions:', error);
      toast.error('Failed to load Auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const tabs = [
    { name: 'All', filter: () => auctions },
    {
      name: 'Active',
      filter: () => auctions.filter((a) => a.status === 'active'),
    },
    {
      name: 'Completed',
      filter: () => auctions.filter((a) => a.status === 'completed'),
    },
    {
      name: 'Pending',
      filter: () => auctions.filter((a) => a.status === 'pending'),
    },
  ];

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const handleAddImage = () => {
    navigate('/Add-Product');
  };

  const handleProductClick = (product, id) => {
    navigate(`/dashboard/products/${id}`, { state: { product } });
  };

  // Get filtered auctions based on active tab
  const getFilteredAuctions = () => {
    const activeTabObj = tabs.find((tab) => tab.name === activeTab);
    return activeTabObj ? activeTabObj.filter() : auctions;
  };

  // Pagination logic
  const filteredAuctions = getFilteredAuctions();
  const currentAuctions = filteredAuctions;

  const handlePageChange = async (page) => {
    setCurrentPage(page);
    await fetchAuctions(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex items-center justify-center">
            <div
              className="w-full max-w-full bg-white rounded-lg shadow-md"
              style={{ minHeight: '500px' }}
            >
              {/* Header Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Your Products
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage and track your auction items
                    </p>
                  </div>
                  <button
                    onClick={handleAddImage}
                    className="bg-[#9f3247] hover:bg-[#8a2a3d] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Plus className="text-lg" />
                    <span className="font-semibold">Add Product</span>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto">
                  {tabs.map((tab) => {
                    const count = tab.filter().length;
                    return (
                      <button
                        key={tab.name}
                        onClick={() => handleTabChange(tab.name)}
                        className={`px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                          activeTab === tab.name
                            ? 'bg-[#9f3247] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span>{tab.name}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            activeTab === tab.name
                              ? 'bg-white bg-opacity-20'
                              : 'bg-white'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {loading ? (
                  <div
                    className="flex justify-center items-center"
                    style={{ minHeight: '400px' }}
                  >
                    <Loader otherStyles={'w-12 h-12'} />
                  </div>
                ) : filteredAuctions.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center"
                    style={{ minHeight: '400px' }}
                  >
                    <div className="bg-gray-100 rounded-full p-8 mb-4">
                      <Plus className="text-6xl text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No {activeTab.toLowerCase()} products
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {activeTab === 'All'
                        ? 'Start by adding your first product'
                        : `You don't have any ${activeTab.toLowerCase()} products yet`}
                    </p>
                    <button
                      onClick={handleAddImage}
                      className="bg-[#9f3247] hover:bg-[#8a2a3d] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus />
                      <span>Add Your First Product</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {currentAuctions.map((item) => (
                        <div
                          key={item.id}
                          className="group cursor-pointer"
                          onClick={() => handleProductClick(item, item.id)}
                        >
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img
                              src={
                                item?.item[0]?.image_link?.link ||
                                'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg'
                              }
                              alt={item.item[0]?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center">
                                <Link className="text-white text-2xl" />
                              </div>
                            </div>
                            {/* Status Badge */}
                            <div className="absolute top-2 right-2">
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadge(
                                  item.status,
                                )}`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {item.item[0]?.name || 'Untitled'}
                            </p>
                            <p className="text-sm text-[#9f3247] font-bold mt-1">
                              {currencyFormat(item.start_price)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Plus Icon for Upload - Only show on first page */}
                      {currentPage === 1 && (
                        <div
                          className="w-full aspect-square bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:from-[#9f3247] hover:to-[#8a2a3d] transition-all duration-300 shadow-md hover:shadow-xl group border-2 border-dashed border-red-200 hover:border-transparent"
                          onClick={handleAddImage}
                        >
                          <Plus className="text-[#9f3247] group-hover:text-white text-4xl mb-2 transition-colors" />
                          <span className="text-xs text-gray-600 group-hover:text-white font-medium transition-colors">
                            Add Product
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="text-gray-600" />
                        </button>

                        <div className="flex gap-1">
                          {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            // Show first page, last page, current page, and pages around current
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                    currentPage === page
                                      ? 'bg-[#9f3247] text-white shadow-md'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={page}
                                  className="w-10 h-10 flex items-center justify-center text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="text-gray-600" />
                        </button>
                      </div>
                    )}

                    {/* Page Info */}
                    {totalPages > 1 && (
                      <div className="text-center mt-4 text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to
                        {(currentPage - 1) * itemsPerPage +
                          currentAuctions.length}{' '}
                        of {totalItems} products
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourProduct;
