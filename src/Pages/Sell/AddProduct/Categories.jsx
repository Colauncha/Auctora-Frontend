// import { useState, useEffect, useRef } from "react"; // Add useRef
// import { PropTypes } from 'prop-types';
// import arrowright from "../../../assets/svg/arrow-right.svg";
// import x from "../../../assets/svg/x.svg";
// import { current } from "../../../utils";
// import Loader from '../../../assets/loader2';
// import LoaderW from '../../../assets/loaderWhite';
// import Alerts from '../../../Components/alerts/Alerts';

// const Categories = ({
//   handleStepChange,
//   activeStep,
//   updateFormValidity,
//   formData,
//   updateFormData,
// }) => {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [checkedItems, setCheckedItems] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [catLoading, setcatLoading] = useState(false);
//   const [alertT, setAlert] = useState({
//     isAlert: false,
//     level: '',
//     message: '',
//     detail: '',
//   });

//   const prevValidityRef = useRef(false);

//   const showAlert = (level, message, detail = '') => {
//     setAlert({ isAlert: true, level, message, detail });
//     setTimeout(() => {
//       setAlert({ isAlert: false, level: '', message: '', detail: '' });
//     }, 5000);
//   };

//   // Add form validation effect
//   useEffect(() => {
//     const isValid = selectedCategories.length > 0;
//     if (isValid !== prevValidityRef.current) {
//       updateFormValidity(activeStep, isValid);
//       prevValidityRef.current = isValid;

//       // Update form data only when validity changes
//       updateFormData({
//         ...formData,
//         item: {
//           ...formData.item,
//           category_id: isValid ? selectedCategories[0]?.category_id : '',
//           sub_category_id: isValid ? selectedCategories[0]?.id : '',
//         },
//       });
//     }
//   }, [
//     selectedCategories,
//     activeStep,
//     updateFormValidity,
//     formData,
//     updateFormData,
//   ]);

//   useEffect(() => {
//     setcatLoading(true);
//     let endpoint = `${current}categories`;
//     fetch(endpoint)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.data);
//         setCategories(data.data);
//         setcatLoading(false);
//       })
//       .catch((error) => console.error('Error fetching categories: ', error));
//   }, []);

//   const handleCheckboxChange = (item) => {
//     console.log(item);
//     setSelectedCategories((prevSelected) => {
//       if (prevSelected.includes(item)) {
//         setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
//         return prevSelected.filter((category) => category.name !== item.name);
//       } else {
//         if (prevSelected.length >= 1) {
//           showAlert(
//             'warn',
//             'Maximum 1 category allowed',
//             'You can only select up to 1 categories.',
//           );
//           // alert('You can only select up to 1 categories.');
//           return prevSelected;
//         }
//         setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
//         return [...prevSelected, item];
//       }
//     });
//   };

//   const handleRemoveCategory = (item) => {
//     setSelectedCategories((prevSelected) =>
//       prevSelected.filter((category) => category.name !== item.name),
//     );
//     setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
//   };

//   // Add reset function
//   const handleReset = () => {
//     setSelectedCategories([]);
//     setCheckedItems({});
//     updateFormData({
//       ...formData,
//       item: {
//         ...formData.item,
//         category_id: '',
//         sub_category_id: '',
//       },
//     });
//   };

