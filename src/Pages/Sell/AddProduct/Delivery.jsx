
// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import Loader from '../../../assets/loader2';

// const Delivery = () => {
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [shippingDate, setShippingDate] = useState('');
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleOptionChange = (option) => {
//     setSelectedOptions((prev) =>
//       prev.includes(option)
//         ? prev.filter((item) => item !== option)
//         : [...prev, option],
//     );
//   };

//   const Next = () => {
//     setLoading(true);
//     setTimeout(() => {
//       navigate('/product-success');
//     }, 1500);
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen w-full flex items-center justify-center">
//       <div className="formatter">
//         <div className=" bg-white rounded-lg p-10 mb-4 mt-4">
//           {/* Header */}

//           <h4 className="w-full max-w-full text-xl font-bold mb-4">
//             Select delivery options
//           </h4>

//           {/* Checkbox Options */}
//           <div className="space-y-3 text-xs">
//             {['Self pickup', 'Online payment', 'Courier cash on delivery'].map(
//               (option) => (
//                 <label
//                   key={option}
//                   className="flex items-center space-x-2 cursor-pointer w-1/3 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedOptions.includes(option)}
//                     onChange={() => handleOptionChange(option)}
//                     disabled={option === 'Self pickup' ? false : true}
//                     className="w-5 h-5 rounded border-gray-400 text-red-800 focus:ring-red-800"
//                   />
//                   <span className="text-gray-700">{option}</span>
//                 </label>
//               ),
//             )}
//           </div>

//           {/* Shipping Time Input */}
//           <div className="mt-4">
//             <h3 className="text-sm font-medium">Shipping time</h3>
//             <input
//               type="text"
//               name="date"
//               placeholder="Specify a date"
//               value={shippingDate}
//               onChange={(e) => setShippingDate(e.target.value)}
//               disabled={true}
//               className="w-full mt-1 px-3 py-2 border bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
//             />
//           </div>

//           <div className="flex items-center justify-center gap-4 w-[50%] ml-[25%] space-y-5 mt-6">
//             <button
//               onClick={Next}
//               type="button"
//               className="mt-6 w-40 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
//             >
//               Next
//             </button>
//             {loading && (
//               <div className="flex items-center">
//                 <Loader />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Delivery;



import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loader from '../../../assets/loader2';

const Delivery = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [shippingDate, setShippingDate] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const Next = () => {
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
            Select delivery options
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

          <div className="flex gap-2 items-center justify-center">
            <button
              type="button"
              onClick={Next}
              className="mt-6 md:mt-8 w-full md:w-40 py-3 md:py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon mx-auto block"
            >
              Next
            </button>
            {loading && (
              <div className="flex items-center">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;