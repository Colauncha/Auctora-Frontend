import React from "react";

const PayModal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        {/* Modal Content */}
        {children}
        
      </div>
    </div>
  );
};

export default PayModal;