//   const submit = () => {
//     setLoading(true);
//     updateFormData({
//       ...formData,
//       item: {
//         ...formData.item,
//         category_id: selectedCategories[0]?.category_id,
//         sub_category_id: selectedCategories[0]?.id,
//       },
//     });
//     let data = formData;
//     sessionStorage.setItem('product', JSON.stringify(data));
//     setTimeout(() => {
//       setLoading(false);
//       handleStepChange(activeStep + 1);
//     }, 1000);
//     return true;
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
//       {alertT.isAlert && (
//         <Alerts
//           key={`${alertT.level}-${alertT.message}`}
//           message={alertT.message}
//           detail={alertT.detail}
//           type={alertT.level}
//         />
//       )}
//       <div className="formatter mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="md:grid md:grid-cols-3 md:gap-6 p-6">
//             {/* First Column (Main Categories - visible on larger screens) */}
//             <div className="hidden md:block bg-white p-6 border-r border-gray-200">
//               <h2 className="text-lg font-semibold mb-6 text-gray-800">
//                 Select Category
//               </h2>
//               <div className="h-[400px] overflow-y-auto">
//                 {[
//                   'Electronics',
//                   'Fashion',
//                   'Home and Garden',
//                   'Supermarket',
//                   'Beauty',
//                   'Culture',
//                   'Sports and Tourism',
//                   'Automotive',
//                   'Properties',
//                 ].map((category, index) => (
//                   <button
//                     key={index}
//                     className="flex items-center justify-between w-full px-4 py-3 mb-2 text-left rounded-md hover:bg-gray-100 focus:outline-none transition"
//                   >
//                     <span className="text-sm md:text-base text-gray-800">
//                       {category}
//                     </span>
//                     <img src={arrowright} alt="arrow" className="w-4 h-4" />
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Second Column (Subcategories) */}
//             <div className="md:col-span-2 bg-white p-5">
//               <h2 className="block md:hidden text-lg font-semibold mb-4 text-gray-800">
//                 Select Subcategory
//               </h2>
//               {catLoading ? (
//                 <div className="flex items-center justify-center h-[300px]">
//                   <Loader />
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] md:max-h-[400px]">
//                   {categories.map((category, index) => (
//                     <div
//                       key={index}
//                       className="bg-gray-50 p-4 rounded-md shadow-sm"
//                     >
//                       <p className="text-sm md:text-base text-black font-bold mb-2">
//                         {category.name}
//                       </p>
//                       {category.subcategories.map((item, itemIndex) => (
//                         <div
//                           key={itemIndex}
//                           className="flex items-center gap-2 py-1"
//                         >
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4 md:w-5 md:h-5 border rounded-full border-gray-200 accent-maroon"
//                             checked={checkedItems[item.name] || false}
//                             onChange={() =>
//                               handleCheckboxChange({
//                                 ...item,
//                                 category_id: category.id,
//                               })
//                             }
//                           />
//                           <p className="text-xs md:text-sm">{item.name}</p>
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Selected Categories and Buttons */}
//           <div className="bg-gray-100 p-6 rounded-b-lg">
//             <p className="font-semibold mb-4">
//               Selected category:{' '}
//               {selectedCategories.map((category) => (
//                 <span
//                   key={category.id}
//                   className="inline-flex items-center bg-white rounded-full px-3 py-1 mr-2 text-xs md:text-sm"
//                 >
//                   {category.name}
//                   <img
//                     src={x}
//                     alt="Remove"
//                     className="w-3 h-3 ml-2 cursor-pointer"
//                     onClick={() => handleRemoveCategory(category)}
//                   />
//                 </span>
//               ))}
//             </p>

//             <div className="flex items-center justify-between">
//               {' '}
//               {/* Changed to space-between */}
//               <div className="flex space-x-4">
//                 <button
//                   onClick={() => handleStepChange(activeStep - 1)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={handleReset}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
//                 >
//                   Reset
//                 </button>
//               </div>
//               <button
//                 onClick={() => submit()}
//                 type="button"
//                 className={`inline-flex items-center px-5 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon ${
//                   selectedCategories.length === 0
//                     ? 'opacity-50 cursor-not-allowed'
//                     : ''
//                 }`}
//                 disabled={selectedCategories.length === 0 || loading}
//               >
//                 {loading ? (
//                   <LoaderW otherStyles="h-[20px] w-[20px] border-2" />
//                 ) : (
//                   'Next'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Categories.propTypes = {
//   handleStepChange: PropTypes.func.isRequired,
//   activeStep: PropTypes.number.isRequired,
//   updateFormValidity: PropTypes.func.isRequired,
//   formData: PropTypes.object.isRequired,
//   updateFormData: PropTypes.func.isRequired,
// };

// export default Categories;



