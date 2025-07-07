import { useState, useEffect } from "react";
import { PropTypes } from 'prop-types';
import arrowright from "../../../assets/svg/arrow-right.svg";
import x from "../../../assets/svg/x.svg";
import { current } from "../../../utils";
import Loader from '../../../assets/loader2';

const Categories = ({ 
  handleStepChange, 
  activeStep,
  updateFormValidity,
  formData,
  updateFormData
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setcatLoading] = useState(false);

  // Add form validation effect
  useEffect(() => {
    const isValid = selectedCategories.length > 0;
    updateFormValidity(activeStep, isValid);
  }, [selectedCategories, activeStep, updateFormValidity]);

  useEffect(() => {
    setcatLoading(true);
    let endpoint = `${current}categories`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setCategories(data.data);
        setcatLoading(false);
      })
      .catch((error) => console.error('Error fetching categories: ', error));
  }, []);

  const handleCheckboxChange = (item) => {
    console.log(item);
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(item)) {
        setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
        return prevSelected.filter((category) => category.name !== item.name);
      } else {
        if (prevSelected.length >= 1) {
          alert('You can only select up to 1 categories.');
          return prevSelected;
        }
        setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
        return [...prevSelected, item];
      }
    });
  };

  const handleRemoveCategory = (item) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((category) => category.name !== item.name),
    );
    setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
  };

  // Add reset function
  const handleReset = () => {
    setSelectedCategories([]);
    setCheckedItems({});
    updateFormData({
      ...formData,
      item: {
        ...formData.item,
        category_id: '',
        sub_category_id: ''
      }
    });
  };

  const submit = async () => {
    const endpoint = `${current}auctions/`;
    let data = JSON.parse(sessionStorage.getItem('product')) || formData;
    data.item.category_id = selectedCategories[0]?.category_id;
    data.item.sub_category_id = selectedCategories[0]?.id;

    // Update form data in parent component
    updateFormData(data);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Product submitted successfully: ', data);
        sessionStorage.setItem('product', JSON.stringify(data));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error submitting product: ', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error submitting product: ', error);
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
      <div className="formatter mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:grid md:grid-cols-3 md:gap-6 p-6">
            {/* First Column (Main Categories - visible on larger screens) */}
            <div className="hidden md:block bg-white p-6 border-r border-gray-200">
              <h2 className="text-lg font-semibold mb-6 text-gray-800">
                Select Category
              </h2>
              <div className="h-[400px] overflow-y-auto">
                {[
                  'Electronics',
                  'Fashion',
                  'Home and Garden',
                  'Supermarket',
                  'Beauty',
                  'Culture',
                  'Sports and Tourism',
                  'Automotive',
                  'Properties',
                ].map((category, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full px-4 py-3 mb-2 text-left rounded-md hover:bg-gray-100 focus:outline-none transition"
                  >
                    <span className="text-sm md:text-base text-gray-800">
                      {category}
                    </span>
                    <img src={arrowright} alt="arrow" className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Second Column (Subcategories) */}
            <div className="md:col-span-2 bg-white p-5">
              <h2 className="block md:hidden text-lg font-semibold mb-4 text-gray-800">
                Select Subcategory
              </h2>
              {catLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] md:max-h-[400px]">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-md shadow-sm"
                    >
                      <p className="text-sm md:text-base text-black font-bold mb-2">
                        {category.name}
                      </p>
                      {category.subcategories.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-2 py-1"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 md:w-5 md:h-5 border rounded-full border-gray-200 accent-maroon"
                            checked={checkedItems[item.name] || false}
                            onChange={() =>
                              handleCheckboxChange({
                                ...item,
                                category_id: category.id,
                              })
                            }
                          />
                          <p className="text-xs md:text-sm">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Categories and Buttons */}
          <div className="bg-gray-100 p-6 rounded-b-lg">
            <p className="font-semibold mb-4">
              Selected category:{' '}
              {selectedCategories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center bg-white rounded-full px-3 py-1 mr-2 text-xs md:text-sm"
                >
                  {category.name}
                  <img
                    src={x}
                    alt="Remove"
                    className="w-3 h-3 ml-2 cursor-pointer"
                    onClick={() => handleRemoveCategory(category)}
                  />
                </span>
              ))}
            </p>

            <div className="flex items-center justify-between"> {/* Changed to space-between */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleStepChange(activeStep - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                >
                  Previous
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                >
                  Reset
                </button>
              </div>
              
              <button
                onClick={async () => {
                  setLoading(true);
                  (await submit()) && handleStepChange(activeStep + 1);
                  setLoading(false);
                }}
                type="button"
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon ${
                  selectedCategories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={selectedCategories.length === 0 || loading}
              >
                Next
                {loading && <Loader className="ml-2 w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Categories.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  updateFormValidity: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default Categories;