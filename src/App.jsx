import { Routes, Route } from "react-router-dom";
import Ads from "../src/Pages/Home/Ads";
import Nav from "../src/Pages/Home/Nav";
import Layout from "../src/Pages/Home/Layout/Layout";
import AboutUs from "../src/Pages/About/About";
// import List from "./Pages/Sell/List";
import Footer from "./Pages/Home/Footer";
import SignUp from "./Pages/Auth/SignUp";
import SignIn from "./Pages/Auth/SignIn";
import ViewAll from "./Pages/Views/ViewAll";
import CategoryResult from "./Pages/Category/CategoryResult";
import DetailPage from "./Pages/Detail/Detail";

// verification pages
// import Otp from "./Pages/Account/Otp";
// import Profile from "./Pages/Dashboard/Profile";
// import AddressVerification from "./Pages/Dashboard/AddressVerification";
import Notification from "./Pages/Notification/Notification";
// import BankVerification from "./Pages/Dashboard/BankVerification";
// import VerificationLoading from "./Pages/Dashboard/VerificationLoading";

// protected route
import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute";
// import GetStarted from "./Pages/Dashboard/GetStarted";
import ProductPhoto from "./Pages/Dashboard/AddProduct/ProductPhoto";
import Dashboard from "./Pages/Dashboard/Dashboard";

//Sell Routes
import SellAccount from "./Pages/Sell/SellAccount";
import CreateAccount from "./Pages/Sell/CreateAccount";
import AddressForm from "./Pages/Sell/AddressForm";
import AccountForm from "./Pages/Sell/AccountForm";
import Verification from "./Pages/Sell/Verification";
import GetStarted from "./Pages/Sell/GetStarted";

// Progress Routes
import ProgressTracker from "./Pages/Sell/AddProduct/ProgressTracker";

// Payment Routes
import Payment from "./Pages/Payment/Payment";
// import AppTest from "./Pages/Payment/AppTest";
// import ProgressTracker from "./Pages/Sell/ProgressTracker";

const App = () => {
  return (
    <div>
      <Ads />
      <Nav />
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/category" element={<CategoryResult />} />
        <Route path="/category/:slug" element={<DetailPage />} />
        <Route path="/list" element={<ProductPhoto />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/Ongoing-Auction" element={<ViewAll />} />

        {/* Auth Routes */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />

        {/* Verification Routes */}
        {/* <Route path="/otp" element={<Otp />} /> */}
        {/* complete logic for Otp and redirect to Profile */}
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/address-verification" element={<AddressVerification />} />
        <Route path="/bank-verification" element={<BankVerification />} />
        <Route path="/verification-loading" element={<VerificationLoading />} /> */}

        {/* Sell Routes */}
        {/* <Route path="/Account" element={<SellAccount />} /> */}
        <Route path="/otp" element={<SellAccount />} />
        <Route path="/update-profile" element={<CreateAccount />} />
        <Route path="/update-address" element={<AddressForm />} />
        <Route path="/bank-account" element={<AccountForm />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/getstarted" element={<GetStarted />} />

        {/* Progress Tracker Routes */}
        <Route path="/Add-Product" element={<ProgressTracker />} />

        {/* Payment Routes */}
        <Route path="/payment" element={<Payment />} /> 
        {/* <Route path="/app" element={<AppTest />} />  */}
        


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
      <Footer />
    </div>
  );
};

export default App;
