import BreadCrumb from '../../Components/Breadcrumbs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Activity,
  Settings,
  LogOut,
  Edit,
  CreditCard,
  Wallet,
  Download,
  DollarSign,
  Star,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp,
  ChartArea,
} from 'lucide-react';
import Loader from '../../assets/loader2';
import useAuthStore from '../../Store/AuthStore';
import { ctaContext } from '../../Store/ContextStore';
import { capitalize, currencyFormat, charLimit, current } from '../../utils';
import Avatar from './Avatar';
import PropTypes from 'prop-types';
import MainModal from '../../Components/modals/MainModal';
import ReferralView from '../../Components/modals/ReferralView';
import FundingWallet from '../../Components/modals/FundingWallet';
import Withdrawal from '../../Components/modals/Withdrawal';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const offCta = ctaContext((state) => state.turnOff);
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  // Modals
  const [modalIsOpen, setModalIsOpen] = useState({ state: false, type: '' });

  useEffect(() => {
    setLoading(true);
    offCta();
    sessionStorage.removeItem('newAccount');
    sessionStorage.removeItem('_user');

    const getUser = async () => {
      const endpoint = `${current}users/profile`;
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          if (data === null) {
            setLoading(false);
            navigate('/sign-in');
            return;
          }
          setTimeout(() => {
            setUser(data);
            setDisplayName(
              data.username ? `@${capitalize(data.username)}` : data.email,
            );
            setAuctions(data.auctions);
            setBids(data.bids);
            setRating(data.rating);
            setLoading(false);
            sessionStorage.setItem('_user', JSON.stringify(data));
          }, 1000);
        } else {
          const error = await response.json();
          console.error(error);
          navigate('/sign-in');
        }
      } catch (err) {
        console.error(err);
        navigate('/sign-in');
      }
    };

    const cachedData = sessionStorage.getItem('_user');
    if (!cachedData) {
      getUser();
    } else {
      const data = JSON.parse(cachedData);
      setUser(data);
      setDisplayName(
        data.username ? `@${capitalize(data.username)}` : data.email,
      );
      setAuctions(data.auctions);
      setBids(data.bids);
      setRating(data.rating);
      setLoading(false);
    }
  }, [navigate, offCta]);

  const logout = async () => {
    setLoading(true);
    let endpoint = `${current}users/logout`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        setTimeout(() => {
          setLoading(false);
          logoutUser();
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          sessionStorage.removeItem('_user');
          navigate('/');
        }, 500);
      } else {
        let data = await response.json();
        setLoading(false);
        console.error(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const viewAuction = async (id) => {
    navigate(`/products/${id}`);
  };

  const AddProduct = () => {
    navigate('/add-product');
  };

  const updateProfile = () => {
    navigate('/update-profile');
  };

  const updateAddress = () => {
    navigate('/update-address');
  };

  const updateBank = () => {
    navigate('/bank-account');
  };

  const viewAuctions = () => {
    navigate('/products');
  };

  const productDetails = (id) => {
    navigate(`/product-details/${id}`);
  };

  const StarRating = ({ rating }) => (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            className={`${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } w-5 h-5`}
          />
        ))}
    </>
  );

  StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
  };

  const CustomButton = ({
    icon: Icon,
    label,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
  }) => {
    const baseClasses =
      'flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: `bg-[#9f3247] text-white hover:bg-[#7a2837] focus:ring-[#9f3247] border border-[#9f3247]`,
      secondary: `bg-[rgba(159,50,71,0.1)] text-[#9f3247] hover:bg-[rgba(159,50,71,0.15)] border border-[rgba(159,50,71,0.3)] focus:ring-[#9f3247]`,
      outline: `bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 focus:ring-gray-500`,
      ghost: `bg-transparent text-white hover:bg-white/20 border border-white/30 focus:ring-white`,
      danger: `bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 focus:ring-red-500`,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${
          sizes[size]
        } ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </button>
    );
  };

  CustomButton.propTypes = {
    icon: PropTypes.elementType,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf([
      'primary',
      'secondary',
      'outline',
      'ghost',
      'danger',
    ]),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
  };

  const handleCloseModal = () => {
    setModalIsOpen({ state: false, type: '' });
  };

  const showModal = (type) => {
    setModalIsOpen({ state: true, type: type });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Modals */}
        {modalIsOpen.state && modalIsOpen.type === 'referral' && (
          <MainModal header="Referrals" close={handleCloseModal}>
            <ReferralView />
          </MainModal>
        )}
        {modalIsOpen.state && modalIsOpen.type === 'funding' && (
          <MainModal header="Fund Wallet" close={handleCloseModal}>
            <FundingWallet />
          </MainModal>
        )}
        {modalIsOpen.state && modalIsOpen.type === 'withdraw' && (
          <MainModal header="Withdraw" close={handleCloseModal}>
            <Withdrawal />
          </MainModal>
        )}

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 bg-white shadow-lg border-r border-gray-200 lg:min-h-screen">
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar
                    imageUrl={user?.image_link ? user?.image_link?.link : null}
                    username={user.username ? user.username : user.email}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {charLimit(displayName, 20)}
                </h3>
                {user.username && (
                  <p className="text-sm text-gray-500 mb-3">
                    {charLimit(user.email, 20)}
                  </p>
                )}
                <div className="flex items-center gap-1 mb-4">
                  <StarRating rating={rating} />
                  <span className="text-sm text-gray-600 ml-2">
                    ({rating.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-b border-gray-200">
              <button
                onClick={() => setQuickActionsExpanded(!quickActionsExpanded)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 lg:cursor-default lg:hover:bg-transparent transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="lg:hidden">
                  {quickActionsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              <div
                className={`px-6 pb-6 space-y-2 transition-all duration-300 ease-in-out lg:block ${
                  quickActionsExpanded ? 'block' : 'hidden'
                }`}
              >
                <CustomButton
                  icon={Plus}
                  className="w-full justify-start"
                  label="Create New Auction"
                  onClick={() => AddProduct()}
                  variant="secondary"
                />
                <CustomButton
                  icon={Activity}
                  className="w-full justify-start"
                  label="View All Auctions"
                  onClick={() => viewAuctions()}
                  variant="outline"
                />
                <CustomButton
                  icon={Wallet}
                  className="w-full justify-start"
                  label="Wallet History"
                  onClick={() => {}}
                  variant="outline"
                />
                {user?.role === 'admin' && (
                  <CustomButton
                    icon={ChartArea}
                    className="w-full justify-start"
                    label="Admin Dashboard"
                    onClick={() => navigate('/admin/dashboard')}
                    variant="outline"
                  />
                )}
              </div>
            </div>

            {/* Settings & Preferences */}
            <div>
              <button
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 lg:cursor-default lg:hover:bg-transparent transition-colors"
              >
                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Settings
                </h4>
                <div className="lg:hidden">
                  {settingsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>

              <div
                className={`px-6 pb-6 space-y-2 transition-all duration-300 ease-in-out lg:block ${
                  settingsExpanded ? 'block' : 'hidden'
                }`}
              >
                <CustomButton
                  icon={Settings}
                  className="w-full justify-start"
                  label="Referral Program"
                  onClick={() => showModal('referral')}
                  variant="outline"
                />
                <CustomButton
                  icon={LogOut}
                  className="w-full justify-start"
                  label="Logout"
                  onClick={() => logout()}
                  variant="danger"
                />
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 lg:overflow-auto">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              <div className="mb-3">
                <BreadCrumb />
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-[80dvh]">
                  <Loader otherStyles={'!w-30 !h-30'} />
                </div>
              ) : (
                <>
                  {/* Welcome Section */}
                  <div className="mb-8">
                    <div
                      className="rounded-xl p-6 text-white mb-6"
                      style={{
                        background:
                          'linear-gradient(135deg, #9f3247 0%, #7a2837 100%)',
                      }}
                    >
                      <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                        Welcome back, {charLimit(displayName, 20)}
                      </h1>
                      <div className="flex flex-row flex-wrap gap-3">
                        <CustomButton
                          icon={CreditCard}
                          label="Account Details"
                          onClick={() => updateBank()}
                          variant="ghost"
                        />
                        <CustomButton
                          icon={Edit}
                          label="Update Profile"
                          onClick={() => updateProfile()}
                          variant="ghost"
                        />
                        <CustomButton
                          icon={Plus}
                          label="Create Auction"
                          onClick={() => AddProduct()}
                          variant="ghost"
                        />
                        <CustomButton
                          icon={Edit}
                          label="Update Address"
                          onClick={() => updateAddress()}
                          variant="ghost"
                        />
                      </div>
                    </div>

                    {/* Wallet Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Wallet Balance
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 lg:mb-0">
                            <div className="relative group">
                              <div
                                className="rounded-lg p-4"
                                style={{
                                  backgroundColor: 'rgba(159, 50, 71, 0.1)',
                                  border: '1px solid rgba(159, 50, 71, 0.3)',
                                }}
                              >
                                <p
                                  className="text-sm font-medium mb-1"
                                  style={{ color: '#7a2837' }}
                                >
                                  Available Balance
                                </p>
                                <p
                                  className="text-2xl font-bold"
                                  style={{ color: '#9f3247' }}
                                >
                                  {user.wallet
                                    ? currencyFormat(user.available_balance)
                                    : currencyFormat('0.00')}
                                </p>
                              </div>
                              <span className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-900 text-white text-xs rounded py-2 px-3 group-hover:block z-10">
                                Money spent while bidding is deducted from this
                                balance
                              </span>
                            </div>
                            <div className="relative group">
                              <div
                                className="rounded-lg p-4"
                                style={{
                                  backgroundColor: 'rgba(159, 50, 71, 0.05)',
                                  border: '1px solid rgba(159, 50, 71, 0.2)',
                                }}
                              >
                                <p
                                  className="text-sm font-medium mb-1"
                                  style={{ color: '#7a2837' }}
                                >
                                  Total Balance
                                </p>
                                <p
                                  className="text-2xl font-bold"
                                  style={{ color: '#9f3247' }}
                                >
                                  {user.wallet
                                    ? currencyFormat(user.wallet)
                                    : currencyFormat('0.00')}
                                </p>
                              </div>
                              <span className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-900 text-white text-xs rounded py-2 px-3 group-hover:block z-10">
                                Total amount in your wallet
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row gap-3">
                          <CustomButton
                            icon={DollarSign}
                            label="Fund Wallet"
                            onClick={() => showModal('funding')}
                            variant="primary"
                          />
                          <CustomButton
                            icon={Download}
                            label="Withdraw"
                            onClick={() => showModal('withdraw')}
                            variant="primary"
                            className="bg-[#b83c51] hover:bg-[#9f3247] border-[#b83c51]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auctions Section */}
                  <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      {auctions && auctions.length > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                              Your Auctions
                            </h2>
                            <button
                              onClick={() => viewAuctions()}
                              className="text-sm font-medium text-[#9f3247] hover:text-[#7a2837] transition-colors flex items-center gap-1"
                            >
                              <span>View All</span>
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                                    Name
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                                    Description
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                                    Start Price
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                                    Current Price
                                  </th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {auctions.map((obj) => (
                                  <tr
                                    key={obj.id}
                                    onClick={() => viewAuction(obj.id)}
                                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <td className="py-3 px-4 relative group">
                                      <span className="font-medium text-gray-900">
                                        {charLimit(obj.item[0]?.name, 10)}
                                      </span>
                                      <span className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-900 text-white text-xs rounded py-2 px-3 group-hover:block z-10">
                                        {obj.item[0]?.name}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 relative group">
                                      <span className="text-gray-600">
                                        {charLimit(
                                          obj.item[0]?.description,
                                          20,
                                        )}
                                      </span>
                                      <span className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-900 text-white text-xs rounded py-2 px-3 group-hover:block z-10">
                                        {obj.item[0]?.description}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-900 font-medium">
                                      {currencyFormat(obj.start_price)}
                                    </td>
                                    <td
                                      className="py-3 px-4 font-semibold flex items-center gap-1"
                                      style={{ color: '#9f3247' }}
                                    >
                                      <TrendingUp className="w-4 h-4" />
                                      {currencyFormat(obj.current_price)}
                                    </td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          obj.status === 'active'
                                            ? 'text-green-800'
                                            : obj.status === 'ended'
                                            ? 'text-gray-800'
                                            : 'text-yellow-800'
                                        }`}
                                        style={{
                                          backgroundColor:
                                            obj.status === 'active'
                                              ? 'rgba(34, 197, 94, 0.1)'
                                              : obj.status === 'ended'
                                              ? 'rgba(107, 114, 128, 0.1)'
                                              : 'rgba(245, 158, 11, 0.1)',
                                        }}
                                      >
                                        {capitalize(obj.status)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Auctions Yet
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Start by creating your first auction to begin
                            selling.
                          </p>
                          <CustomButton
                            icon={Plus}
                            label="Create Your First Auction"
                            onClick={() => AddProduct()}
                            variant="primary"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bids Section */}
                  <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      {bids && bids.length > 0 ? (
                        <>
                          <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Your Bids
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {bids.map((bid, index) => (
                              <div
                                key={index}
                                className="relative group border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => productDetails(bid.auction_id)}
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <img
                                    src={bid.auction?.item[0]?.image_link?.link}
                                    alt="Auction"
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {bid.auction?.item[0]?.name}
                                    </p>
                                    <p
                                      className="text-sm font-medium"
                                      style={{ color: '#9f3247' }}
                                    >
                                      Your Bid: {currencyFormat(bid.amount)}
                                    </p>
                                  </div>
                                </div>
                                <span className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-900 text-white text-xs rounded py-2 px-3 group-hover:block z-10 max-w-xs">
                                  {bid.auction?.item[0]?.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Activity className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Bids Yet
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Browse auctions and place your first bid.
                          </p>
                          <CustomButton
                            icon={Activity}
                            label="View Auctions"
                            onClick={() => viewAuctions()}
                            variant="primary"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
