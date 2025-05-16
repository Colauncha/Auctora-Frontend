import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Ads from '../src/Pages/Home/Ads';
import Nav from '../src/Pages/Home/Nav';
import Layout from '../src/Pages/Home/Layout/Layout';
import AboutUs from '../src/Pages/About/About';
// import List from "./Pages/Sell/List";
import Footer from './Pages/Home/Footer';
import SignUp from './Pages/Auth/SignUp';
import SignIn from './Pages/Auth/SignIn';
import ForgotPassword from './Pages/Auth/ForgotPassword';
// import ResetPassword from "./Pages/Auth/ResetPassword";

import ViewAll from './Pages/Views/ViewAll';
import CategoryResult from './Pages/Category/CategoryResult';
import DetailPage from './Pages/Detail/Detail';

import Notification from './Pages/Notification/Notification';

// protected route
import ProtectedRoute from './Pages/ProtectedRoute/ProtectedRoute';
// import GetStarted from "./Pages/Dashboard/GetStarted";
import Dashboard from './Pages/Dashboard/Dashboard';

//Sell Routes
import SellAccount from './Pages/Sell/SellAccount';
import CreateAccount from './Pages/Sell/CreateAccount';
import AddressForm from './Pages/Sell/AddressForm';
import AccountForm from './Pages/Sell/AccountForm';
import Verification from './Pages/Sell/Verification';
import GetStarted from './Pages/Sell/GetStarted';

// Progress Routes
import ProgressTracker from './Pages/Sell/AddProduct/ProgressTracker';

// Payment Routes
import Payment from './Pages/Payment/Payment';
import ProductAuctionDetails from './Pages/Home/ProductAuctionDetails';
import YourProduct from './Pages/Sell/AddProduct/YourProduct';
import AuctionDetails from './Pages/Sell/AddProduct/AuctionDetails';
import NotFound from './Components/NotFound';
import ProductSuccess from './Pages/Sell/AddProduct/ProductSuccess';
import ReviewPage from './Pages/Sell/ReviewPage';

//privacy policy and terms and conditions
import PrivacyPolicy from './Pages/Terms & Privacy Policy/PrivacyPolicy';
import TermsCondition from './Pages/Terms & Privacy Policy/TermsCondition';

// For all pages to start from top
import ScrollToTop from './Components/ScrollToTop';

import useAuthStore from './Store/AuthStore';

// ToastContainer 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

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
    <div>
      <ScrollToTop />
      <Ads />
      <Nav />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/category" element={<CategoryResult />} />
        <Route path="/category/:slug" element={<DetailPage />} />
        <Route path="/Ongoing-Auction" element={<ViewAll />} />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

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
          path="/products"
          element={
            <ProtectedRoute>
              {' '}
              <YourProduct />{' '}
            </ProtectedRoute>
          }
        />
        <Route path="/products/:id" element={<AuctionDetails />} />

        <Route
          path="/product-success"
          element={
            <ProtectedRoute>
              <ProductSuccess />
            </ProtectedRoute>
          }
        />

        {/* Payment Routes */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

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
    </div>
  );
};

export default App;
