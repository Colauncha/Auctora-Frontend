import React, { useState, useEffect } from "react";
import PayModal from "../../Payment/PayModal";
import PaymentFailed from "../../Payment/PaymentFailed";

const PaymentModal = ({ onClose }) => {
  const [pin, setPin] = useState("");
  const [isPayModalVisible, setPayModalVisible] = useState(false);


  useEffect(() => {
    if (pin.length === 4) {
      setPayModalVisible(true); 
    }
  }, [pin]);

  
  const handleCloseAllModals = () => {
    setPin(""); 
    setPayModalVisible(false); 
    onClose(); 
  };

  const handleNumberClick = (number) => {
    if (pin.length < 4) {
      setPin((prevPin) => prevPin + number);
    }
  };

  const handleBackspaceClick = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-5xl font-extrabold text-maroon text-center mb-10">
        PIN
      </h2>

     
      <div className="flex justify-center gap-3 mb-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-14 h-14 border-2 border-[maroon] rounded-lg flex items-center justify-center text-3xl font-bold"
          >
            {pin[index] || " "}
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            className="w-full h-20 flex items-center justify-center text-7xl font-extrabold text-[maroon] hover:bg-gray-100 rounded-lg"
          >
            {number}
          </button>
        ))}
        <button
          onClick={handleBackspaceClick}
          className="w-full h-20 flex items-center justify-center text-3xl font-bold text-[maroon] hover:bg-gray-100 rounded-lg"
        >
          x
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          className="w-full h-20 flex items-center justify-center text-7xl font-extrabold text-[maroon] hover:bg-gray-100 rounded-lg"
        >
          0
        </button>
        <button
          onClick={handleCloseAllModals}
          className="w-full h-20 flex items-center justify-center text-3xl font-bold text-[maroon] hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
      </div>

      
      <PayModal 
        isVisible={isPayModalVisible} 
        onClose={handleCloseAllModals} 
      >
        <PaymentFailed 
          amount={5000} 
          onClose={handleCloseAllModals} 
        />
      </PayModal>
    </div>
  );
};

export default PaymentModal;