import { useState } from 'react';
import {
  Users,
  // Briefcase,
  // Settings,
  UserPlus,
  // ShoppingBag,
  MailSearch,
  LogOut,
  Blocks,
  House,
} from 'lucide-react'; // Lucide icons
import CreateAdmin from './Tabs/CreateAdmin';
import CampaignSubs from './Tabs/CampainSubs';
import Overview from './Tabs/Overview';
import ManageUsers from './Tabs/Users';
import useAuthStore from '../../Store/AuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const navigate = useNavigate();
  const location = useLocation();
  // Redirect to the specified tab if provided in the state
  const stateTab = location.state?.tab;
  if (stateTab && stateTab !== activeTab) {
    setActiveTab(stateTab);
    // Clear the state to prevent repeated redirects
    navigate(location.pathname, { replace: true, state: {} });
  }
  const identity = useAuthStore((state) => state.data);
  const logout = useAuthStore((state) => state.logout);

  const tabs = [
    { label: 'Overview', icon: Blocks },
    { label: 'Create Admin', icon: UserPlus },
    { label: 'Users', icon: Users },
    { label: 'Mail list', icon: MailSearch },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mb-6">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Biddius Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex justify-between gap-3">
            Welcome, {`${identity?.first_name} ${identity?.last_name}`}
            <span className="flex gap-2">
              <button
                onClick={() => {
                  navigate('/');
                }}
                className="border-r-2 pr-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <House className="w-5 h-5" />
                <span className="text-sm">Home</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </span>
          </p>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full mt-4 rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50">
          <nav className="flex flex-col gap-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                  ${
                    activeTab === tab.label
                      ? 'bg-[#9f3248] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-x-auto">
          {activeTab === 'Overview' && (
            <div className="text-gray-700">
              🗂 Overview content...
              <Overview />
            </div>
          )}
          {activeTab === 'Create Admin' && (
            <div className="text-gray-700">
              👤 Create Admin form...
              <CreateAdmin />
            </div>
          )}
          {activeTab === 'Users' && (
            <div className="text-gray-700">
              👤 Manages Users...
              <ManageUsers />
            </div>
          )}
          {activeTab === 'Mail list' && (
            <div className="text-gray-700">
              📨 Mail subscriber list...
              <CampaignSubs />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
