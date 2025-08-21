import { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';

const CampaignSubs = () => {
  // App Client States
  const [clientDetails, setClientDetails] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState('');
  const [loadingClient, setLoadingClient] = useState(false);
  const [renewingToken, setRenewingToken] = useState(false);

  // Subscribers States
  const [subscribers, setSubscribers] = useState([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const subscribersPerPage = 20;

  // Export States
  const [showExportModal, setShowExportModal] = useState(false);
  const [emailExtension, setEmailExtension] = useState('');
  const [activeCampaignsOnly, setActiveCampaignsOnly] = useState(true);
  const [campaignType, setCampaignType] = useState('');
  const [useStream, setUseStream] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  const [error, setError] = useState('');

  const campaignTypes = [
    'updates',
    'marketing',
    'announcements',
    'newsletters',
    'seasonal',
  ];

  // Fetch app client details
  const fetchClientDetails = async () => {
    setLoadingClient(true);
    setError('');
    try {
      const baseUrl = 'https://news-letter-middle-app.vercel.app';
      const res = await fetch(`${baseUrl}/api/client`, {
        headers: {
          'x-clientname': 'BIDDIUS',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch client details');
      const data = await res.json();
      setClientDetails(data);

      if (data.created_at) {
        const createdDate = new Date(data.created_at);
        const expiryDate = new Date(createdDate);
        expiryDate.setDate(createdDate.getDate() + 365);
        setTokenExpiry(
          expiryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingClient(false);
    }
  };

  // Renew token
  const handleRenewToken = async () => {
    setRenewingToken(true);
    setError('');
    try {
      const baseUrl = 'https://news-letter-middle-app.vercel.app';
      const res = await fetch(`${baseUrl}/api/renew-token`, {
        method: 'POST',
        headers: {
          'x-clientname': 'BIDDIUS',
        },
      });
      if (!res.ok) throw new Error('Failed to renew token');
      alert('Token renewed successfully!');
      await fetchClientDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setRenewingToken(false);
    }
  };

  // Fetch subscribers
  const fetchSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    setError('');
    try {
      const baseUrl = 'https://news-letter-middle-app.vercel.app';
      const res = await fetch(
        `${baseUrl}/api/subscribers?page=${currentPage}&limit=${subscribersPerPage}`,
        {
          headers: {
            'x-clientname': 'BIDDIUS',
          },
        },
      );
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      setSubscribers(data.items || []);
      setTotalSubscribers(data.total || 0);
      setTotalPages(data.pages || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubscribers(false);
    }
  }, [currentPage, subscribersPerPage]);

  useEffect(() => {
    fetchClientDetails();
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    fetchSubscribers();
  }, [currentPage, fetchSubscribers]);

  // Export CSV
  const handleExportCSV = async () => {
    setExportingCSV(true);
    setError('');
    try {
      const params = new URLSearchParams({
        campaignType,
        emailExtension,
        activeOnly: activeCampaignsOnly,
        useStream,
      });
      const baseUrl = 'https://news-letter-middle-app.vercel.app';
      const res = await fetch(`${baseUrl}/api/export-csv?${params}`, {
        headers: {
          'x-clientname': 'BIDDIUS',
        },
      });
      if (!res.ok) throw new Error('Failed to export CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subscribers_export_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExportingCSV(false);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Campaign Subscribers</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded">
          {error}
        </div>
      )}

      {/* App Client Details Section */}
      <section className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          App Client Details
        </h3>

        {loadingClient ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading client details...</p>
          </div>
        ) : clientDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Client Name
                </label>
                <p className="text-gray-900 font-semibold">
                  {clientDetails.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Website
                </label>
                <a
                  href={clientDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {clientDetails.website}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-900">{clientDetails.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Collection Name
                </label>
                <p className="text-gray-900 font-mono text-sm">
                  {clientDetails.collection_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Created At
                </label>
                <p className="text-gray-900">
                  {formatDate(clientDetails.created_at)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Token Expiry Date
                </label>
                <p className="text-orange-600 font-semibold">{tokenExpiry}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Failed to load client details</p>
        )}

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleRenewToken}
            disabled={renewingToken}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {renewingToken ? 'Renewing Token...' : 'Renew Token'}
          </button>
        </div>
      </section>

      {/* Subscribers Section */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Subscribers List ({totalSubscribers})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              Export CSV
            </button>
            <button
              onClick={fetchSubscribers}
              disabled={loadingSubscribers}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              {loadingSubscribers ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loadingSubscribers ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading subscribers...</p>
          </div>
        ) : (
          <>
            {subscribers.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                No subscribers found
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 border-b">
                          ID
                        </th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 border-b">
                          Email
                        </th>
                        <th className="p-2 text-center text-xs font-medium text-gray-700 border-b">
                          Updates
                        </th>
                        <th className="p-2 text-center text-xs font-medium text-gray-700 border-b">
                          Marketing
                        </th>
                        <th className="p-2 text-center text-xs font-medium text-gray-700 border-b">
                          Announcements
                        </th>
                        <th className="p-2 text-center text-xs font-medium text-gray-700 border-b">
                          Newsletters
                        </th>
                        <th className="p-2 text-center text-xs font-medium text-gray-700 border-b">
                          Seasonal
                        </th>
                        <th className="p-2 text-left text-sm font-medium text-gray-700 border-b">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber, index) => (
                        <tr
                          key={subscriber._id}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }
                        >
                          <td className="p-2 text-sm text-gray-900 border-b">
                            <span className="font-mono text-xs">
                              {subscriber._id}
                            </span>
                          </td>
                          <td className="p-2 text-sm text-gray-900 border-b overflow-ellipsis overflow-hidden max-w-xs">
                            {subscriber.email}
                          </td>
                          <td className="p-2 text-center border-b">
                            <span
                              className={`inline-block w-3 h-3 rounded-full`}
                            >
                              {subscriber.campaigns?.updates ? (
                                <Check className="text-green-500 w-4 h-4" />
                              ) : (
                                <X className="text-red-500 w-4 h-4" />
                              )}
                            </span>
                          </td>
                          <td className="p-2 text-center border-b">
                            <span
                              className={`inline-block w-3 h-3 rounded-full`}
                            >
                              {subscriber.campaigns?.marketing ? (
                                <Check className="text-green-500 w-4 h-4" />
                              ) : (
                                <X className="text-red-500 w-4 h-4" />
                              )}
                            </span>
                          </td>
                          <td className="p-2 text-center border-b">
                            <span
                              className={`inline-block w-3 h-3 rounded-full`}
                            >
                              {subscriber.campaigns?.announcements ? (
                                <Check className="text-green-500 w-4 h-4" />
                              ) : (
                                <X className="text-red-500 w-4 h-4" />
                              )}
                            </span>
                          </td>
                          <td className="p-2 text-center border-b">
                            <span
                              className={`inline-block w-3 h-3 rounded-full`}
                            >
                              {subscriber.campaigns?.newsletters ? (
                                <Check className="text-green-500 w-4 h-4" />
                              ) : (
                                <X className="text-red-500 w-4 h-4" />
                              )}
                            </span>
                          </td>
                          <td className="p-2 text-center border-b">
                            <span
                              className={`inline-block w-3 h-3 rounded-full`}
                            >
                              {subscriber.campaigns?.seasonal ? (
                                <Check className="text-green-500 w-4 h-4" />
                              ) : (
                                <X className="text-red-500 w-4 h-4" />
                              )}
                            </span>
                          </td>
                          <td className="p-2 text-xs text-gray-900 border-b">
                            {formatDate(subscriber.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (page > totalPages) return null;
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2">...</span>
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="px-3 py-1 rounded border hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {/* Export CSV Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Export CSV Options</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Extension Filter
                </label>
                <input
                  type="text"
                  value={emailExtension}
                  onChange={(e) => setEmailExtension(e.target.value)}
                  placeholder="e.g., @gmail.com"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={activeCampaignsOnly}
                    onChange={(e) => setActiveCampaignsOnly(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Active campaigns only
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type
                </label>
                <select
                  value={campaignType}
                  onChange={(e) => setCampaignType(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All campaigns</option>
                  {campaignTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useStream}
                    onChange={(e) => setUseStream(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Use stream export
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleExportCSV}
                disabled={exportingCSV}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {exportingCSV ? 'Exporting...' : 'Export'}
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSubs;
