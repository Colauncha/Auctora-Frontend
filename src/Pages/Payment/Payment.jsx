// import React, { useState } from "react";
// import deleteIcon from "../../assets/svg/delete.svg"; // Renamed to avoid conflict
// import Breadcrumbs from "../../Components/Breadcrumbs";
// import image1 from "../../assets/uploads/photo+icon (1).png";
// import image2 from "../../assets/uploads/photo+icon.png";
// import master from "../../assets/uploads/mastercard.png";
// import vis from "../../assets/uploads/visa.png";
// import paypal from "../../assets/uploads/paypal.png";
// import PayModal from "../../Pages/Payment/PayModal";
// import PaymentFailed from "../../Pages/Payment/PaymentFailed";
// import Modal from "../../Pages/Payment/Modal/Modal"; // Import the Modal component
// import PaymentModal from "../../Pages/Payment/Modal/PaymentModal"; // Import the Modal component
// // import PaymentModal from "../../Components/Modals/PaymentModal"; // Import the PaymentModal component

// const Payment = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isModalVisible, setModalVisible] = useState(false);

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen">
//       <div className="formatter">
//         <div className="py-6">
//           <Breadcrumbs />

//           <div className="flex justify-center items-center">
//             <div className="mb-2 mt-4 rounded-lg w-full max-w-full">
//             {/* <div className="bg-white border border-gray-300 mb-2 mt-4 rounded-lg w-full max-w-full"> */}
//               {/* Updated Section */}
//               <section className="flex flex-col md:flex-row justify-between items-start gap-8 w-full h-auto mb-16">
//                 {/* Red Div (70% width) */}
//                 <div className="w-full md:w-[70%] bg-white rounded-lg p-8">
//                   {/* Header Section */}
//                   <div className="flex justify-between items-center mb-6">
//                     <p className="text-[18px] font-extrabold">
//                       Items{" "}
//                       <span className="text-[12px] font-normal text-gray-600">
//                         (2 items)
//                       </span>
//                     </p>

//                     <div className="flex items-center gap-2 cursor-pointer">
//                       <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
//                       <p className="text-[16px] font-bold text-maroon">
//                         Remove all
//                       </p>
//                     </div>
//                   </div>

//                   {/* Item 1 */}
//                   <div className="flex justify-between items-center border border-gray-300 rounded-lg p-6 w-full mx-auto mb-4">
//                     {/* Image and Details Section */}
//                     <div className="flex items-center gap-6">
//                       {/* Image Preview and Details */}
//                       <div className="relative rounded-lg w-[100px] flex flex-col items-start">
//                         {/* Image */}
//                         <img
//                           src={image1}
//                           alt="Product"
//                           className="w-full h-[100px] object-cover mb-2"
//                         />

//                         {/* Image Name and Size */}
//                         <div className="text-left">
//                           <p className="text-sm font-semibold text-black">
//                             XYZ name.jpg
//                           </p>
//                           <p className="text-xs text-gray-500">24 Mb</p>
//                         </div>
//                       </div>

//                       {/* Product Details */}
//                       <div className="text-sm text-gray-700">
//                         <p className="text-[14px] font-bold text-black">
//                           Camera
//                         </p>
//                         <p>XYZ name.jpg</p>
//                         <p>Colour: Black</p>
//                       </div>
//                     </div>

//                     {/* Price and Remove Section */}
//                     <div className="flex flex-col justify-between items-end h-[100px]">
//                       <p className="text-[16px] font-bold text-maroon cursor-pointer">
//                         X
//                       </p>
//                       <p className="text-[16px] text-maroon">$150</p>
//                     </div>
//                   </div>

//                   {/* Item 2 */}
//                   <div className="flex justify-between items-center border border-gray-300 rounded-lg p-6 w-full mx-auto">
//                     {/* Image and Details Section */}
//                     <div className="flex items-center gap-6">
//                       {/* Image Preview and Details */}
//                       <div className="relative rounded-lg w-[100px] flex flex-col items-start">
//                         {/* Image */}
//                         <img
//                           src={image2}
//                           alt="Product"
//                           className="w-full h-[100px] object-cover mb-2"
//                         />

