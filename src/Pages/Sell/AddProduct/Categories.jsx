// import { useState, useEffect, useRef } from 'react';
// import { PropTypes } from 'prop-types';
// import arrowright from '../../../assets/svg/arrow-right.svg';
// import x from '../../../assets/svg/x.svg';
// import { current } from '../../../utils';
// import Loader from '../../../assets/loader2';
// import LoaderW from '../../../assets/loaderWhite';
// import { PlusSquare, CheckSquare2 } from 'lucide-react';
// import { toast } from 'react-toastify';

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
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [catLoading, setCatLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [newCategoryDesc, setNewCategoryDesc] = useState('');
//   const [addSubCat, setAddSubCat] = useState(false);
//   const [newSubCategoryName, setNewSubCategoryName] = useState('');

//   const prevValidityRef = useRef(false);

//   useEffect(() => {
//     const isValid = selectedCategories.length > 0;
//     if (isValid !== prevValidityRef.current) {
//       updateFormValidity(activeStep, isValid);
//       prevValidityRef.current = isValid;

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
//     fetchCategories();
//   }, []);

//   const fetchCategories = () => {
//     setCatLoading(true);
//     fetch(`${current}categories`)
//       .then((response) => response.json())
//       .then((data) => {
//         setCategories(data.data);
//         setFilteredCategories(data.data);
//         setCatLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching categories: ', error);
//         setCatLoading(false);
//       });
//   };

//   const handleCheckboxChange = (item) => {
//     setSelectedCategories((prevSelected) => {
//       if (prevSelected.some((c) => c.id === item.id)) {
//         setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
//         return prevSelected.filter((c) => c.id !== item.id);
//       } else {
//         if (prevSelected.length >= 1) {
//           toast.warn('You can only select up to 1 category.');
//           return prevSelected;
//         }
//         setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
//         return [...prevSelected, item];
//       }
//     });
//   };

//   const handleRemoveCategory = (item) => {
//     setSelectedCategories((prevSelected) =>
//       prevSelected.filter((category) => category.name !== item.name)
//     );
//     setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
//   };

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
//     setSelectedCategoryObj(null);
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
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = categories.filter((cat) =>
//       cat.name.toLowerCase().includes(query)
//     );
//     setFilteredCategories(filtered);
//   };

//   const handleAddCategory = async () => {
//     if (!newCategoryName.trim()) return;

//     try {
//       const res = await fetch(`${current}categories`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           name: newCategoryName,
//           description: newCategoryDesc,
//         }),
//       });

//       // Handle non-2xx responses
//       if (!res.ok) {
//         throw new Error(`Request failed with status ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         setCategories((prev) => [...prev, data.data]);
//         setFilteredCategories((prev) => [...prev, data.data]);

//         toast.success('Category added successfully');

//         setNewCategoryName('');
//         setNewCategoryDesc('');
//         fetchCategories();
//       } else {
//         throw new Error(data.message || 'Failed to add category');
//       }
//     } catch (err) {
//       console.error(err);

//       toast.error(
//         `Failed to add category: ${
//           err instanceof Error ? err.message : 'Unknown error'
//         }`
//       );
//       fetchCategories();
//     }
//   };

//   const handleAddSubCategory = async () => {
//     if (!newSubCategoryName.trim()) return;

//     try {
//       const res = await fetch(`${current}subcategories`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           name: newCategoryName,
//           parent_id: selectedCategoryObj.id,
//         }),
//       });

//       // Handle non-2xx responses
//       if (!res.ok) {
//         throw new Error(`Request failed with status ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         toast.success('Subcategory added successfully');

//         setNewSubCategoryName('');
//         fetchCategories();
//       } else {
//         throw new Error(data.message || 'Failed to add subcategory');
//       }
//     } catch (err) {
//       console.error(err);

//       toast.error(
//         `Failed to add subcategory: ${
//           err instanceof Error ? err.message : 'Unknown error'
//         }`
//       );
//       fetchCategories();
//     }
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
//       <div className="formatter mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="md:grid md:grid-cols-3 md:gap-6 p-6">
//             {/* Left Panel: Categories List */}
//             <div className="bg-white p-6 border-r border-gray-200">
//               <h2 className="text-lg font-semibold mb-4 text-gray-800">
//                 Select Category
//               </h2>

//               <input
//                 type="text"
//                 placeholder="Search category..."
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 className="mb-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
//               />

//               <div className="h-[300px] overflow-y-auto mb-3">
//                 {filteredCategories.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => setSelectedCategoryObj(category)}
//                     className={`flex items-center justify-between w-full px-4 py-2 mb-2 text-left rounded-md transition ${
//                       selectedCategoryObj?.id === category.id
//                         ? 'bg-gray-200 font-semibold'
//                         : 'hover:bg-gray-100'
//                     }`}
//                   >
//                     <span className="text-sm text-gray-800">
//                       {category.name}
//                     </span>
//                     <img src={arrowright} alt="arrow" className="w-4 h-4" />
//                   </button>
//                 ))}
//               </div>

//               <div className="flex flex-col gap-2">
//                 <input
//                   type="text"
//                   placeholder="Add new category"
//                   value={newCategoryName}
//                   onChange={(e) => setNewCategoryName(e.target.value)}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Describe category (<150 characters)"
//                   value={newCategoryDesc}
//                   onChange={(e) => setNewCategoryDesc(e.target.value)}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
//                 />
//                 <button
//                   onClick={handleAddCategory}
//                   className="px-3 py-2 bg-maroon text-white rounded-md text-sm"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>

//             {/* Right Panel: Subcategories */}
//             <div className="md:col-span-2 bg-white p-5">
//               <h2 className="text-lg font-semibold mb-4 text-gray-800">
//                 {selectedCategoryObj
//                   ? `Select Subcategory for "${selectedCategoryObj.name}"`
//                   : 'Choose a category to view subcategories'}
//               </h2>

//               {catLoading ? (
//                 <div className="flex items-center justify-center h-[300px]">
//                   <Loader />
//                 </div>
//               ) : selectedCategoryObj ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] md:max-h-[400px]">
//                   {selectedCategoryObj.subcategories.map((item, itemIndex) => (
//                     <div
//                       key={itemIndex}
//                       className="flex items-center gap-2 py-1"
//                     >
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 md:w-5 md:h-5 border rounded-full border-gray-200 accent-maroon"
//                         checked={checkedItems[item.name] || false}
//                         onChange={() =>
//                           handleCheckboxChange({
//                             ...item,
//                             category_id: selectedCategoryObj.id,
//                           })
//                         }
//                       />
//                       <p className="text-xs md:text-sm">{item.name}</p>
//                     </div>
//                   ))}
//                   <div
//                     className="flex items-center gap-2 py-1 cursor-pointer"
//                     onClick={() => setAddSubCat(true)}
//                   >
//                     <PlusSquare className="w-4 h-4 md:w-5 md:h-5 cursor-pointer" />
//                     {addSubCat ? (
//                       <input
//                         type="text"
//                         className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
//                         placeholder="Subcategory name"
//                         onChange={(e) => setNewSubCategoryName(e.target.value)}
//                       />
//                     ) : (
//                       <p className="text-xs md:text-sm">Add subcategory</p>
//                     )}
//                     <CheckSquare2
//                       className="w-4 h-4 md:w-5 md:h-5 cursor-pointer text-emerald-500"
//                       onClick={handleAddSubCategory}
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No category selected.</p>
//               )}
//             </div>
//           </div>

//           {/* Bottom: Selected & Navigation */}
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
//                 onClick={submit}
//                 type="button"
//                 className={`inline-flex items-center px-5 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon ${
//                   selectedCategories.length === 0 || loading
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

import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import arrowright from '../../../assets/svg/arrow-right.svg';
import x from '../../../assets/svg/x.svg';

import { current } from '../../../utils';

import Loader from '../../../assets/loader2';
import LoaderW from '../../../assets/loaderWhite';

import { PlusSquare, CheckSquare2 } from 'lucide-react';
import { toast } from 'react-toastify';

/* -------------------------------- Utils -------------------------------- */

const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
};

/* ------------------------------ Component ------------------------------- */

const Categories = ({
  handleStepChange,
  activeStep,
  updateFormValidity,
  formData,
  updateFormData,
}) => {
  /* ------------------------------- State ------------------------------- */

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const [searchQuery, setSearchQuery] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [addSubCat, setAddSubCat] = useState(false);

  /* ---------------------------- Loading States --------------------------- */

  const [catLoading, setCatLoading] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubCategory, setAddingSubCategory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const prevValidityRef = useRef(false);

  /* ----------------------------- Fetching ------------------------------ */

  const fetchCategories = useCallback(async () => {
    try {
      setCatLoading(true);

      const data = await apiFetch(`${current}categories`);

      setCategories(data.data || []);
      setFilteredCategories(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ------------------------- Form Validity Sync -------------------------- */

  useEffect(() => {
    const isValid = selectedCategories.length > 0;

    if (isValid !== prevValidityRef.current) {
      updateFormValidity(activeStep, isValid);

      prevValidityRef.current = isValid;

      updateFormData((prev) => ({
        ...prev,
        item: {
          ...prev.item,
          category_id: isValid ? selectedCategories[0]?.category_id : '',
          sub_category_id: isValid ? selectedCategories[0]?.id : '',
        },
      }));
    }
  }, [selectedCategories, activeStep, updateFormValidity, updateFormData]);

  /* ---------------------------- Handlers ---------------------------- */

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();

    setSearchQuery(query);

    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    );

    setFilteredCategories(filtered);
  };

  const handleCheckboxChange = (item) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((c) => c.id === item.id);

      if (exists) {
        setCheckedItems((p) => ({ ...p, [item.name]: false }));

        return prev.filter((c) => c.id !== item.id);
      }

      if (prev.length >= 1) {
        toast.warn('You can only select one category.');
        return prev;
      }

      setCheckedItems((p) => ({ ...p, [item.name]: true }));

      return [...prev, item];
    });
  };

  const handleRemoveCategory = (item) => {
    setSelectedCategories((prev) => prev.filter((c) => c.id !== item.id));

    setCheckedItems((p) => ({ ...p, [item.name]: false }));
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setCheckedItems({});
    setSelectedCategoryObj(null);

    updateFormData((prev) => ({
      ...prev,
      item: {
        ...prev.item,
        category_id: '',
        sub_category_id: '',
      },
    }));
  };

  /* --------------------------- Add Category --------------------------- */

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || addingCategory) return;

    try {
      setAddingCategory(true);

      const data = await apiFetch(`${current}categories`, {
        method: 'POST',
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDesc,
        }),
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success('Category added');

      setNewCategoryName('');
      setNewCategoryDesc('');

      fetchCategories();
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error ? err.message : 'Failed to add category'
      );
    } finally {
      setAddingCategory(false);
    }
  };

  /* ------------------------ Add Sub Category ------------------------- */

  const handleAddSubCategory = async () => {
    if (!newSubCategoryName.trim() || !selectedCategoryObj || addingSubCategory)
      return;

    try {
      setAddingSubCategory(true);

      const data = await apiFetch(`${current}subcategories`, {
        method: 'POST',
        body: JSON.stringify({
          name: newSubCategoryName,
          parent_id: selectedCategoryObj.id,
        }),
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success('Subcategory added');

      setNewSubCategoryName('');
      setAddSubCat(false);

      fetchCategories();
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error ? err.message : 'Failed to add subcategory'
      );
    } finally {
      setAddingSubCategory(false);
    }
  };

  /* ------------------------------ Submit ------------------------------ */

  const handleSubmit = async () => {
    if (submitting || selectedCategories.length === 0) return;

    try {
      setSubmitting(true);

      updateFormData((prev) => {
        const updated = {
          ...prev,
          item: {
            ...prev.item,
            category_id: selectedCategories[0]?.category_id,
            sub_category_id: selectedCategories[0]?.id,
          },
        };

        sessionStorage.setItem('product', JSON.stringify(updated));

        return updated;
      });

      await new Promise((r) => setTimeout(r, 600));

      handleStepChange(activeStep + 1);
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------- UI ------------------------------- */

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full py-8">
      <div className="formatter mx-auto max-w-7xl px-4">
        {/* ------------------ Panels ------------------ */}

        <div className="bg-white rounded-lg shadow-md overflow-hidden md:grid md:grid-cols-3">
          {/* -------- Left -------- */}

          <div className="p-6 border-r">
            <h2 className="font-semibold mb-4">Select Category</h2>

            <input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search category..."
              className="mb-3 w-full px-3 py-2 border rounded"
            />

            <div className="h-[300px] overflow-y-auto mb-3">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryObj(cat)}
                  className={`w-full px-4 py-2 mb-2 text-left rounded ${
                    selectedCategoryObj?.id === cat.id
                      ? 'bg-gray-200 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <img
                    src={arrowright}
                    alt=""
                    className="w-4 h-4 float-right"
                  />
                </button>
              ))}
            </div>

            {/* Add Category */}

            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Add new category"
              className="w-full mb-2 px-3 py-2 border rounded"
            />

            <input
              value={newCategoryDesc}
              onChange={(e) => setNewCategoryDesc(e.target.value)}
              placeholder="Description"
              className="w-full mb-2 px-3 py-2 border rounded"
            />

            <button
              onClick={handleAddCategory}
              disabled={addingCategory}
              className="w-full bg-maroon text-white py-2 rounded disabled:opacity-50"
            >
              {addingCategory ? 'Adding...' : 'Add'}
            </button>
          </div>

          {/* -------- Right -------- */}

          <div className="col-span-2 p-6">
            {catLoading && <Loader />}

            {!catLoading && selectedCategoryObj && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategoryObj.subcategories.map((item) => (
                  <label key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checkedItems[item.name] || false}
                      onChange={() =>
                        handleCheckboxChange({
                          ...item,
                          category_id: selectedCategoryObj.id,
                        })
                      }
                    />

                    {item.name}
                  </label>
                ))}

                {/* Add Sub */}

                <div className="flex items-center gap-2">
                  <PlusSquare
                    onClick={() => setAddSubCat(true)}
                    className="cursor-pointer"
                  />

                  {addSubCat && (
                    <>
                      <input
                        value={newSubCategoryName}
                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />

                      <CheckSquare2
                        onClick={handleAddSubCategory}
                        className={`cursor-pointer ${
                          addingSubCategory ? 'opacity-50' : 'text-emerald-500'
                        }`}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------- Bottom -------- */}

        <div className="bg-gray-100 p-6 flex justify-between items-center">
          <div>
            {selectedCategories.map((cat) => (
              <span
                key={cat.id}
                className="bg-white px-3 py-1 rounded-full mr-2"
              >
                {cat.name}

                <img
                  src={x}
                  alt=""
                  onClick={() => handleRemoveCategory(cat)}
                  className="inline w-3 ml-2 cursor-pointer"
                />
              </span>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !selectedCategories.length}
            className="bg-maroon text-white px-6 py-2 rounded-full disabled:opacity-50"
          >
            {submitting ? <LoaderW /> : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- PropTypes ----------------------------- */

Categories.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  updateFormValidity: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default Categories;
