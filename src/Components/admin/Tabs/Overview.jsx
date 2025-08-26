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
} from 'lucide-react';
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

  const fetchVisitorsCount = async () => {
    setLoading((prev) => ({ ...prev, visitors: true }));
    try {
      const response = await fetch(
        `https://news-letter-middle-app.vercel.app/api/tracking/visitors/count`,
        {
          method: 'GET',
          headers: {
            'x-clientname': 'BIDDIUS',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch visitors count');
      }

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
      if (!success) {
        throw new Error(error || 'Failed to fetch users count');
      }
      setStats((prev) => ({
        ...prev,
        users: data?.data?.user_count || 0,
      }));
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
      if (!success) {
        throw new Error(error || 'Failed to fetch auctions count');
      }
      setStats((prev) => ({
        ...prev,
        auctions: data?.data?.total || 0,
      }));
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
      if (!success) {
        throw new Error(error || 'Failed to fetch bids count');
      }
      setStats((prev) => ({
        ...prev,
        bids: data?.data?.result || 0,
      }));
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
      if (!success) {
        throw new Error(error || 'Failed to fetch Category count');
      }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      admin: 'bg-red-100 text-red-800',
      client: 'bg-blue-100 text-blue-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {value !== null ? value.toLocaleString() : '--'}
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-lg border ${colorStyles[color]} ${
              loading && 'hidden'
            }`}
          >
            <Icon size={24} alt={Icon} />
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
    // Fetch visitors count
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with Biddius.
          </p>
        </div>

        {/* Admin Identity Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Admin Profile
          </h2>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <User className="text-gray-400 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {`${identity.first_name} ${identity.last_name}`}
                  </h3>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
                <div className="ml-4">{getRoleBadge(identity.role)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2" size={16} />
                  <span className="font-medium">Email:</span>
                  <span className="ml-1 truncate text-sm">
                    {identity.email}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2" size={16} />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-1 text-sm">
                    {identity.phone_number || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={16} />
                  <span className="font-medium">Created:</span>
                  <span className="ml-1 truncate text-sm">
                    {formatDate(identity.created_at)}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <IdCard className="mr-2" size={16} />
                  <span className="font-medium mr-2">ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {identity.id}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: {formatDate(identity.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Platform Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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

        {/* Traffic section */}
        {trafficSectionToggle && (
          <div className="bg-white rounded-lg mb-8 shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Traffic and Visitors count
            </h3>
            <div className="flex flex-col">
              <div className="flex items-center text-gray-600 mb-2">
                <HatGlasses className="mr-2" size={16} />
                <span className="font-medium">Unique Visitors:</span>
                <span className="ml-1 text-sm">
                  {loading.visitors
                    ? 'Loading...'
                    : stats.visitors !== null
                    ? stats.visitors.toLocaleString()
                    : '--'}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <TrafficCone className="mr-2" size={16} />
                <span className="font-medium">Non-Unique Visitors:</span>
                <span className="ml-1 text-sm">
                  {loading.visitors
                    ? 'Loading...'
                    : stats.nuVisitors !== null
                    ? stats.nuVisitors.toLocaleString()
                    : '--'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions or Recent Activity could go here */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="text-blue-600 mb-2" size={20} />
              <h4 className="font-medium text-gray-900">Manage Users</h4>
              <p className="text-sm text-gray-600">
                View and edit User profiles
              </p>
            </button>

            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Wrench className="text-green-600 mb-2" size={20} />
              <h4 className="font-medium text-gray-900">Manage Auctions</h4>
              <p className="text-sm text-gray-600">
                View and edit Auction details
              </p>
            </button>

            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="text-purple-600 mb-2" size={20} />
              <h4 className="font-medium text-gray-900">Manage Categories</h4>
              <p className="text-sm text-gray-600">
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
