// import { useState, useEffect } from "react";
// import { PropTypes } from 'prop-types';
// import arrowright from "../../../assets/svg/arrow-right.svg";
// import x from "../../../assets/svg/x.svg";
// import { current } from "../../../utils";
// import Loader from '../../../assets/loader2';

// const Categories = ({ handleStepChange, activeStep }) => {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [checkedItems, setCheckedItems] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [catLoading, setcatLoading] = useState(false);

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
//         // Uncheck the checkbox
//         setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
//         return prevSelected.filter((category) => category.name !== item.name);
//       } else {
//         if (prevSelected.length >= 1) {
//           alert('You can only select up to 1 categories.');
//           return prevSelected;
//         }
//         // Check the checkbox
//         setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
//         return [...prevSelected, item];
//       }
//     });
//   };

//   const handleRemoveCategory = (item) => {
//     setSelectedCategories((prevSelected) =>
//       prevSelected.filter((category) => category.name !== item.name),
//     );
//     // Uncheck the checkbox when removing the category
//     setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
//   };

//   const submit = async () => {
//     const endpoint = `${current}auctions/`;
//     let data = JSON.parse(sessionStorage.getItem('product'));
//     data.item.category_id = selectedCategories[0].category_id;
//     data.item.sub_category_id = selectedCategories[0].id;

//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(data),
//         credentials: 'include',
//       });
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Product submitted successfully: ', data);
//         sessionStorage.setItem('product', JSON.stringify(data));
//         return true;
//       } else {
//         const errorData = await response.json();
//         console.error('Error submitting product: ', errorData);
//         return false;
//       }
//     } catch (error) {
//       console.error('Error submitting product: ', error);
//     }
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
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

//           {/* Selected Categories and Next Button */}
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

//             <div className="flex items-center justify-end">
//               <button
//                 onClick={async () => {
//                   setLoading(true);
//                   (await submit())
//                     ? handleStepChange(activeStep + 1)
//                     : () => {};
//                   setLoading(false);
//                 }}
//                 type="button"
//                 className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
//                 disabled={selectedCategories.length === 0 || loading}
//               >
//                 Next
//                 {loading && <Loader className="ml-2 w-5 h-5" />}
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
// };

// export default Categories;



import { useState, useEffect } from "react";
import { PropTypes } from 'prop-types';
import arrowright from "../../../assets/svg/arrow-right.svg";
import x from "../../../assets/svg/x.svg";
import { current } from "../../../utils";
import Loader from '../../../assets/loader2';

const Categories = ({ handleStepChange, activeStep }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState('All Subcategories');

  useEffect(() => {
    setCatLoading(true);
    fetch(`${current}categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
        setCatLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories: ', error);
        setCatLoading(false);
      });
  }, []);

  const handleCheckboxChange = (item) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.some(cat => cat.id === item.id)) {
        setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
        return prevSelected.filter((category) => category.id !== item.id);
      } else {
        if (prevSelected.length >= 1) {
          alert('You can only select up to 1 category.');
          return prevSelected;
        }
        setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
        return [...prevSelected, item];
      }
    });
  };

  const handleRemoveCategory = (item) => {
    setSelectedCategories(prev => prev.filter(cat => cat.id !== item.id));
    setCheckedItems(prev => ({ ...prev, [item.name]: false }));
  };

  const submit = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return false;
    }

    const endpoint = `${current}auctions/`;
    let data = JSON.parse(sessionStorage.getItem('product'));
    data.item.category_id = selectedCategories[0].category_id;
    data.item.sub_category_id = selectedCategories[0].id;

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
        const responseData = await response.json();
        sessionStorage.setItem('product', JSON.stringify(responseData));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error submitting product: ', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error submitting product: ', error);
      return false;
    }
  };

  const mainCategories = [
    'All Subcategories',
    'Electronics', 'Fashion', 'Home and Garden', 'Supermarket',
    'Beauty', 'Culture', 'Sports and tourism', 'Automotive', 'Properties'
  ];

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full px-4 sm:px-6 py-8">
      <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Select the category your goods belong to
        </h2>

        
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-300px)] sm:h-[calc(100vh-250px)] overflow-hidden">
          {/* Main Categories (Left)  */}
          <div className="w-full lg:w-64 bg-white p-4 rounded-lg border border-gray-200 overflow-y-auto" 
               style={{ minHeight: '400px' }}>

            <ul className="space-y-3">
              {mainCategories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActiveMainCategory(category)}
                    className={`flex items-center justify-between w-full p-2 rounded-md transition-colors ${activeMainCategory === category ? 'bg-[#F8E8EB] text-[#9F3247]' : 'hover:bg-gray-50'}`}
                  >
                    <span>{category}</span>
                    {category !== 'All Subcategories' && (
                      <img src={arrowright} alt="" className="w-3 h-3" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Subcategories (Right) */}
          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200 overflow-y-auto"
          style={{
            minHeight: window.innerWidth < 768 ? '600px' : '400px', // Adjust height dynamically
          }}
          >
            {catLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader />
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg text-[#9F3247] mb-4">
                  {activeMainCategory}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories
                    .filter(category => 
                      activeMainCategory === 'All Subcategories' || 
                      category.name.includes(activeMainCategory))
                    .map((category) => (
                      <div key={category.id} className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-[#9F3247] mb-2">{category.name}</h4>
                        <ul className="space-y-1">
                          {category.subcategories.map((item) => (
                            <li key={item.id}>
                              <label className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 border-2 border-gray-300 rounded text-[#9F3247] focus:ring-[#9F3247]"
                                  checked={checkedItems[item.name] || false}
                                  onChange={() => handleCheckboxChange({
                                    ...item,
                                    category_id: category.id,
                                  })}
                                />
                                <span className="text-gray-700">{item.name}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

 
        <p className="font-bold mb-6 mt-4">
          Selected categories:{' '}
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 m-1"
              >
                {category.name}
                <button
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-2"
                >
                  <img src={x} alt="Remove" className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500">None selected</span>
          )}
        </p>


<div className="mt-2 text-center">
  <button
    onClick={async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        
        const success = await submit();
        if (success) {
          handleStepChange(activeStep + 1); 
        } else {
          alert('Submission failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during submission: ', error);
        alert('An error occurred during submission. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    }}
    disabled={loading || selectedCategories.length === 0}
    className={`px-8 py-3 rounded-full text-white font-medium transition-colors ${selectedCategories.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-[#5e1a28] to-[#e65471] hover:from-[#9F3247] hover:to-[#9F3247]'}`}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <Loader className="w-5 h-5" />
        Processing...
      </span>
    ) : (
      'Next'
    )}
  </button>
</div>

      </div>
    </div>
  );
};

Categories.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default Categories;