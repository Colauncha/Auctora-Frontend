// import { useState } from 'react';
// import { PropTypes } from 'prop-types';
// import Loader from '../../../assets/loader2';

// const Description = ({ handleStepChange, activeStep, updateFormValidity }) => {
//   const [loading, setLoading] = useState(false);
//   const [product, setProduct] = useState({
//     start_price: 0,
//     current_price: 0,
//     buy_now: false,
//     buy_now_price: 0,
//     start_date: new Date().toISOString(),
//     end_date: '',
//     users_id: sessionStorage.getItem('_user')
//       ? JSON.parse(sessionStorage.getItem('_user')).id
//       : '',
//     private: false,
//     participants: [],
//     status: 'pending',
//   });

//   const [item, setItem] = useState({
//     name: '',
//     description: '',
//     category_id: '',
//     sub_category_id: '',
//   });

//   // Handle change for item state object
//   const handleChange = (e) => {
//     console.log(e.target.value);
//     const { name, value, type, checked } = e.target;
//     setItem((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(product);
//   };

//   // Handle change for product state object
//   const handleChanged = (e) => {
//     console.log(e.target.value);
//     const { name, value, type, checked } = e.target;
//     if (name === 'start_price') {
//       setProduct((prev) => ({
//         ...prev,
//         [name]: value,
//         current_price: value,
//       }));
//     } else if (name === 'start_date' || name === 'end_date') {
//       let value_ = new Date(value);
//       setProduct((prev) => ({
//         ...prev,
//         [name]: value_.toISOString(),
//       }));
//     }
//     setProduct((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen w-full">
//       <div className="formatter">
//         <div className="bg-white rounded-lg p-10 mb-4 mt-4">
//           <h5 className="w-full max-w-full text-xl font-bold mb-4">
//             Fill in the basic information about your item
//           </h5>
//           <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
//             {/* Left Side - Product name & Description */}
//             <div className="flex flex-col space-y-4">
//               {/* Product Name */}
//               <div>
//                 <label className="block text-black font-semibold">
//                   Product name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Graphic card GIGABYTE GeForce RTX 3050"
//                   value={item.name}
//                   onChange={handleChange}
//                   className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
//                   maxLength={60}
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   {item.name.length}/60
//                 </p>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-black font-semibold">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Enter product details..."
//                   value={item.description}
//                   onChange={handleChange}
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100 h-60"
//                   maxLength={1200}
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   {item.description.length}/1200
//                 </p>
//               </div>

//               <div className="flex flex-row space-y-2.5 gap-4">
//                 <button
//                   onClick={() => {
//                     setLoading(true);
//                     sessionStorage.setItem(
//                       'product',
//                       JSON.stringify({ ...product, item }),
//                     );
//                     setTimeout(() => {
//                       setLoading(false);
//                       updateFormValidity(activeStep, true);
//                       handleStepChange(activeStep + 1);
//                     }, 1000);
//                   }}
//                   type="button"
//                   className="flex flex-row item-center justify-evenly w-1/3 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
//                 >
//                   Next
//                 </button>
//                 {loading && <Loader />}
//               </div>
//             </div>

//             {/* Right Side - Units, Dimensions, & Price */}
//             <div className="flex flex-col space-y-4">
//               {/* Availability */}
//               {/* <div>
//                 <label className="block text-black font-semibold">Number of units available</label>
//                 <input
//                   type="number"
//                   name="availability"
//                   placeholder="Availability"
//                   value={product.availability}
//                   onChange={handleChange}
//                   className="w-3/4 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
//                 />
//               </div> */}

//               {/* Dimensions */}
//               {/* <div>
//                 <label className="block text-black font-semibold">Dimensions (optional)</label>
//                 <div className="flex flex-col space-y-2">
//                   <div className="flex items-center gap-2">
//                     <label>Length [mm]</label>
//                     <input
//                       type="number"
//                       name="length"
//                       placeholder="0"
//                       value={product.dimensions.length}
//                       onChange={(e) =>
//                         setProduct({
//                           ...product,
//                           dimensions: { ...product.dimensions, length: e.target.value },
//                         })
//                       }
//                       className="w-12 p-2 border border-gray-300 rounded-md text-gray-700"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <label>Width [mm]</label>
//                     <input
//                       type="number"
//                       name="width"
//                       placeholder="0"
//                       value={product.dimensions.width}
//                       onChange={(e) =>
//                         setProduct({
//                           ...product,
//                           dimensions: { ...product.dimensions, width: e.target.value },
//                         })
//                       }
//                       className="w-12 p-2 border border-gray-300 rounded-md text-gray-700"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <label>Height [mm]</label>
//                     <input
//                       type="number"
//                       name="height"
//                       placeholder="0"
//                       value={product.dimensions.height}
//                       onChange={(e) =>
//                         setProduct({
//                           ...product,
//                           dimensions: { ...product.dimensions, height: e.target.value },
//                         })
//                       }
//                       className="w-12 p-2 border border-gray-300 rounded-md text-gray-700"
//                     />
//                   </div>
//                 </div>
//               </div> */}

