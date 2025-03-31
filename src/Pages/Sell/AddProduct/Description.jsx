import { useState } from "react";
import { PropTypes } from "prop-types";

const Description = ({ handleStepChange, activeStep }) => {
  const [product, setProduct] = useState({
    start_price: 0,
    current_price: 0,
    buy_now: false,
    buy_now_price: 0,
    start_date: new Date().toISOString(),
    end_date: "",
    users_id: sessionStorage.getItem("_user") ? JSON.parse(sessionStorage.getItem("_user")).id : "",
    private: false,
    participants: [],
    status: "pending"
  });

  const [item, setItem] = useState({
    name: "",
    description: "",
    category_id: "",
    sub_category_id: ""
  });

  // Handle change for item state object
  const handleChange = (e) => {
    console.log(e.target.value);
    const { name, value, type, checked } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);
  };

  // Handle change for product state object
  const handleChanged = (e) => {
    console.log(e.target.value);
    const { name, value, type, checked } = e.target;
    if (name === 'start_price') {
      setProduct(prev => ({
        ...prev,
        [name]: value,
        current_price: value
      }));
    } else if (name === 'start_date' || name === 'end_date') {
      let value_ = new Date(value);
      setProduct(prev => ({
        ...prev,
        [name]: value_.toISOString()
      }));

    }
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
                    <input
                      type="number"
                      name="buy_now_price"
                      placeholder="Buy Now price"
                      value={item.buy_now_price}
                      onChange={handleChanged}
                      className="w-2/4 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                    />
                  </div>
                )}
              </div>

              
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-black font-semibold">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    onChange={handleChanged}
                    className="mr-2"
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold">End Date & Time</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    onChange={handleChanged}
                    className="mr-2"
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

Description.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default Description;
