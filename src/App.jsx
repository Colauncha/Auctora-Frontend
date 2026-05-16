import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

// Eagerly loaded — rendered on every page
import Ads from '../src/Pages/Home/Ads';
import Nav from '../src/Pages/Home/Nav';
import Footer from './Pages/Home/Footer';
import ScrollToTop from './Components/ScrollToTop';
import Tracking from './Components/Tracking';
import ProtectedRoute from './Pages/ProtectedRoute/ProtectedRoute';

import useAuthStore from './Store/AuthStore';
import useModeStore from './Store/Store';
import { NotifContext } from './Store/notifContex.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazily loaded page components
const Layout = lazy(() => import('../src/Pages/Home/Layout/Layout'));
const AboutUs = lazy(() => import('../src/Pages/About/About'));
const SignUp = lazy(() => import('./Pages/Auth/SignUp'));
const SignIn = lazy(() => import('./Pages/Auth/SignIn'));
const ForgotPassword = lazy(() => import('./Pages/Auth/ForgotPassword'));
const ViewAll = lazy(() => import('./Pages/Views/ViewAll'));
const CategoryResult = lazy(() => import('./Pages/Category/CategoryResult'));
const DetailPage = lazy(() => import('./Pages/Detail/Detail'));
const Notification = lazy(() => import('./Pages/Notification/Notification'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const RewardHistory = lazy(() => import('./Components/Rewards/RewardHistory'));
const WalletHistory = lazy(() => import('./Pages/Dashboard/WalletHistory'));
const SellAccount = lazy(() => import('./Pages/Sell/SellAccount'));
const CreateAccount = lazy(() => import('./Pages/Sell/CreateAccount'));
const AddressForm = lazy(() => import('./Pages/Sell/AddressForm'));
const AccountForm = lazy(() => import('./Pages/Sell/AccountForm'));
const Verification = lazy(() => import('./Pages/Sell/Verification'));
const GetStarted = lazy(() => import('./Pages/Sell/GetStarted'));
const ProgressTracker = lazy(() => import('./Pages/Sell/AddProduct/ProgressTracker'));
const ProductAuctionDetails = lazy(() => import('./Pages/Home/ProductAuctionDetails'));
const YourProduct = lazy(() => import('./Pages/Sell/AddProduct/YourProduct'));
const AuctionDetails = lazy(() => import('./Pages/Sell/AddProduct/AuctionDetails'));
const ProductSuccess = lazy(() => import('./Pages/Sell/AddProduct/ProductSuccess'));
const ReviewPage = lazy(() => import('./Pages/Sell/ReviewPage'));
const PrivacyPolicy = lazy(() => import('./Pages/Terms & Privacy Policy/PrivacyPolicy'));
const TermsCondition = lazy(() => import('./Pages/Terms & Privacy Policy/TermsCondition'));
const NotFound = lazy(() => import('./Components/NotFound'));
const Construction = lazy(() => import('./Pages/misc/Construction'));
const ContactUs = lazy(() => import('./Pages/misc/ContactUs'));
const Blog = lazy(() => import('./Pages/Blog.jsx'));
const BlogSection = lazy(() => import('./Pages/BlogSection.jsx'));
const AdminPage = lazy(() => import('./Pages/Admin/AdminPage'));
const AdminAuth = lazy(() => import('./Components/admin/Auth'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-[#9f3248] border-t-transparent rounded-full animate-spin" />
  </div>
);

// Entry point
// App function component
const App = () => {
  const [notifTotal, setNotifTotal] = useState(0);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { isMobile, isPWA } = useModeStore();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        console.log('✅ Google login successful (from popup)');
        login(true);
        navigate('/dashboard');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, login]);

  return (
    <div className={isMobile && isPWA ? 'pb-24' : ''}>
      <NotifContext.Provider value={{ notifTotal, setNotifTotal }}>
        <ScrollToTop />
        <Ads />
        <Nav />
        <Tracking>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/category" element={<CategoryResult />} />
            <Route path="/category/:slug" element={<DetailPage />} />
            <Route path="/Ongoing-Auction" element={<ViewAll />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/bgsection" element={<BlogSection />} />
            <Route
              path="/notification"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<AdminPage />} />
              <Route path="login" element={<AdminAuth />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Sell Routes */}
            <Route path="/otp" element={<SellAccount />} />
            <Route path="/update-profile" element={<CreateAccount />} />
            <Route path="/update-address" element={<AddressForm />} />
            <Route path="/bank-account" element={<AccountForm />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/getstarted" element={<GetStarted />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />

            <Route path="/construction/*" element={<Construction />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Privacy Policy */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Terms and Conditions */}
            <Route path="/terms-conditions" element={<TermsCondition />} />

            {/* Progress Tracker Routes */}
            <Route
              path="/Add-Product"
              element={
                <ProtectedRoute>
                  <ProgressTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-details/:id"
              element={<ProductAuctionDetails />}
            />
            <Route
              path="/product/finalize/:id"
              element={
                <ProtectedRoute>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product-success"
              element={
                <ProtectedRoute>
                  <ProductSuccess />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route path="/dashboard">
              <Route
                path=""
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rewards"
                element={
                  <ProtectedRoute>
                    <RewardHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products/:id"
                element={
                  <ProtectedRoute>
                    <AuctionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="products"
                element={
                  <ProtectedRoute>
                    <YourProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="wallet-history"
                element={
                  <ProtectedRoute>
                    <WalletHistory />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
          </Suspense>

          {/* Add ToastContainer here */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <Footer />
        </Tracking>
      </NotifContext.Provider>
    </div>
  );
};

export default App;