//                         {/* Image Name and Size */}
//                         <div className="text-left">
//                           <p className="text-sm font-semibold text-black">
//                             XYZ name.jpg
//                           </p>
//                           <p className="text-xs text-gray-500">24 Mb</p>
//                         </div>
//                       </div>

//                       {/* Product Details */}
//                       <div className="text-sm text-gray-700">
//                         <p className="text-[14px] font-bold text-black">
//                           Camera
//                         </p>
//                         <p>XYZ name.jpg</p>
//                         <p>Colour: Black</p>
//                       </div>
//                     </div>

//                     {/* Price and Remove Section */}
//                     <div className="flex flex-col justify-between items-end h-[100px]">
//                       <p className="text-[16px] font-bold text-maroon cursor-pointer">
//                         X
//                       </p>
//                       <p className="text-[16px] text-maroon">$150</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Purple Div (30% width) */}
//                 <div className="w-full md:w-[30%] bg-white rounded-lg p-8">
//                   <h2 className="text-xl font-bold text-black mb-6">Checkout</h2>

//                   {/* Payment Icons */}
//                   <div className="flex gap-2 mb-6">
//                     <img src={master} alt="Mastercard" className="w-20 h-18" />
//                     <img src={vis} alt="VISA" className="w-20 h-18" />
//                     <img src={paypal} alt="PayPal" className="w-20 h-18" />
//                   </div>

//                   {/* Cardholder Name */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-black mb-1">
//                       Cardholder Name
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="Mary Ifuunaya"
//                       className="w-full p-2 rounded-lg border border-maroon focus:outline-none focus:ring-2 focus:ring-purple-200"
//                     />
//                   </div>

//                   {/* Card Number */}
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-black mb-1">
//                       Card Number
//                     </label>
//                     <input
//                       type="text"
//                       placeholder="1234 5678 9012 3456"
//                       className="w-full p-2 rounded-lg border border-maroon focus:outline-none focus:ring-2 focus:ring-purple-200"
//                     />
//                   </div>

//                   {/* Expiration Date and CVC */}
//                   <div className="flex gap-4 mt-10 mb-6">
//                     <div className="w-1/2">
//                       <label className="block text-sm font-medium text-black mb-1">
//                         Expiration Date
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         className="w-full p-2 rounded-lg border border-maroon focus:outline-none focus:ring-2 focus:ring-purple-200"
//                       />
//                     </div>
//                     <div className="w-1/2">
//                       <label className="block text-sm font-medium text-black mb-1">
//                         CVC
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="123"
//                         className="w-full p-2 rounded-lg border border-maroon focus:outline-none focus:ring-2 focus:ring-purple-200"
//                       />
//                     </div>
//                   </div>

//                   {/* Pay Now Button
//                   <button className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-red-950 transition duration-300 mt-8">
//                     PAY NOW
//                   </button> */}
//                   {/* Pay Now Button */}
//                   <div className="relative">
//         {/* <button
//           className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-red-950 transition duration-300 mt-8"
//           onClick={() => setModalVisible(true)}
//         >
//           PAY NOW
//         </button> */}
//         <button
//                   onClick={() => setModalOpen(true)}
//                   className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-red-950 transition duration-300 mt-8"
//                 >
//                   PAY NOW
//                 </button>

//         {/* Modal */}
//         {/* <PayModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
//           <h2 className="text-xl font-bold mb-4">Payment Modal</h2>
//           <p className="mb-4">Complete your payment securely.</p>
//         </PayModal> */}
//         {/* Modal with PaymentFailed Content */}
//         <PayModal isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
//         <PaymentFailed amount={5000} onClose={() => setModalVisible(false)} />
//       </PayModal>
//       </div>
//                 </div>
//               </section>

