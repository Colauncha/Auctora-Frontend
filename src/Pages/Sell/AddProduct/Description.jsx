import { useState, useEffect } from "react";
// import PropTypes from 'prop-types';

const Description = ({ handleStepChange, activeStep }) => {
  // Helper function to format date with time for datetime-local input
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Helper function to parse datetime-local value to ISO string
  const parseDateTime = (datetimeString) => {
    if (!datetimeString) return "";
    return new Date(datetimeString).toISOString();
  };

  const productState = {
    start_price: "",
    current_price: "",
    buy_now: false,
    buy_now_price: "",
    start_date: new Date().toISOString(),
    end_date: "",
    // users_id: sessionStorage.getItem("_user") 
    //   ? JSON.parse(sessionStorage.getItem("_user")).id 
    //   : ""
      users_id: sessionStorage.getItem("_user") ? JSON.parse(sessionStorage.getItem("_user")).id : "",
  };

  const itemState = {
    name: "",
    description: ""
  };

  const [product, setProduct] = useState(productState);
  const [item, setItem] = useState(itemState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!item.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (item.name.length > 60) {
      newErrors.name = "Product name must be 60 characters or less";
    }

    if (!item.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!product.start_price || isNaN(product.start_price) || product.start_price <= 0) {
      newErrors.start_price = "Valid starting price is required";
    }

    if (product.buy_now && (!product.buy_now_price || isNaN(product.buy_now_price) || product.buy_now_price <= 0)) {
      newErrors.buy_now_price = "Valid buy now price is required";
    }

    if (!product.end_date) {
      newErrors.end_date = "End date and time is required";
    } else if (new Date(product.end_date) <= new Date(product.start_date)) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: parseDateTime(value)
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Save to sessionStorage 
      sessionStorage.setItem("product", JSON.stringify({ 
        product: { ...product, current_price: product.start_price },
        item 
      }));
      
      handleStepChange(activeStep + 1);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className="bg-white rounded-lg p-10 mb-4 mt-4">
          <h5 className="w-full max-w-full text-xl font-bold mb-4">
            Fill in the basic information about your item
          </h5>
          
          <form onSubmit={handleNext} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col space-y-4">
             
              <div>
                <label className="block text-black font-semibold">Product name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Graphic card GIGABYTE GeForce RTX 3050"
                  value={item.name}
                  onChange={handleChange}
                  className={`w-full mt-1 p-2 border rounded-lg bg-gray-100 ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  maxLength={60}
                />
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 mt-1">
                    {item.name.length}/60 characters
                  </p>
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
              </div>

              
              <div>
                <label className="block text-black font-semibold">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter product details..."
                  value={item.description}
                  onChange={handleChange}
                  className={`w-full mt-1 p-2 border rounded-lg bg-gray-100 h-60 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={1200}
                />
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 mt-1">
                    {item.description.length}/1200 characters
                  </p>
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-4">
              
              <div>
                <label className="block text-black font-semibold">Initial price</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <input
                    type="number"
                    name="start_price"
                    placeholder="0.00"
                    value={product.start_price}
                    onChange={handleProductChange}
                    min="0"
                    step="0.01"
                    className={`w-2/4 mt-1 p-2 border rounded-lg bg-gray-100 ${
                      errors.start_price ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                </div>
                {errors.start_price && (
                  <p className="text-sm text-red-500 mt-1">{errors.start_price}</p>
                )}
              </div>

              
              <div className="mt-4">
                <label className="flex items-center text-black font-semibold">
                  <input
                    type="checkbox"
                    name="buy_now"
                    checked={product.buy_now}
                    onChange={handleProductChange}
                    className="mr-2 h-5 w-5 text-maroon focus:ring-maroon"
                  />
                  Buy Now?
                </label>
                
                {product.buy_now && (
                  <div className="mt-3 ml-7">
                    <label className="block text-black font-semibold">Buy Now Price</label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="number"
                        name="buy_now_price"
                        placeholder="0.00"
                        value={product.buy_now_price}
                        onChange={handleProductChange}
                        min="0"
                        step="0.01"
                        className={`w-2/4 mt-1 p-2 border rounded-lg bg-gray-100 ${
                          errors.buy_now_price ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.buy_now_price && (
                      <p className="text-sm text-red-500 mt-1">{errors.buy_now_price}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Customers can purchase immediately at this price
                    </p>
                  </div>
                )}
              </div>

              
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-black font-semibold">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formatDateTime(product.start_date)}
                    onChange={handleDateTimeChange}
                    min={formatDateTime(new Date())}
                    className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold">End Date & Time</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formatDateTime(product.end_date)}
                    onChange={handleDateTimeChange}
                    min={formatDateTime(product.start_date)}
                    className={`w-full mt-1 p-2 border rounded-lg bg-gray-100 ${
                      errors.end_date ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.end_date}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-3 px-8 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Description.propTypes = {
//   handleStepChange: PropTypes.func.isRequired,
//   activeStep: PropTypes.number.isRequired
// };

export default Description;