import { useState, useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import arrowright from "../../../assets/svg/arrow-right.svg";
import x from "../../../assets/svg/x.svg";
import { current } from "../../../utils";
import Loader from "../../../assets/loader2";
import LoaderW from "../../../assets/loaderWhite";
import Alerts from "../../../Components/alerts/Alerts";

const Categories = ({
  handleStepChange,
  activeStep,
  updateFormValidity,
  formData,
  updateFormData,
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: "",
    message: "",
    detail: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const prevValidityRef = useRef(false);

  const showAlert = (level, message, detail = "") => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: "", message: "", detail: "" });
    }, 5000);
  };

  useEffect(() => {
    const isValid = selectedCategories.length > 0;
    if (isValid !== prevValidityRef.current) {
      updateFormValidity(activeStep, isValid);
      prevValidityRef.current = isValid;

      updateFormData({
        ...formData,
        item: {
          ...formData.item,
          category_id: isValid ? selectedCategories[0]?.category_id : "",
          sub_category_id: isValid ? selectedCategories[0]?.id : "",
        },
      });
    }
  }, [
    selectedCategories,
    activeStep,
    updateFormValidity,
    formData,
    updateFormData,
  ]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setCatLoading(true);
    fetch(`${current}categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
        setFilteredCategories(data.data);
        setCatLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories: ", error);
        setCatLoading(false);
      });
  };

  const handleCheckboxChange = (item) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.some((c) => c.id === item.id)) {
        setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
        return prevSelected.filter((c) => c.id !== item.id);
      } else {
        if (prevSelected.length >= 1) {
          showAlert(
            "warn",
            "Maximum 1 category allowed",
            "You can only select up to 1 category."
          );
          return prevSelected;
        }
        setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
        return [...prevSelected, item];
      }
    });
  };

  const handleRemoveCategory = (item) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((category) => category.name !== item.name)
    );
    setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setCheckedItems({});
    updateFormData({
      ...formData,
      item: {
        ...formData.item,
        category_id: "",
        sub_category_id: "",
      },
    });
    setSelectedCategoryObj(null);
  };

  const submit = () => {
    setLoading(true);
    updateFormData({
      ...formData,
      item: {
        ...formData.item,
        category_id: selectedCategories[0]?.category_id,
        sub_category_id: selectedCategories[0]?.id,
      },
    });
    let data = formData;
    sessionStorage.setItem("product", JSON.stringify(data));
    setTimeout(() => {
      setLoading(false);
      handleStepChange(activeStep + 1);
    }, 1000);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    fetch(`${current}categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newCategoryName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setCategories((prev) => [...prev, data.data]);
          setFilteredCategories((prev) => [...prev, data.data]);
          showAlert("success", "Category added", "It has been added successfully");
          setNewCategoryName("");
        } else {
          showAlert("error", "Failed to add category", data.message || "Unknown error");
        }
      })
      .catch((err) => {
        console.error(err);
        showAlert("error", "Error adding category", "Please try again.");
      });
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
      {alertT.isAlert && (
        <Alerts
          key={`${alertT.level}-${alertT.message}`}
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      <div className="formatter mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:grid md:grid-cols-3 md:gap-6 p-6">
            {/* Left Panel: Categories List */}
            <div className="bg-white p-6 border-r border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Category</h2>

              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={handleSearch}
                className="mb-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />

              <div className="h-[300px] overflow-y-auto mb-3">
                {filteredCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryObj(category)}
                    className={`flex items-center justify-between w-full px-4 py-2 mb-2 text-left rounded-md transition ${
                      selectedCategoryObj?.id === category.id
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm text-gray-800">{category.name}</span>
                    <img src={arrowright} alt="arrow" className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new category"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-2 bg-maroon text-white rounded-md text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Right Panel: Subcategories */}
            <div className="md:col-span-2 bg-white p-5">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {selectedCategoryObj ? `Select Subcategory for "${selectedCategoryObj.name}"` : "Choose a category to view subcategories"}
              </h2>

              {catLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader />
                </div>
              ) : selectedCategoryObj ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] md:max-h-[400px]">
                  {selectedCategoryObj.subcategories.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        className="w-4 h-4 md:w-5 md:h-5 border rounded-full border-gray-200 accent-maroon"
                        checked={checkedItems[item.name] || false}
                        onChange={() =>
                          handleCheckboxChange({
                            ...item,
                            category_id: selectedCategoryObj.id,
                          })
                        }
                      />
                      <p className="text-xs md:text-sm">{item.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No category selected.</p>
              )}
            </div>
          </div>

          {/* Bottom: Selected & Navigation */}
          <div className="bg-gray-100 p-6 rounded-b-lg">
            <p className="font-semibold mb-4">
              Selected category:{" "}
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

            <div className="flex items-center justify-between">
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
                onClick={submit}
                type="button"
                className={`inline-flex items-center px-5 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon ${
                  selectedCategories.length === 0 || loading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={selectedCategories.length === 0 || loading}
              >
                {loading ? (
                  <LoaderW otherStyles="h-[20px] w-[20px] border-2" />
                ) : (
                  "Next"
                )}
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