//               {/* Price */}
//               <div>
//                 <label className="block text-black font-semibold">
//                   Initial price
//                 </label>
//                 <input
//                   type="number"
//                   name="start_price"
//                   placeholder="Product price"
//                   value={product.start_price}
//                   onChange={handleChanged}
//                   className="w-2/4 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
//                 />
//               </div>
//               {/* Buy Now Checkbox and Conditional Price */}
//               <div>
//                 <label className="block text-black font-semibold">
//                   <input
//                     type="checkbox"
//                     name="buy_now"
//                     checked={product.buy_now}
//                     onChange={handleChanged}
//                     className="mr-2"
//                   />
//                   Buy Now
//                 </label>

//                 {product.buy_now && (
//                   <div className="mt-2">
//                     <label className="block text-black font-semibold">
//                       Buy Now Price
//                     </label>
//                     <input
//                       type="number"
//                       name="buy_now_price"
//                       placeholder="Buy Now price"
//                       value={item.buy_now_price}
//                       onChange={handleChanged}
//                       className="w-2/4 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
//                     />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-black font-semibold">
//                   <input
//                     type="datetime-local"
//                     name="start_date"
//                     onChange={handleChanged}
//                     className="mr-2"
//                   />
//                   Start Date
//                 </label>
//               </div>
//               <div>
//                 <label className="block text-black font-semibold">
//                   <input
//                     type="datetime-local"
//                     name="end_date"
//                     onChange={handleChanged}
//                     className="mr-2"
//                   />
//                   End Date
//                 </label>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// Description.propTypes = {
//   handleStepChange: PropTypes.func.isRequired,
//   activeStep: PropTypes.number.isRequired,
//   updateFormValidity: PropTypes.func.isRequired,
// };

// export default Description;




import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Loader from '../../../assets/loader2';

const Description = ({ handleStepChange, activeStep, updateFormValidity }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
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
  });

  const [item, setItem] = useState({
    name: '',
    description: '',
    category_id: '',
    sub_category_id: '',
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };


  const handleChanged = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'start_price') {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
        current_price: value,
      }));
    } else if (name === 'start_date' || name === 'end_date') {
      let value_ = new Date(value);
      setProduct((prev) => ({
        ...prev,
        [name]: value_.toISOString(),
      }));
    }
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className="bg-white rounded-lg p-10 mb-4 mt-4">
          <h5 className="text-xl font-bold mb-4">
            Fill in the basic information about your item
          </h5>
          <form
            onSubmit={handleSubmit}
            className="grid gap-6 md:grid-cols-2 sm:grid-cols-1"
          >
            {/* Left Side  */}
            <div className="flex flex-col space-y-4">
             
              <div>
                <label className="block text-black font-semibold">
                  Product name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Graphic card GIGABYTE GeForce RTX 3050"
                  value={item.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {item.name.length}/60
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-black font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product details..."
                  value={item.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100 h-60 sm:h-60"
                  maxLength={1200}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {item.description.length}/1200
                </p>
              </div>

              
            </div>

            {/* Right Side */}
            <div className="flex flex-col space-y-4">
             
              <div>
                <label className="block text-black font-semibold">
                  Initial price
                </label>
                <input
                  type="number"
                  name="start_price"
                  placeholder="Product price"
                  value={product.start_price}
                  onChange={handleChanged}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                />
              </div>
              {/* Buy Now Checkbox and Conditional Price */}
              <div>
                <label className="block text-black font-semibold">
                  <input
                    type="checkbox"
                    name="buy_now"
                    checked={product.buy_now}
                    onChange={handleChanged}
                    className="mr-2"
                  />
                  Buy Now
                </label>

                {product.buy_now && (
                  <div className="mt-2">
                    <label className="block text-black font-semibold">
                      Buy Now Price
                    </label>
                    <input
                      type="number"
                      name="buy_now_price"
                      placeholder="Buy Now price"
                      value={product.buy_now_price}
                      onChange={handleChanged}
                      className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-black font-semibold">
                  <input
                    type="datetime-local"
                    name="start_date"
                    onChange={handleChanged}
                    className="mr-2"
                  />
                  Start Date
                </label>
              </div>
              <div>
                <label className="block text-black font-semibold">
                  <input
                    type="datetime-local"
                    name="end_date"
                    onChange={handleChanged}
                    className="mr-2"
                  />
                  End Date
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setLoading(true);
                    sessionStorage.setItem(
                      'product',
                      JSON.stringify({ ...product, item }),
                    );
                    setTimeout(() => {
                      setLoading(false);
                      updateFormValidity(activeStep, true);
                      handleStepChange(activeStep + 1);
                    }, 1000);
                  }}
                  type="button"
                  className="flex flex-row item-center justify-evenly w-1/3 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
                >
                  Next
                </button>
                {loading && <Loader />}
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
};

export default Description;
