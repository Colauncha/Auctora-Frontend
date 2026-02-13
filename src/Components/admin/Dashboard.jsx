import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  MailSearch,
  LogOut,
  Blocks,
  House,
  Rss,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { PropTypes } from 'prop-types';
import CreateAdmin from './Tabs/CreateAdmin';
import CampaignSubs from './Tabs/CampainSubs';
import Overview from './Tabs/Overview';
import ManageUsers from './Tabs/Users';
import BlogAdmin from './Tabs/BlogAdmin';
import useAuthStore from '../../Store/AuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to the specified tab if provided in the state
  const stateTab = location.state?.tab;
  if (stateTab && stateTab !== activeTab) {
    setActiveTab(stateTab);
    navigate(location.pathname, { replace: true, state: {} });
  }

  const identity = useAuthStore((state) => state.data);
  const logout = useAuthStore((state) => state.logout);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { label: 'Overview', icon: Blocks },
    { label: 'Create Admin', icon: UserPlus },
    { label: 'Users', icon: Users },
    { label: 'Mail list', icon: MailSearch },
    { label: 'Blog Spot', icon: Rss },
  ];

  const handleTabClick = (label) => {
    setActiveTab(label);
    setMobileMenuOpen(false); // close mobile drawer on selection
  };

  const SidebarContent = ({ collapsed = false }) => (
    <nav className="flex flex-col gap-1 p-3">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => handleTabClick(tab.label)}
          title={collapsed ? tab.label : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
            ${
              activeTab === tab.label
                ? 'bg-[#9f3248] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-200'
            }
            ${collapsed ? 'justify-center' : ''}`}
        >
          <tab.icon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium truncate">{tab.label}</span>
          )}
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
              {tab.label}
            </span>
          )}
        </button>
      ))}
    </nav>
  );

  SidebarContent.propTypes = {
    collapsed: PropTypes.bool,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left: hamburger (mobile) + title */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate">
                  Biddius Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                  Welcome,{' '}
                  {`${identity?.first_name ?? ''} ${identity?.last_name ?? ''}`}
                </p>
              </div>
            </div>

            {/* Right: nav actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <House className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-30 transform transition-transform duration-300 md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <span className="font-semibold text-gray-800 text-sm">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent collapsed={false} />
      </aside>

      {/* Main layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full mt-4 px-4 sm:px-6 mb-6 gap-4">
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:flex flex-col border border-gray-200 bg-white rounded-lg shadow-sm flex-shrink-0 transition-all duration-300 overflow-hidden
            ${sidebarCollapsed ? 'w-16' : 'w-56'}`}
        >
          {/* Collapse toggle */}
          <div className="flex justify-end p-2 border-b border-gray-100">
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label={
                sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
          <SidebarContent collapsed={sidebarCollapsed} />
        </aside>

        {/* Content area */}
        <main className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 overflow-x-auto min-w-0">
          {activeTab === 'Overview' && (
            <div className="text-gray-700">
              <Overview />
            </div>
          )}
          {activeTab === 'Create Admin' && (
            <div className="text-gray-700">
              <CreateAdmin />
            </div>
          )}
          {activeTab === 'Users' && (
            <div className="text-gray-700">
              <ManageUsers />
            </div>
          )}
          {activeTab === 'Blog Spot' && (
            <div className="text-gray-700">
              <BlogAdmin />
            </div>
          )}
          {activeTab === 'Mail list' && (
            <div className="text-gray-700">
              <CampaignSubs />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
