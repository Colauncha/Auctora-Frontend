import React from "react";
import fail from "../../assets/svg/Fail.svg";

const PaymentFailed = ({ amount, onClose }) => {
  return (
    <div className="text-center">
     
      <div className="flex justify-center mb-6">
        <div className="w-21 h-21 mt-8 flex items-center justify-center rounded-full">
          <img src={fail} alt="Error" />
        </div>
      </div>

      
      {amount && (
        <h2 className="text-lg font-bold text-gray-800 mt-8">
          
          $ 250.0 USD
        </h2>
      )}

     
      <p className="text-lg font-bold text-gray-800 mb-1">
        Payment Unsuccessful !
      </p>
      <p className="text-sm text-gray-500 mb-24">Please try again later.</p>

      {/* Back Button */}
      <button
        className="w-full mt-14 bg-red-800 text-white py-2 rounded-lg hover:bg-red-900 transition duration-300"
        onClick={onClose} 
      >
        Back
      </button>
    </div>
  );
};

export default PaymentFailed;