//               {/* Order Summary Section */}
//               <section className="flex flex-col md:flex-row justify-between items-start gap-8 w-full h-auto mt-16">
//                 {/* Red Div (70% width) */}
//                 <div className="w-full md:w-[70%] bg-white rounded-lg p-8">
//                   <h2 className="text-xl font-extrabold text-black mb-6">
//                     Order Summary
//                   </h2>

//                   {/* Order Details */}
//                   <div className="space-y-4">
//                     {/* Subtotal */}
//                     <div className="flex justify-between">
//                       <p className="text-sm text-black">Subtotal</p>
//                       <p className="text-sm text-maroon">$ 300</p>
//                     </div>

//                     <div className="border-t border-maroon opacity-20 my-4"></div>

//                     {/* Discount */}
//                     <div className="flex justify-between">
//                       <p className="text-sm text-black">Discount</p>
//                       <p className="text-sm text-maroon">$ -50</p>
//                     </div>

//                     <div className="border-t border-maroon opacity-20 my-4"></div>

//                     {/* Shipping Fee */}
//                     <div className="flex justify-between">
//                       <p className="text-sm text-black">Shipping Fee</p>
//                       <p className="text-sm text-maroon">FREE</p>
//                     </div>

//                     {/* Divider */}
//                     <div className="border-t border-maroon opacity-20 my-4"></div>

//                     {/* Total Price */}
//                     <div className="flex justify-between">
//                       <p className="text-lg font-extrabold text-maroon">
//                         Total Price
//                       </p>
//                       <p className="text-lg font-bold text-maroon">$ 250</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Purple Div (30% width) */}
//                 <div className="w-full md:w-[30%] rounded-lg p-8"></div>
//               </section>

//               {/* Open Modal Button */}
//               <p className="text-lg text-gray-700 mb-6 text-center mt-16">
//                 {/* Open Modal Payment Page */}
//               </p>
//               <div className="flex justify-center">
//                 <div
//                   // onClick={() => setModalOpen(true)}
//                   className="bg-[#F2F0F1] text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-20"
//                 >
                  
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
//         <PaymentModal onClose={() => setModalOpen(false)} />
//       </Modal>
//     </div>
//   );
// };

// export default Payment;


import React, { useState } from "react";
import deleteIcon from "../../assets/svg/delete.svg";
import Breadcrumbs from "../../Components/Breadcrumbs";
import image1 from "../../assets/uploads/photo+icon (1).png";
import image2 from "../../assets/uploads/photo+icon.png";
import master from "../../assets/uploads/mastercard.png";
import vis from "../../assets/uploads/visa.png";
import paypal from "../../assets/uploads/paypal.png";
import PayModal from "../../Pages/Payment/PayModal";
import PaymentFailed from "../../Pages/Payment/PaymentFailed";
import Modal from "../../Pages/Payment/Modal/Modal";
import PaymentModal from "../../Pages/Payment/Modal/PaymentModal";

