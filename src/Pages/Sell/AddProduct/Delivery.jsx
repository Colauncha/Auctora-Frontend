import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Loader from '../../../assets/loader2';

const Delivery = ({ 
  activeStep, 
  handleStepChange,
  formData,           // Added to sync with ProgressTracker
  updateFormData,     // Added to sync with ProgressTracker
  updateFormValidity 
}) => {
  const [selectedOptions, setSelectedOptions] = useState(formData.delivery?.options || []);
  const [shippingDate, setShippingDate] = useState(formData.delivery?.date || '');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Update form validity and sync with ProgressTracker
  useEffect(() => {
    const isValid = selectedOptions.length > 0;
    updateFormValidity(activeStep, isValid);
    
    // Update parent form data
    updateFormData({
      ...formData,
      delivery: {
        options: selectedOptions,
        date: shippingDate
      }
    });
  }, [selectedOptions, shippingDate]);

  const handleReset = () => {
    setSelectedOptions([]);
    setShippingDate('');
  };

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    if (selectedOptions.length === 0) {
      alert('Please select at least one delivery option');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/product-success');
    }, 1500);
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className="bg-white rounded-lg p-6 md:p-10 mb-4 mt-4">
          <h4 className="w-full text-xl font-bold mb-4 md:mb-6">
            Select delivery options <span className="text-red-500">*</span>
          </h4>

          <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
            {['Self pickup', 'Online payment', 'Courier cash on delivery'].map(
              (option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer w-full md:w-1/2 lg:w-1/3 mt-1 p-2 md:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    disabled={option === 'Self pickup' ? false : true}
                    className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-400 text-red-800 focus:ring-red-800"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ),
            )}
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="text-sm md:text-base font-medium">Shipping time</h3>
            <input
              type="text"
              name="date"
              placeholder="Specify a date"
              value={shippingDate}
              disabled={true}
              onChange={(e) => setShippingDate(e.target.value)}
              className="w-full mt-1 md:mt-2 px-3 py-2 text-sm md:text-base border bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div className="flex gap-4 items-center justify-between mt-6">
            <button
              onClick={() => handleStepChange(activeStep - 1)}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                onClick={handleNext}
                disabled={selectedOptions.length === 0 || loading}
                className={`px-6 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full ${
                  selectedOptions.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-maroon hover:to-maroon'
                }`}
              >
                Submit
                {loading && <Loader className="ml-2" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Delivery.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  updateFormValidity: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,         // Updated propType
  updateFormData: PropTypes.func.isRequired,     // New propType
};

export default Delivery;