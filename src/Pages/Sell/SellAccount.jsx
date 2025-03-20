import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const SellAccount = () => {

    const navigate = useNavigate();
  const Verify = () => {
    navigate("/CreateAccount");
  };
    
    return (
        <div className="bg-[#F2F0F1] min-h-screen">
        <div className="formatter">
          <div className="py-6">
            <Breadcrumbs />
    <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] mt-4">
        
        <div className="flex flex-col lg:flex-row w-full max-w-[1430px] rounded-lg overflow-hidden mb-28">
        {/* <div className="flex flex-col lg:flex-row w-full max-w-[1430px] rounded-lg shadow-lg overflow-hidden mb-28"> */}
          {/* Left Section - Create Account Form */}
          <div className="flex-1 p-8 lg:p-16 bg-white">
            <h1 className="text-3xl lg:text-4xl mb-4 font-bold text-maroon">
              Create Account
            </h1>
            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-2">Phone</label>
              <div className="flex flex-col">
                {/* Input Field */}
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Enter your phone number"
                />
                {/* Send OTP Button */}
                <button className="mt-2 ml-auto font-bold text-red-800 hover:text-red-600">
    Send OTP
  </button>
  
              </div>
            </div>
            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-2">OTP</label>
              <div className="flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-4">
                The code will be sent via SMS.
              </p>
              <button onClick={Verify} className="mt-6 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white w-full py-3 rounded-full hover:bg-red-700 transition">
                Verify
              </button>
            </div>
          </div>
  
          {/* Right Section - Promotional Content */}
          <div className="flex-1 bg-gradient-to-br from-[#5e1a28] to-[#b73f57] p-8 lg:p-16 flex flex-col justify-center items-center text-white rounded-lg"
            style={{
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }}>
            <h2 className="text-3xl lg:text-4xl font-bold">AUCTION ON AUCTORA</h2>
            <p className="mt-4 text-lg text-center">
              Ready to showcase your products to a global audience? Create an Auctora seller account now! Tap into the excitement of auctions, connect with eager buyers, and turn your items into extraordinary finds. Join the auction adventure today!
            </p>
            <button className="mt-8 bg-[#7B2334] text-[#fff] px-6 py-3 rounded-full hover:bg-red-800">
    Already have an account? Login here
  </button>
  
          </div>
        </div>
        
      </div>
    </div>
    </div>
    </div>
  );
};

export default SellAccount