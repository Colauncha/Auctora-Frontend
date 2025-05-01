import { useState, useEffect, useRef, useCallback } from 'react'; // Added useRef
import { PropTypes } from 'prop-types';
import Loader from '../../../assets/loader2';

const Description = ({ 
  handleStepChange, 
  activeStep, 
  updateFormValidity,
  formData = {
    item: {
      name: '',
      description: '',
      category_id: '',
      sub_category_id: ''
    },
    product: {
      start_price: 0,
      current_price: 0,
      buy_now: false,
      buy_now_price: 0,
      start_date: new Date().toISOString(),
      end_date: '',
      users_id: sessionStorage.getItem('_user') 
        ? JSON.parse(sessionStorage.getItem('_user')).id
        : '',
      private: false,
      participants: [],
      status: 'pending'
    }
  },          
  updateFormData 
}) => {
  const [loading, setLoading] = useState(false);
  const prevValidityRef = useRef();

  useEffect(() => {
    prevValidityRef.current = validateForm();
  }, []);

  useEffect(() => {
    const isValid = validateForm();
    if (isValid !== prevValidityRef.current) {
      updateFormValidity(activeStep, isValid);
      prevValidityRef.current = isValid;
    }
  }, [formData, activeStep, updateFormValidity]);

  const safeFormData = JSON.parse(JSON.stringify(formData));


  const validateForm = useCallback(() => {
    const isEndDateValid = new Date(safeFormData.product.end_date) > new Date(safeFormData.product.start_date);
    return (
      safeFormData.item.name.trim() !== '' &&
      safeFormData.item.description.trim() !== '' &&
      safeFormData.product.start_price > 0 &&
      safeFormData.product.end_date !== '' &&
      isEndDateValid &&
      (!safeFormData.product.buy_now || safeFormData.product.buy_now_price > 0)
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData({
      ...formData,
      item: {
        ...formData.item,
        [name]: type === 'checkbox' ? checked : value,
      },
    });
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    if (name === 'start_price') {
      updateFormData({
        ...formData,
        product: {
          ...formData.product,
          [name]: inputValue,
          current_price: inputValue,
        },
      });
    } else if (name === 'start_date' || name === 'end_date') {
      updateFormData({
        ...formData,
        product: {
          ...formData.product,
          [name]: new Date(value).toISOString(),
        },
      });
    } else {
      updateFormData({
        ...formData,
        product: {
          ...formData.product,
          [name]: inputValue,
        },
      });
    }
  };

  const handleReset = () => {
    updateFormData({
      product: {
        start_price: 0,
        current_price: 0,
        buy_now: false,
        buy_now_price: 0,
        start_date: new Date().toISOString(),
        end_date: '',
        users_id: sessionStorage.getItem('_user')
          ? JSON.parse(sessionStorage.getItem('_user')).id
          : '',
        private: false,
        participants: [],
        status: 'pending',
      },
      item: {
        name: '',
        description: '',
        category_id: '',
        sub_category_id: '',
      },
    });
  };

  // const handleNext = () => {
  //   if (!validateForm()) return;
  //   setLoading(true);
  //   sessionStorage.setItem('product', JSON.stringify(formData));
  //   setTimeout(() => {
  //     setLoading(false);
  //     handleStepChange(activeStep + 1);
  //   }, 1000);
  // };

  const handleNext = () => {
    if (loading) return; 
    setLoading(true);
    sessionStorage.setItem('product', JSON.stringify(formData));
    setTimeout(() => {
      setLoading(false);
      handleStepChange(activeStep + 1);  // ProgressTracker will handle validation
    }, 1000);
  };

  const formatDateForInput = (isoString) => {
    return isoString ? isoString.slice(0, 16) : '';
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className="bg-white rounded-lg p-10 mb-4 mt-4">
          <h5 className="text-xl font-bold mb-4">
            Fill in the basic information about your item
          </h5>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid gap-6 md:grid-cols-2 sm:grid-cols-1"
          >
            {/* Left Side */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-black font-semibold">
                  Product name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Graphic card GIGABYTE GeForce RTX 3050"
                  value={formData.item.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  maxLength={60}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.item.name.length}/60
                </p>
              </div>

              <div>
                <label className="block text-black font-semibold">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product details..."
                  value={formData.item.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100 h-60 sm:h-60"
                  maxLength={1200}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.item.description.length}/1200
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-black font-semibold">
                  <input
                    type="checkbox"
                    name="buy_now"
                    checked={formData.product.buy_now}
                    onChange={handleProductChange}
                    className="mr-2"
                  />
                  Buy Now
                </label>
                {formData.product.buy_now && (
                  <div className="mt-2">
                    <label className="block text-black font-semibold">
                      Buy Now Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="buy_now_price"
                      placeholder="Buy Now price"
                      value={formData.product.buy_now_price}
                      onChange={handleProductChange}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                      min="1"
                      required
                    />
                  </div>
                )}
                <p className="text-sm text-maroon mt-1">
                  Make sure the <strong>Buy Now Price</strong> is higher than the <strong>Initial Price</strong>
                </p>
              </div>

              <div>
                <label className="block text-black font-semibold">
                  Initial price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="start_price"
                  placeholder="Product price"
                  value={formData.product.start_price}
                  onChange={handleProductChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-semibold">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formatDateForInput(formData.product.start_date)}
                  onChange={handleProductChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-black font-semibold">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formatDateForInput(formData.product.end_date)}
                  onChange={handleProductChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  required
                />
                {formData.product.end_date && new Date(formData.product.end_date) <= new Date(formData.product.start_date) && (
                  <p className="text-red-500 text-sm mt-1">
                    End date must be after start date.
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleReset}
                type="button"
                className="flex flex-row item-center justify-evenly w-1/3 py-4 bg-gray-500 text-white rounded-full focus:outline-none hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                onClick={handleNext}
                type="button"
                disabled={!validateForm() || loading}
                className={`flex flex-row item-center justify-evenly w-1/3 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon ${
                  !validateForm() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next
                {loading && <Loader className="ml-2 w-5 h-5" />}
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
  updateFormValidity: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default Description;