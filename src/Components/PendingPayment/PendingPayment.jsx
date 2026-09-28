import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  X,
} from 'lucide-react';
import { current } from '../../utils';
import Fetch from '../../utils/Fetch';
import useAuthStore from '../../Store/AuthStore';

const PendingPayment = () => {
  const token = useAuthStore((state) => state.token);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const [verifying, setVerifying] = useState(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [filters, setFilters] = useState({
    status: '',
    from_id: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const buildQueryString = useCallback(
    (
      selectedPage = page,
      selectedPerPage = perPage,
      selectedFilters = filters
    ) => {
      const params = new URLSearchParams();
      params.append('page', selectedPage.toString());
      params.append('per_page', selectedPerPage.toString());

      if (selectedFilters.status) {
        params.append('status', selectedFilters.status);
      }
      if (selectedFilters.from_id) {
        params.append('from_id', selectedFilters.from_id);
      }

      return params.toString();
    },
    [page, perPage, filters]
  );

  const fetchPayments = useCallback(
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
          url: `${current}auctions/get/payments?${queryString}`,
          token,
        });

        if (error) {
          throw new Error(error);
        }
        // console.log(data);
        setPayments(resp?.data);
        setTotalPages(resp?.pages);
        setCurrentPage(resp?.page_number);
        setTotalTransactions(resp?.total);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    },
    [page, perPage, filters, buildQueryString, token]
  );

  //   const verifyTransactionStatus = async (transactionId, referenceId) => {
  //     setVerifying((prev) => new Set([...prev, transactionId]));

  //     try {
  //       const { data: resp, error } = await Fetch({
  //         method: 'POST',
  //         url: `${current}users/transactions/verify`,
  //         requestData: { reference_id: referenceId },
  //         token,
  //       });
  //       if (error) {
  //         throw new Error(error);
  //       }
  //       console.log('Transaction verified:', resp);
  //     } catch (error) {
  //       console.error('Error verifying transaction:', error);
  //     } finally {
  //       setVerifying((prev) => {
  //         const newSet = new Set(prev);
  //         newSet.delete(transactionId);
  //         return newSet;
  //       });
  //       setTimeout(() => {
  //         fetchPayments();
  //       }, 2000);
  //     }
  //   };

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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Get status icon and styling
  const getStatusInfo = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          className: 'text-green-600 bg-green-100',
          textColor: 'text-green-800',
        };
      case 'REFUNDED':
        return {
          icon: XCircle,
          className: 'text-red-600 bg-red-100',
          textColor: 'text-red-800',
        };
      case 'INSPECTING':
        return {
          icon: Clock,
          className: 'text-yellow-600 bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      default:
        return {
          icon: AlertCircle,
          className: 'text-gray-600 bg-gray-100',
          textColor: 'text-gray-800',
        };
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
    fetchPayments(1, perPage, newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = { amount: '', status: '', transaction_type: '' };
    setFilters(emptyFilters);
    setPage(1);
    fetchPayments(1, perPage, emptyFilters);
  };

  // Count active filters
  useEffect(() => {
    const count = Object.values(filters).filter((value) => value !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Auto-verify pending transactions on load
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pending Payments
              </h1>
              <p className="text-gray-600 mt-1">
                Track all auctions with pending payments
              </p>
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
                onClick={() => fetchPayments()}
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

        {/* Filters Panel */}
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
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-20 outline-none"
                  style={{ focusRingColor: '#9f3247' }}
                >
                  <option value="">All Statuses</option>
                  <option value="INSPECTING">inspecting</option>
                  <option value="COMPLETED">completed</option>
                  <option value="PENDING">pending</option>
                  <option value="REFUNDED">refunded</option>
                  <option value="REFUNDIND">refunding</option>
                </select>
              </div>

              {/* Transaction Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={filters.transaction_type}
                  onChange={(e) =>
                    handleFilterChange('transaction_type', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-20 outline-none"
                  style={{ focusRingColor: '#9f3247' }}
                >
                  <option value="">All Types</option>
                  <option value="FUNDING">Funding</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                  <option value="CREDIT">Credit</option>
                  <option value="DEBIT">Debit</option>
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
                  {filters.status && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Status: {filters.status}
                      <button
                        onClick={() => handleFilterChange('status', '')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.from_id && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Type: {filters.from_id}
                      <button
                        onClick={() => handleFilterChange('from_id', '')}
                        className="ml-2 text-purple-600 hover:text-purple-800"
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

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3 text-gray-600">Loading Auctions...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#9f3247' }}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Reference ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payments, index) => {
                      const statusInfo = getStatusInfo(payments.status);
                      const StatusIcon = statusInfo.icon;
                      //   const isVerifying = verifying.has(payments.id);

                      return (
                        <tr
                          key={payments.id}
                          className={`hover:bg-gray-50 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payments.reference_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {payments.from_id.toLowerCase()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(payments.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              <span className={statusInfo.textColor}>
                                {payments.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {payments.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(payments.created_at)}
                            </div>
                            {payments.updated_at && (
                              <div className="text-xs text-gray-500">
                                Updated: {formatDate(payments.updated_at)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payments.status === 'PENDING' && (
                              <button
                                onClick={() => {}}
                                disabled={false}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white hover:opacity-90 disabled:opacity-50"
                                style={{ backgroundColor: '#9f3247' }}
                              >
                                <>
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Verify
                                </>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-700">
                        Showing page {currentPage} of {totalPages}
                      </div>
                      <div className="text-sm text-gray-500">
                        ({payments.length} of {totalTransactions} total
                        paymentss)
                      </div>
                    </div>

                    {/* Per Page */}
                    <div>
                      <label
                        htmlFor="perPage"
                        className="text-sm text-gray-700 mr-2"
                      >
                        Transactions per page:
                      </label>
                      <select
                        id="perPage"
                        value={perPage}
                        onChange={(e) => {
                          setPerPage(Number(e.target.value));
                          fetchPayments(1, e.target.value, filters); // Reset to first page
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
                        onClick={() => fetchPayments(1, perPage, filters)}
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        First
                      </button>

                      {/* Previous */}
                      <button
                        onClick={() =>
                          fetchPayments(currentPage - 1, perPage, filters)
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
                                  fetchPayments(pageNum, perPage, filters);
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
                          fetchPayments(currentPage + 1, perPage, filters)
                        }
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                      >
                        Next
                      </button>

                      {/* Last Page */}
                      <button
                        onClick={() =>
                          fetchPayments(totalPages, perPage, filters)
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {payments.length}
                    </div>
                    <div className="text-sm text-gray-600">Current Page</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {payments.filter((t) => t.status === 'COMPLETED').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-yellow-600">
                      {payments.filter((t) => t.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">
                      {payments.filter((t) => t.status === 'FAILED').length}
                    </div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {payments.filter((t) => t.status === 'REVERSED').length}
                    </div>
                    <div className="text-sm text-gray-600">Reversed</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingPayment;
