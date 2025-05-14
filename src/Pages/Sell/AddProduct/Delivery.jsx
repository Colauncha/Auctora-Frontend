import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import LoaderW from '../../../assets/loaderWhite';
import { current } from '../../../utils';
import Alerts from '../../../Components/alerts/Alerts';

const Delivery = ({
  activeStep,
  handleStepChange,
  formData, // Added to sync with ProgressTracker
  updateFormData, // Added to sync with ProgressTracker
  updateFormValidity,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(
    formData.delivery?.options || [],
  );
  const [pickupAddress, setPickupAddress] = useState(
    formData.delivery?.address || '',
  );
  const [useHomeAddress, setUseHomeAddress] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(false);
  const [pickupLongitude, setPickupLongitude] = useState(
    formData.delivery?.pickup_longitude || null,
  );
  const [pickupLatitude, setPickupLatitude] = useState(
    formData.delivery?.pickup_latitude || null,
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: 'warn',
    message: '',
    detail: '',
  });

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 10000);
  };

  const reverseGeocode = async (lat, lon) => {
    setLoading(true);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'Biddius/1.0 (https://biddius.com)',
        },
      },
    );
    const data = await response.json();
    setLoading(false);
    if (data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error('No address found');
    }
  };

  const toggleCurrentLocation = async () => {
    const enable = !currentLocation;

    console.log(enable);
    if (!enable) {
      setPickupLatitude(null);
      setPickupLongitude(null);
      setCurrentLocation(false);
      return;
    }

    if (!navigator.geolocation) {
      showAlert(
        'fail',
        'Geolocation not supported',
        'Please enable location services in your browser settings',
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setPickupLatitude(latitude);
        setPickupLongitude(longitude);
        setCurrentLocation(true);
        if (enable) {
          try {
            const address = await reverseGeocode(latitude, longitude);
            setPickupAddress(address);
          } catch (err) {
            showAlert('warn', 'Could not get address', err.message);
          }
        }
      },
      (error) => {
        showAlert(
          'fail',
          'Error',
          error.message || 'Unable to retrieve your location',
        );
      },
    );
  };

  // Update form validity and sync with ProgressTracker
  useEffect(() => {
    const isValid = selectedOptions.length > 0;
    updateFormValidity(activeStep, isValid);

    // Update parent form data
    updateFormData({
      ...formData,
      delivery: {
        options: selectedOptions,
        address: pickupAddress,
        pickup_longitude: pickupLongitude,
        pickup_latitude: pickupLatitude,
      },
    });
  }, [selectedOptions, pickupAddress, pickupLatitude, pickupLongitude]);

  const handleReset = () => {
    setSelectedOptions([]);
    setPickupAddress('');
    setUseHomeAddress(false);
    setCurrentLocation(false);
    setPickupLongitude(null);
    setPickupLatitude(null);
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleNext = async () => {
    if (selectedOptions.length === 0) {
      showAlert(
        'warn',
        'Please select at least one delivery option',
        'This field is required',
      );
      return;
    }

    setLoading(true);

    const { item, product, delivery, photos: photoEntries } = formData;
    const photos = photoEntries.map((photo) => photo.file);

    const payload = JSON.stringify({
      item,
      ...product,
      ...delivery,
    });

    console.log('Submitting data:', payload, photos);

    const runFetch = async ({ endpoint, method, data, isFormData = false }) => {
      const headers = isFormData ? {} : { 'Content-Type': 'application/json' };

      const response = await fetch(endpoint, {
        method,
        headers,
        body: data,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'An error occurred during request');
      }

      return result;
    };

    try {
      const postEndpoint = `${current}auctions/`;
      const created = await runFetch({
        endpoint: postEndpoint,
        method: 'POST',
        data: payload,
      });

      showAlert(
        'success',
        'Product Submitted successfully',
        'Uploading product images',
      );
      console.log('Product created:', created);

      const itemId = created?.data.item?.[0]?.id;
      if (!itemId) throw new Error('Missing item ID from response');

      const imgEndpoint = `${current}items/upload_images?item_id=${itemId}`;
      const formData_ = new FormData();
      photos.forEach((image, index) => {
        if (image) formData_.append(`image${index + 1}`, image);
      });

      const uploadResp = await runFetch({
        endpoint: imgEndpoint,
        method: 'PUT',
        data: formData_,
        isFormData: true,
      });

      console.log('Image upload response:', uploadResp);

      showAlert(
        'success',
        'Product images uploaded successfully',
        'Your product images have been uploaded successfully',
      );

      setLoading(false);
      navigate('/product-success');
    } catch (error) {
      console.error(error);
      showAlert(
        'fail',
        'Submission Failed',
        error.message || 'An error occurred during submission',
      );
      setLoading(false);
    }
  };

  const handleUseHome = (currentValue) => {
    const nextValue = !currentValue;
    setUseHomeAddress(nextValue);

    if (nextValue) {
      const user = JSON.parse(sessionStorage.getItem('_user'));
      if (user?.address) {
        setPickupAddress(user.address);
      }
    } else {
      setPickupAddress('');
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      {alertT.isAlert && (
        <Alerts
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      <div className="formatter">
        <div className="bg-white rounded-lg p-6 md:p-10 mb-4 mt-4">
          <h4 className="w-full text-xl font-bold mb-4 md:mb-6">
            Select delivery options <span className="text-red-500">*</span>
          </h4>

          <div className="space-y-3 md:space-y-4 text-xs md:text-sm">
            {['Self pickup', 'Courier delivery'].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer w-full md:w-1/2 lg:w-1/3 mt-1 p-2 md:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                  disabled={option === 'Courier delivery' ? true : false}
                  className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-400 text-red-800 focus:ring-red-800"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="text-sm md:text-base font-medium">Pickup Address</h3>
            <label className="flex items-center space-x-2 cursor-pointer w-[30%] md:w-1/2 lg:w-1/3 mt-1 p-2 md:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={currentLocation}
                onChange={toggleCurrentLocation}
                disabled={false}
                className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-400 text-red-800 focus:ring-red-800"
              />
              <span className="text-gray-700">
                Use current location{' '}
                {currentLocation && `[${pickupLatitude} - ${pickupLongitude}]`}
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer w-[30%] md:w-1/2 lg:w-1/3 mt-1 p-2 md:p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={useHomeAddress}
                onChange={() => handleUseHome(useHomeAddress)}
                disabled={false}
                className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-400 text-red-800 focus:ring-red-800"
              />
              <span className="text-gray-700">Use Home address</span>
            </label>
            <input
              type="text"
              name="date"
              placeholder="Specify pickup Address"
              value={pickupAddress}
              disabled={
                selectedOptions.includes('Self pickup') && !useHomeAddress
                  ? false
                  : true
              }
              onChange={(e) => setPickupAddress(e.target.value)}
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
                  selectedOptions.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-maroon hover:to-maroon'
                }`}
              >
                {loading ? (
                  <LoaderW otherStyles="w-[25px] h-[25px] border-2 mx-2" />
                ) : (
                  'Submit'
                )}
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