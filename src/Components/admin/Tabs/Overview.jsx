import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Wrench,
  ShoppingCart,
  Eye,
  Briefcase,
  IdCard,
  Vote,
  TrafficCone,
  HatGlasses,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';
import useAuthStore from '../../../Store/AuthStore';
import Fetch from '../../../utils/Fetch';
import { current } from '../../../utils';
import { useNavigate } from 'react-router-dom';

const Overview = () => {
  const navigate = useNavigate();
  const identity = useAuthStore((state) => state.data);
  const [stats, setStats] = useState({
    visitors: null,
    nuVisitors: null,
    users: null,
    auctions: null,
    bids: null,
    categories: null,
  });
  const [loading, setLoading] = useState({
    visitors: false,
    users: false,
    auctions: false,
    bids: false,
    categories: false,
  });
  const [error, setError] = useState('');

  const [trafficSectionToggle, setTrafficSectionToggle] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(true);

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [dateRangeStats, setDateRangeStats] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const handleVisitorDateQuery = async () => {
    setLoading((prev) => ({ ...prev, visitors: true }));
    try {
      const response = await fetch(
        `https://news-letter-middle-app.vercel.app/api/tracking/visitors/count/range?start=${dateRange.start}&end=${dateRange.end}`,
        {
          method: 'GET',
          headers: { 'x-clientname': 'BIDDIUS' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch visitors count');
      const data = await response.json();
      setDateRangeStats(data);
    } catch (err) {
      console.error('Error fetching visitors count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading((prev) => ({ ...prev, visitors: false }));
    }
  };

  const fetchVisitorsCount = async () => {
    setLoading((prev) => ({ ...prev, visitors: true }));
    try {
      const response = await fetch(
        `https://news-letter-middle-app.vercel.app/api/tracking/visitors/count`,
        {
          method: 'GET',
          headers: { 'x-clientname': 'BIDDIUS' },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch visitors count');
      const data = await response.json();
      setStats((prev) => ({
        ...prev,
        visitors: data.count || 0,
        nuVisitors: data.nonunique_count || 0,
      }));
    } catch (err) {
      console.error('Error fetching visitors count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading((prev) => ({ ...prev, visitors: false }));
    }
  };

  const fetchUsersCount = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const { data, error, success } = await Fetch({
        url: current + 'users/stats/count',
        method: 'GET',
      });
      if (!success) throw new Error(error || 'Failed to fetch users count');
      setStats((prev) => ({ ...prev, users: data?.data?.user_count || 0 }));
    } catch (err) {
      console.error('Error fetching users count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  const fetchAuctionCount = async () => {
    setLoading((prev) => ({ ...prev, auctions: true }));
    try {
      const { data, error, success } = await Fetch({
        url: current + 'auctions/stats/count',
      });
      if (!success) throw new Error(error || 'Failed to fetch auctions count');
      setStats((prev) => ({ ...prev, auctions: data?.data?.total || 0 }));
    } catch (err) {
      console.error('Error fetching auctions count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading((prev) => ({ ...prev, auctions: false }));
    }
  };

  const fetchBidsCount = async () => {
    setLoading((prev) => ({ ...prev, bids: true }));
    try {
      const { data, error, success } = await Fetch({
        url: current + 'auctions/bids/stats/count',
      });
      if (!success) throw new Error(error || 'Failed to fetch bids count');
      setStats((prev) => ({ ...prev, bids: data?.data?.result || 0 }));
    } catch (err) {
      console.error('Error fetching bids count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading((prev) => ({ ...prev, bids: false }));
    }
  };

  const fetchCatCount = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const { data, error, success } = await Fetch({
        url: current + 'categories/stats/count',
      });
      if (!success) throw new Error(error || 'Failed to fetch Category count');
      setStats((prev) => ({
        ...prev,
        categories: data?.data?.categories || 0,
      }));
    } catch (err) {
      console.error('Error fetching Category count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-red-100 text-red-800',
      client: 'bg-blue-100 text-blue-800',
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          roleStyles[role] || roleStyles.client
        }`}
      >
        {role}
      </span>
    );
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    loading,
    color = 'blue',
    onClick = null,
  }) => {
    const colorStyles = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    };

    return (
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
              {title}
            </p>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                <span className="ml-2 text-gray-500 text-sm">Loading...</span>
              </div>
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {value !== null ? value.toLocaleString() : '--'}
              </p>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-lg border flex-shrink-0 ml-2 ${colorStyles[color]} ${
              loading ? 'hidden' : ''
            }`}
          >
            <Icon size={20} />
          </div>
        </div>
      </div>
    );
  };

  StatCard.propTypes = {
    title: PropTypes.string,
    value: PropTypes.number,
    icon: PropTypes.any,
    loading: PropTypes.bool,
    color: PropTypes.string,
    onClick: PropTypes.func,
  };

  useEffect(() => {
    fetchVisitorsCount();
    fetchUsersCount();
    fetchAuctionCount();
    fetchBidsCount();
    fetchCatCount();
  }, []);

  if (!identity) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with Biddius.
          </p>
        </div>

        {/* Admin Profile — collapsible on mobile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Card header / toggle */}
          <button
            className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left"
            onClick={() => setProfileExpanded((v) => !v)}
          >
            <h2 className="text-base sm:text-xl font-semibold text-gray-900">
              Admin Profile
            </h2>
            {profileExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
          </button>

          {profileExpanded && (
            <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
              {/* Name + role */}
              <div className="flex flex-wrap items-center gap-3 mt-4 mb-4">
                <User className="text-gray-400 flex-shrink-0" size={22} />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                    {`${identity.first_name} ${identity.last_name}`}
                  </h3>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="ml-auto sm:ml-0">
                  {getRoleBadge(identity.role)}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center text-gray-600 min-w-0">
                  <Mail className="mr-2 flex-shrink-0" size={15} />
                  <span className="font-medium text-sm whitespace-nowrap">
                    Email:
                  </span>
                  <span className="ml-1 text-sm truncate">
                    {identity.email}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 flex-shrink-0" size={15} />
                  <span className="font-medium text-sm whitespace-nowrap">
                    Phone:
                  </span>
                  <span className="ml-1 text-sm">
                    {identity.phone_number || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 min-w-0">
                  <Calendar className="mr-2 flex-shrink-0" size={15} />
                  <span className="font-medium text-sm whitespace-nowrap">
                    Created:
                  </span>
                  <span className="ml-1 text-sm truncate">
                    {formatDate(identity.created_at)}
                  </span>
                </div>

                <div className="flex items-start text-gray-600 min-w-0">
                  <IdCard className="mr-2 flex-shrink-0 mt-0.5" size={15} />
                  <span className="font-medium text-sm whitespace-nowrap">
                    ID:
                  </span>
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs ml-1 break-all">
                    {identity.id}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {formatDate(identity.updated_at)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div>
          <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-4">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <StatCard
              title="Visitors"
              value={stats.visitors}
              icon={Eye}
              loading={loading.visitors}
              color="blue"
              onClick={() => setTrafficSectionToggle(!trafficSectionToggle)}
            />
            <StatCard
              title="Users"
              value={stats.users}
              icon={Users}
              loading={loading.users}
              color="green"
              onClick={() =>
                navigate('/admin/dashboard', { state: { tab: 'Users' } })
              }
            />
            <StatCard
              title="Auctions"
              value={stats.auctions}
              icon={Wrench}
              loading={loading.auctions}
              color="purple"
            />
            <StatCard
              title="Bids"
              value={stats.bids}
              icon={Vote}
              loading={loading.bids}
              color="indigo"
            />
            <StatCard
              title="Categories"
              value={stats.categories}
              icon={Briefcase}
              loading={loading.categories}
              color="orange"
            />
          </div>
        </div>

        {/* Traffic Section */}
        {trafficSectionToggle && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
                <TrafficCone
                  size={18}
                  className="text-orange-400 flex-shrink-0"
                />
                Traffic &amp; Visitors
              </h3>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Date range inputs — stack on mobile */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  From:
                </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  To:
                </label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full sm:w-auto"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
              <button
                onClick={handleVisitorDateQuery}
                disabled={loading.visitors}
                className="bg-[#9f3248] text-white px-4 py-1.5 rounded-md text-sm shadow-sm hover:bg-[#802738] disabled:opacity-60 transition-colors"
              >
                {loading.visitors ? 'Loading...' : 'Apply'}
              </button>
            </div>

            {/* Default Stats */}
            <div className="mb-6 space-y-2">
              <h4 className="text-sm font-medium text-gray-800">
                Default Results
              </h4>
              <div className="flex items-center text-gray-600">
                <HatGlasses className="mr-2 flex-shrink-0" size={15} />
                <span className="font-medium text-sm">Unique Visitors:</span>
                <span className="ml-1 text-sm">
                  {loading.visitors
                    ? 'Loading...'
                    : stats.visitors !== null
                      ? stats.visitors.toLocaleString()
                      : '--'}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <TrafficCone className="mr-2 flex-shrink-0" size={15} />
                <span className="font-medium text-sm">
                  Non-Unique Visitors:
                </span>
                <span className="ml-1 text-sm">
                  {loading.visitors
                    ? 'Loading...'
                    : stats.nuVisitors !== null
                      ? stats.nuVisitors.toLocaleString()
                      : '--'}
                </span>
              </div>
            </div>

            {/* Date range results */}
            {dateRangeStats && (
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  Results: {dateRange.start} → {dateRange.end}
                </h4>

                <button
                  onClick={() => setShowChart((prev) => !prev)}
                  className="mb-4 bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md text-sm hover:bg-gray-300 transition-colors"
                >
                  {showChart ? 'Show Table' : 'Show Chart'}
                </button>

                {/* Table */}
                {!showChart && (
                  <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left border-b font-medium text-gray-700">
                            Date
                          </th>
                          <th className="px-3 py-2 text-left border-b font-medium text-gray-700">
                            Unique
                          </th>
                          <th className="px-3 py-2 text-left border-b font-medium text-gray-700">
                            Non-Unique
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(dateRangeStats.unique).map((date) => (
                          <tr key={date} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border-b text-gray-600">
                              {date}
                            </td>
                            <td className="px-3 py-2 border-b">
                              {dateRangeStats.unique[date]}
                            </td>
                            <td className="px-3 py-2 border-b">
                              {dateRangeStats.non_unique[date]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Chart */}
                {showChart && (
                  <div className="w-full h-56 sm:h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={Object.keys(dateRangeStats.unique).map(
                          (date) => ({
                            date,
                            unique: dateRangeStats.unique[date],
                            non_unique: dateRangeStats.non_unique[date],
                          })
                        )}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="unique"
                          stroke="#2563eb"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="non_unique"
                          stroke="#f97316"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Totals */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-700 pt-3 border-t border-gray-100">
                  <div>
                    <span className="font-medium">Total Unique:</span>{' '}
                    {dateRangeStats.total_unique_count.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Total Non-Unique:</span>{' '}
                    {dateRangeStats.total_nonunique_count.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button className="p-3 sm:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="text-blue-600 mb-2" size={18} />
              <h4 className="font-medium text-gray-900 text-sm">
                Manage Users
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                View and edit User profiles
              </p>
            </button>

            <button className="p-3 sm:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Wrench className="text-green-600 mb-2" size={18} />
              <h4 className="font-medium text-gray-900 text-sm">
                Manage Auctions
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                View and edit Auction details
              </p>
            </button>

            <button className="p-3 sm:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="text-purple-600 mb-2" size={18} />
              <h4 className="font-medium text-gray-900 text-sm">
                Manage Categories
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                Create and Edit Categories
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
