import React, { useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const AccountForm = () => {

  const navigate = useNavigate();
    const Next = () => {
      navigate("/Verification");
    };
  

  const [selectedBank, setSelectedBank] = useState("");

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
  <div className="formatter">
    <div className="py-6"> {/* Reduced padding */}
      <Breadcrumbs />
    <div className="flex justify-center items-center">
      <div className="bg-white p-10 mb-6 mt-4 rounded-lg w-full max-w-full">
        <h1 className="text-4xl font-bold text-maroon mb-6">
          Account Information
        </h1>
        <form>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>
            <div>
              <input
                type="text"
                id="accountNumber"
                placeholder="Account Number"
                className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-red-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <select
              id="bank"
              value={selectedBank}
              onChange={handleBankChange}
              // className="block w-full bg-gray-200 border border-gray-300 text-gray-700 py-3 px-4 rounded focus:outline-none focus:bg-white focus:border-red-500"
                className="py-3 px-4 border border-gray-300 rounded focus:outline-none focus:bg-white focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-96 md:w-[648px] lg:w-[648px]"
            >
              <option value="">Select Bank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="First Bank of Nigeria">First Bank of Nigeria</option>
              <option value="Guaranty Trust Bank">Guaranty Trust Bank</option>
              <option value="United Bank for Africa">United Bank for Africa (UBA)</option>
              <option value="Zenith Bank">Zenith Bank</option>
              <option value="Fidelity Bank">Fidelity Bank</option>
              <option value="Ecobank">Ecobank</option>
              <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
              <option value="Union Bank">Union Bank</option>
              <option value="Keystone Bank">Keystone Bank</option>
              <option value="Polaris Bank">Polaris Bank</option>
              <option value="Wema Bank">Wema Bank</option>
              <option value="Unity Bank">Unity Bank</option>
            </select>
          </div>
          <div className="flex justify-start">
          <button
              onClick={Next}
                type="button"
                className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon mb-40"
              >
                Next
              </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AccountForm;