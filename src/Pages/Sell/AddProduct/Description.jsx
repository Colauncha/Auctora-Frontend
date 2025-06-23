import { useState, useEffect, useRef, useCallback } from 'react'; // Added useRef
import { PropTypes } from 'prop-types';
import Loader from '../../../assets/loaderWhite';

const Description = ({
  handleStepChange,
  activeStep,
  updateFormValidity,
  formData = {
    item: {
      name: '',
      description: '',
      category_id: '',
      sub_category_id: '',
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
      refundable: false,
      private: false,
      participants: [],
      status: 'pending',
    },
  },
  updateFormData,
}) => {
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const prevValidityRef = useRef();

  const safeFormData = JSON.parse(JSON.stringify(formData));

  const validateForm = useCallback(() => {
    const isEndDateValid =
      new Date(safeFormData.product.end_date) >
      new Date(safeFormData.product.start_date);
    return (
      safeFormData.item.name.trim() !== '' &&
      safeFormData.item.description.trim() !== '' &&
      safeFormData.product.start_price > 0 &&
      safeFormData.product.end_date !== '' &&
      isEndDateValid &&
      (!safeFormData.product.buy_now || safeFormData.product.buy_now_price > 0)
    );
  }, [safeFormData]);

  useEffect(() => {
    const isValid = validateForm();
    if (isValid !== prevValidityRef.current) {
      updateFormValidity(activeStep, isValid);
      prevValidityRef.current = isValid;
    }
    console.log(`Validity: ${isValid}`);
    console.log(`Active Step: ${activeStep}`);
  }, [formData, activeStep, updateFormValidity, validateForm]);

  useEffect(() => {
    console.log('Form Data:', formData.product);
  }, [formData.product]);

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

  const handleParticipantsChange = (e) => {
    const { value } = e.target;
    if (
      value.trim()[value.length - 1] === ',' ||
      e.key === 'Enter' ||
      e.key === ','
    ) {
      e.preventDefault();
      const newParticipants = value
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email !== '');
      const uniqueParticipants = Array.from(
        new Set([...participants, ...newParticipants]),
      );
      setParticipants(uniqueParticipants);
      updateFormData({
        ...formData,
        product: {
          ...formData.product,
          participants: uniqueParticipants,
        },
      });
      e.target.value = ''; // Clear input after adding participants
    }
  };

  const removeParticipant = (value) => {
    const updatedParticipants = participants.filter(
      (participant) => participant !== value,
    );
    setParticipants(updatedParticipants);
    updateFormData({
      ...formData,
      product: {
        ...formData.product,
        participants: updatedParticipants,
      },
    });
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
        refundable: false,
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

  const handleNext = () => {
    if (loading) return;
    setLoading(true);
    sessionStorage.setItem('product', JSON.stringify(formData));
    setTimeout(() => {
      setLoading(false);
      handleStepChange(activeStep + 1); // ProgressTracker will handle validation
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
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100 h-[400px] sm:h-[400px]"
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
              <div className="group relative">
                <label className="block text-black font-semibold">
                  <input
                    type="checkbox"
                    name="refundable"
                    checked={formData.product.refundable}
                    onChange={handleProductChange}
                    className="mr-2"
                  />
                  Allow Refund
                </label>
                <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                  If selected the buyer can choose to request a{' '}
                  <strong>refund </strong> if they are not satistfied with the
                  product.
                </span>
              </div>

              <div>
                <label className="block text-black font-semibold">
                  Initial price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="start_price"
                  placeholder="Product price"
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
                {formData.product.end_date &&
                  new Date(formData.product.end_date) <=
                    new Date(formData.product.start_date) && (
                    <p className="text-red-500 text-sm mt-1">
                      End date must be after start date.
                    </p>
                  )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Now Price{' '}
                  {formData.product.buy_now && (
                    <span className="text-red-500">*</span>
                  )}
                </label>

                {/* Fused input container - minimal */}
                <div className="flex items-center border-2 border-gray-100 rounded-md shadow-sm focus-within:border-[#9F3247] transition-colors bg-white overflow-hidden">
                  {/* Checkbox section */}
                  <label className="flex items-center gap-2 px-3 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      name="buy_now"
                      checked={formData.product.buy_now}
                      onChange={handleProductChange}
                      className="w-4 h-4 text-[#9F3247] bg-white border-2 border-gray-300 rounded focus:ring-[#9F3247] focus:ring-1"
                    />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Buy Now
                    </span>
                  </label>

                  {/* Price input section */}
                  <input
                    type="number"
                    name="buy_now_price"
                    onChange={handleProductChange}
                    disabled={!formData.product.buy_now}
                    placeholder={
                      formData.product.buy_now
                        ? 'Enter Buy Now price'
                        : 'Check Buy Now box to enable'
                    }
                    className={`flex-1 px-3 py-3 bg-white border-none outline-none transition-all ${
                      !formData.product.buy_now
                        ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                        : 'text-gray-900'
                    }`}
                    required={formData.product.buy_now}
                    min={1}
                  />
                </div>
                <p className="text-sm text-maroon mt-1">
                  Make sure the <strong>Buy Now Price</strong> is higher than
                  the <strong>Initial Price</strong>
                </p>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants [comma separated] (optional)
                </label>

                {/* Fused input container - minimal */}
                <div className="flex items-center border-2 border-gray-100 rounded-md shadow-sm focus-within:border-[#9F3247] transition-colors bg-white overflow-hidden">
                  {/* Checkbox section */}
                  <label className="flex items-center gap-2 px-3 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      name="private"
                      checked={formData.product.private}
                      onChange={handleProductChange}
                      className="w-4 h-4 text-[#9F3247] bg-white border-2 border-gray-300 rounded focus:ring-[#9F3247] focus:ring-1"
                    />
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Private
                    </span>
                  </label>

                  {/* Price input section */}
                  <input
                    type="text"
                    name="participants"
                    onChange={(e) => handleParticipantsChange(e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleParticipantsChange(e);
                      }
                    }}
                    disabled={!formData.product.private}
                    placeholder={
                      formData.product.private
                        ? 'Enter invited participants email addresses'
                        : 'Check private box to enable'
                    }
                    className={`flex-1 px-3 py-3 bg-white border-none outline-none transition-all ${
                      !formData.product.private
                        ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                        : 'text-gray-900'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-2 py-3">
                  {participants.map((participant, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-3 bg-gray-200 text-gray-800 px-2 py-2 rounded-full text-xs"
                    >
                      <span>{participant}</span>
                      <span
                        className="text-[12px] cursor-pointer hover:text-[14px] transition-text duration-200"
                        onClick={() => removeParticipant(participant)}
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>
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
                {loading ? (
                  <Loader otherStyles="h-[25px] w-[25px] border-2 bg-[rgba(230, 84, 113, 0.59)]" />
                ) : (
                  'Next'
                )}
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