const Payment = () => {
  
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Camera",
      fileName: "XYZ name.jpg",
      image: image1,
      price: 150,
      color: "Black",
      size: "24 Mb"
    },
    {
      id: 2,
      name: "Camera",
      fileName: "XYZ name.jpg",
      image: image2,
      price: 150,
      color: "Black",
      size: "24 Mb"
    }
  ]);

  // State for payment form
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    paymentMethod: "creditCard" // 'creditCard', 'paypal'
  });

  // State for modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Constants for pricing
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = 50;
  const shippingFee = 0;
  const total = subtotal - discount + shippingFee;

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const removeAllItems = () => {
    setItems([]);
  };

  const validateForm = () => {
    const errors = {};
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvcRegex = /^\d{3,4}$/;

    if (!formData.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required";
    }

    if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Invalid card number (16 digits required)";
    }

    if (!expiryDateRegex.test(formData.expiryDate)) {
      errors.expiryDate = "Invalid expiry date (MM/YY format)";
    }

    if (!cvcRegex.test(formData.cvc)) {
      errors.cvc = "Invalid CVC (3-4 digits required)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate payment processing
      setTimeout(() => {
        // Randomly determine if payment fails (for trial)
        const paymentSuccess = Math.random() > 0.5;
        if (paymentSuccess) {
          setModalOpen(true);
        } else {
          setIsPaymentFailed(true);
        }
      }, 1500);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />

          <div className="flex justify-center items-center">
            <div className="mb-2 mt-4 rounded-lg w-full max-w-full">
              {/* Items Section */}
              <section className="flex flex-col md:flex-row justify-between items-start gap-8 w-full h-auto mb-16">
                {/* Items List (70% width) */}
                <div className="w-full md:w-[70%] bg-white rounded-lg p-8">
                  {/* Header Section */}
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-[18px] font-extrabold">
                      Items{" "}
                      <span className="text-[12px] font-normal text-gray-600">
                        ({items.length} {items.length === 1 ? 'item' : 'items'})
                      </span>
                    </p>

                    {items.length > 0 && (
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={removeAllItems}
                      >
                        <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                        <p className="text-[16px] font-bold text-maroon">
                          Remove all
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border border-gray-300 rounded-lg p-6 w-full mx-auto mb-4">
                        {/* Image and Details Section */}
                        <div className="flex items-center gap-6">
                          {/* Image Preview and Details */}
                          <div className="relative rounded-lg w-[100px] flex flex-col items-start">
                            <img
                              src={item.image}
                              alt="Product"
                              className="w-full h-[100px] object-cover mb-2"
                            />
                            <div className="text-left">
                              <p className="text-sm font-semibold text-black">
                                {item.fileName}
                              </p>
                              <p className="text-xs text-gray-500">{item.size}</p>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="text-sm text-gray-700">
                            <p className="text-[14px] font-bold text-black">
                              {item.name}
                            </p>
                            <p>{item.fileName}</p>
                            <p>Colour: {item.color}</p>
                          </div>
                        </div>

                        {/* Price and Remove Section */}
                        <div className="flex flex-col justify-between items-end h-[100px]">
                          <p 
                            className="text-[16px] font-bold text-maroon cursor-pointer"
                            onClick={() => removeItem(item.id)}
                          >
                            X
                          </p>
                          <p className="text-[16px] text-maroon">${item.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  )}
                </div>

                {/* Payment Form (30% width) */}
                <div className="w-full md:w-[30%] bg-white rounded-lg p-8">
                  <h2 className="text-xl font-bold text-black mb-6">Checkout</h2>

                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    {/* <label className="block text-sm font-medium text-black mb-2">
                      Payment Method
                    </label> */}
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg border ${
                          formData.paymentMethod === 'creditCard' 
                            ? 'bg-maroon/10' 
                            : 'border'
                        }`}
                        onClick={() => setFormData({...formData, paymentMethod: 'creditCard'})}
                      >
                        <div className="flex justify-center gap-1">
                          <img src={master} alt="Mastercard" className="w-20 h-18" />
                          <img src={vis} alt="VISA" className="w-20 h-18" />
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-1 rounded-lg border ${
                          formData.paymentMethod === 'paypal' 
                            ? 'bg-maroon/10' 
                            : 'border'
                        }`}
                        onClick={() => setFormData({...formData, paymentMethod: 'paypal'})}
                      >
                        <img src={paypal} alt="PayPal" className="w-20 h-18 mx-auto" />
                      </button>
                    </div>
                  </div>

                  {formData.paymentMethod === 'creditCard' ? (
                    <form onSubmit={handleSubmit}>
                      {/* Cardholder Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleChange}
                          placeholder="Mary Ifuunaya"
                          className={`w-full p-2 rounded-lg border ${
                            formErrors.cardholderName ? 'border-red-500' : 'border-maroon'
                          } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                        />
                        {formErrors.cardholderName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cardholderName}</p>
                        )}
                      </div>

                      {/* Card Number */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-black mb-1">
                          Card Number
                        </label>
                        <input
  type="text"
  name="cardNumber"
  value={formatCardNumber(formData.cardNumber)}
  onChange={(e) => {
    const value = e.target.value.replace(/\s/g, ""); // Remove any spaces
    if (/^\d*$/.test(value)) { // Ensure only numbers are accepted
      handleChange({
        target: {
          name: "cardNumber",
          value: value.slice(0, 16) // Limit the value to 16 digits
        }
      });
    }
  }}
  placeholder="1234 5678 9012 3456"
  className={`w-full p-2 rounded-lg border ${
    formErrors.cardNumber ? "border-red-500" : "border-maroon"
  } focus:outline-none focus:ring-2 focus:ring-purple-200`}
/>

                        {formErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                        )}
                      </div>

                      {/* Expiration Date and CVC */}
                      <div className="flex gap-4 mt-10 mb-6">
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-black mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (value.length === 2 && !value.includes('/')) {
                                value = value + '/';
                              }
                              handleChange({
                                target: {
                                  name: "expiryDate",
                                  value: value.slice(0, 5)
                                }
                              });
                            }}
                            placeholder="MM/YY"
                            className={`w-full p-2 rounded-lg border ${
                              formErrors.expiryDate ? 'border-red-500' : 'border-maroon'
                            } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                          />
                          {formErrors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                          )}
                        </div>
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-black mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cvc"
                            value={formData.cvc}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                handleChange({
                                  target: {
                                    name: "cvc",
                                    value: value.slice(0, 4)
                                  }
                                });
                              }
                            }}
                            placeholder="123"
                            className={`w-full p-2 rounded-lg border ${
                              formErrors.cvc ? 'border-red-500' : 'border-maroon'
                            } focus:outline-none focus:ring-2 focus:ring-purple-200`}
                          />
                          {formErrors.cvc && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.cvc}</p>
                          )}
                        </div>
                      </div>

                      {/* Pay Now Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-red-950 transition duration-300 mt-8 disabled:opacity-50"
                        disabled={items.length === 0}
                      >
                        PAY NOW
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You will be redirected to PayPal to complete your payment</p>
                      <button
                        className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-red-950 transition duration-300"
                        disabled={items.length === 0}
                      >
                        PAY WITH PAYPAL
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Order Summary Section */}
              {items.length > 0 && (
                <section className="flex flex-col md:flex-row justify-between items-start gap-8 w-full h-auto mt-16 mb-30">
                  {/* Order Summary (70% width) */}
                  <div className="w-full md:w-[70%] bg-white rounded-lg p-8">
                    <h2 className="text-xl font-extrabold text-black mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <p className="text-sm text-black">Subtotal</p>
                        <p className="text-sm text-maroon">$ {subtotal}</p>
                      </div>

                      <div className="border-t border-maroon opacity-20 my-4"></div>

                      <div className="flex justify-between">
                        <p className="text-sm text-black">Discount</p>
                        <p className="text-sm text-maroon">$ -{discount}</p>
                      </div>

                      <div className="border-t border-maroon opacity-20 my-4"></div>

                      <div className="flex justify-between">
                        <p className="text-sm text-black">Shipping Fee</p>
                        <p className="text-sm text-maroon">FREE</p>
                      </div>

                      <div className="border-t border-maroon opacity-20 my-4"></div>

                      <div className="flex justify-between">
                        <p className="text-lg font-extrabold text-maroon">
                          Total Price
                        </p>
                        <p className="text-lg font-bold text-maroon">$ {total}</p>
                      </div>
                    </div>
                  </div>

                  {/* Empty Div (30% width) */}
                  <div className="w-full md:w-[30%] rounded-lg p-8"></div>
                </section>
                
              )}
              <div className="w-full mt-10 mb-10 md:w-[30%] rounded-lg p-8">

</div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <PaymentModal onClose={() => setModalOpen(false)} />
      </Modal>

      {/* Payment Failed Modal */}
      <PayModal 
        isVisible={isPaymentFailed} 
        onClose={() => setIsPaymentFailed(false)}
      >
        <PaymentFailed 
          amount={total} 
          onClose={() => setIsPaymentFailed(false)} 
          onRetry={() => {
            setIsPaymentFailed(false);
            // You might want to focus on the form here
          }}
        />
      </PayModal>
    </div>
  );
};

export default Payment;