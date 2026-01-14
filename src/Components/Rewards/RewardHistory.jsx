import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Filter, X } from 'lucide-react';
import { current } from '../../utils';
import BidPoint from '../../assets/svg/bidPoint.svg';
import BidCredit from '../../assets/svg/bidCredit.svg';
import Fetch from '../../utils/Fetch';
import { toast } from 'react-toastify';

const RewardHistory = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [redeemLoading, setRedeemLoading] = useState(false);

  const [rewards, setRewards] = useState([]);

  // Pagination and Filters
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRewards, setTotalRewards] = useState(0);
  const [filters, setFilters] = useState({
    amount: '',
    type: '',
  });

  // Redeemable
  const [redeemPoint, setRedeemPoint] = useState(0);

  const buildQueryString = useCallback(
    (
      selectedPage = page,
      selectedPerPage = perPage,
      selectedFilters = filters
    ) => {
      const params = new URLSearchParams();
      params.append('page', selectedPage.toString());
      params.append('per_page', selectedPerPage.toString());

      if (selectedFilters.amount) {
        params.append('amount', selectedFilters.amount);
      }
      if (selectedFilters.type) {
        params.append('type', selectedFilters.type);
      }

      return params.toString();
    },
    [page, perPage, filters]
  );

  const fetchRewards = useCallback(
    async (
      selectedPage = page,
      selectedPerPage = perPage,
      selectedFilters = filters
    ) => {
      setLoading(true);
      try {
        const queryString = buildQueryString(
          selectedPage,
          selectedPerPage,
          selectedFilters
        );
        const { data: resp, error } = await Fetch({
          method: 'GET',
          url: `${current}users/rewards/history?${queryString}`,
        });

        if (error) {
          throw new Error(error);
        }
        // console.log(data);
        setRewards(resp?.data || []);
        setTotalPages(resp?.pages);
        setCurrentPage(resp?.page_number);
        setTotalRewards(resp?.total);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, filters, buildQueryString]
  );

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
    fetchRewards(1, perPage, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = { amount: '', status: '', transaction_type: '' };
    setFilters(emptyFilters);
    setPage(1);
    fetchRewards(1, perPage, emptyFilters);
  };

  const BidPointElem = (
    <img src={BidPoint} alt="BidPoint" className="w-5 h-5 inline mx-1" />
  );

  const BidCreditElem = (
    <img src={BidCredit} alt="BidCredit" className="w-5 h-5 inline mx-1" />
  );

  // Redeem reward points
  const handleRedeem = () => {
    setRedeemLoading(true);
    try {
      const { data: resp, error } = Fetch({
        method: 'POST',
        url: `${current}users/rewards/redeem?points=${redeemPoint}`,
      });

      if (error) {
        throw new Error(error);
      }

      toast.success(resp.message || 'Points redeemed successfully!');
    } catch (error) {
      console.error('Error Redeeming points:', error);
    } finally {
      setRedeemLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Count active filters
  useEffect(() => {
    const count = Object.values(filters).filter((value) => value !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Auto-verify pending Rewards on load
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reward History
              </h1>
              <p className="text-gray-600 mt-1">Track all your Rewards</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 relative"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => fetchRewards()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <div className="flex gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Amount Filter */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={filters.amount}
                  onChange={(e) => handleFilterChange('amount', e.target.value)}
                  placeholder="Enter minimum amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-20 outline-none"
                  style={{ focusRingColor: '#9f3247' }}
                />
              </div> */}

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-20 outline-none"
                  style={{ focusRingColor: '#9f3247' }}
                >
                  <option value="">All Types</option>
                  <option value="REFER_USER">Refer Users</option>
                  <option value="FUND_WALLET">Fund Wallet</option>
                  <option value="LIST_PRODUCT">List Product</option>
                  <option value="WIN_AUCTION">Win Auction</option>
                  <option value="PLACE_BID">Place Bid</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">
                    Active filters:
                  </span>
                  {/* {filters.amount && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Amount ≥ {formatCurrency(filters.amount)}
                      <button
                        onClick={() => handleFilterChange('amount', '')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )} */}
                  {filters.type && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Status: {filters.type}
                      <button
                        onClick={() => handleFilterChange('status', '')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rewards Table */}
        <div
          id="history"
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3 text-gray-600">Loading Rewards...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#9f3247' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rewards.map((reward, index) => {
                      return (
                        <tr
                          key={reward.id}
                          className={`hover:bg-gray-50 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {reward.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {reward.type.replace(/_/g, ' ').toLowerCase()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              <img
                                src={BidPoint}
                                alt="Bid Point"
                                className="inline w-5 h-5 mr-1"
                              />
                              {reward.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(reward.created_at)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 0 && (
                <div className="bg-white px-6 py-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700">
                        Showing page {currentPage} of {totalPages}
                      </div>
                      <div className="text-sm text-gray-500">
                        ({rewards.length} of {totalRewards} total Rewards)
                      </div>
                    </div>

                    {/* Per Page */}
                    <div>
                      <label
                        htmlFor="perPage"
                        className="text-sm text-gray-700 mr-2"
                      >
                        Rewards per page:
                      </label>
                      <select
                        id="perPage"
                        value={perPage}
                        onChange={(e) => {
                          setPerPage(Number(e.target.value));
                          fetchRewards(1, e.target.value, filters); // Reset to first page
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {[5, 10, 20, 50].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* First Page */}
                      <button
                        onClick={() => fetchRewards(1, perPage, filters)}
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        First
                      </button>

                      {/* Previous */}
                      <button
                        onClick={() =>
                          fetchRewards(currentPage - 1, perPage, filters)
                        }
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => {
                                  setPage(pageNum);
                                  fetchRewards(pageNum, perPage, filters);
                                }}
                                disabled={loading}
                                className={`px-3 py-1 border rounded text-sm disabled:opacity-50 ${
                                  pageNum === currentPage
                                    ? 'text-white border-transparent'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                                style={
                                  pageNum === currentPage
                                    ? { backgroundColor: '#9f3247' }
                                    : {}
                                }
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* Next */}
                      <button
                        onClick={() =>
                          fetchRewards(currentPage + 1, perPage, filters)
                        }
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        Next
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() =>
                          fetchRewards(totalPages, perPage, filters)
                        }
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Stats */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {rewards.filter((t) => t.type === 'REFER_USER').length}
                    </div>
                    <div className="text-sm text-gray-600">Refer User</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-600">
                      {rewards.filter((t) => t.type === 'FUND_WALLET').length}
                    </div>
                    <div className="text-sm text-gray-600">Fund Wallet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {rewards.filter((t) => t.type === 'WIN_AUCTION').length}
                    </div>
                    <div className="text-sm text-gray-600">Win Auction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {rewards.filter((t) => t.type === 'LIST_PRODUCT').length}
                    </div>
                    <div className="text-sm text-gray-600">List Product</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {rewards.filter((t) => t.type === 'PLACE_BID').length}
                    </div>
                    <div className="text-sm text-gray-600">Place Bid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {rewards
                        .reduce((total, reward) => total + reward.amount, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Redeem reward points */}
        <div id="redeem" className="p-6 mt-10 bg-white rounded-xl shadow-lg">
          <div className="max-w-full mx-auto text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Redeem Your Reward Points
            </h2>
            <p className="text-gray-600 mb-3">
              You can redeem your reward points for{' '}
              <span>
                <img
                  src={BidCredit}
                  alt="BidCredit"
                  className="w-5 h-5 ml-2 inline"
                />
              </span>{' '}
              Bid Credit, when you accumulate{' '}
              <span>
                <img
                  src={BidPoint}
                  alt="BidPoint"
                  className="w-5 h-5 ml-2 inline"
                />
              </span>{' '}
              1,000+ Bid points!
            </p>
            <p className="text-gray-600 mb-6">
              1,000
              <span>
                <img
                  src={BidPoint}
                  alt="BidPoint"
                  className="w-5 h-5 ml-1 inline"
                />
              </span>{' '}
              Bid Points = 500
              <span>
                <img
                  src={BidCredit}
                  alt="BidCredit"
                  className="w-5 h-5 ml-1 inline"
                />
              </span>{' '}
              Bid Credits
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="flex gap-0">
                  <span className="px-4 py-3 border-2 border-[#9b1e3744] rounded-l-lg">
                    <img src={BidPoint} alt="BidPoint" className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    className="px-4 py-3 outline-[#9b1e3744] rounded-r-lg"
                    placeholder="Enter amount >= 1000"
                    // value={redeemPoint}
                    onChange={(e) => setRedeemPoint(e.target.value)}
                  />
                </span>
                <button
                  onClick={() => {
                    handleRedeem();
                  }}
                  className="px-4 py-3 bg-[#9f3247] text-white rounded-lg hover:bg-[#9b1e37dc]"
                >
                  {redeemLoading ? (
                    <RefreshCw
                      className={`w-4 h-4 ${
                        redeemLoading ? 'animate-spin' : ''
                      }`}
                    />
                  ) : (
                    'Redeem Now'
                  )}
                </button>
              </div>
              <div>
                {redeemPoint > 0 &&
                  rewards.reduce((total, reward) => total + reward.amount, 0) <
                    1000 && (
                    <p className="text-red-400 text-sm">
                      You need 1,000+ BidPoints to redeem. Available points:{' '}
                      {BidPointElem}
                      {rewards.reduce(
                        (total, reward) => total + reward.amount,
                        0
                      )}
                    </p>
                  )}
                {redeemPoint > 0 &&
                  rewards.reduce((total, reward) => total + reward.amount, 0) <
                    redeemPoint && (
                    <p className="text-red-400 text-sm">
                      Insufficient BidPoints. Available points: {BidPointElem}
                      {rewards.reduce(
                        (total, reward) => total + reward.amount,
                        0
                      )}
                    </p>
                  )}

                {redeemPoint > 0 &&
                  rewards.reduce((total, reward) => total + reward.amount, 0) >=
                    1000 && (
                    <p className="text-emerald-400 text-sm">
                      You will be credited with {BidCreditElem}
                      {redeemPoint * 0.5}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardHistory;
