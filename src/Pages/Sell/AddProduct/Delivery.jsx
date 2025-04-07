
import { useState } from "react";

const Delivery = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [shippingDate, setShippingDate] = useState("");

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  return (
    // <div className="bg-gray-200 p-6 rounded-lg shadow-md">
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className=" bg-white rounded-lg p-10 mb-4 mt-4">
          {/* Header */}

          {/* <div className="w-full max-w-full mx-auto p-6 bg-white rounded-lg"> */}
          <h4 className="w-full max-w-full text-xl font-bold mb-4">
            Select delivery options
          </h4>

          {/* Checkbox Options */}
          <div className="space-y-3 text-xs">
            {['Self pickup', 'Online payment', 'Courier cash on delivery'].map(
              (option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer w-1/3 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionChange(option)}
                    disabled={option === 'Self pickup' ? false : true}
                    className="w-5 h-5 rounded border-gray-400 text-red-800 focus:ring-red-800"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ),
            )}
          </div>

          {/* Shipping Time Input */}
          <div className="mt-4">
            <h3 className="text-sm font-medium">Shipping time</h3>
            <input
              type="text"
              name="date"
              placeholder="Specify a date"
              value={shippingDate}
              onChange={(e) => setShippingDate(e.target.value)}
              disabled={true}
              className="w-full mt-1 px-3 py-2 border bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <button
            //   onClick={Next}
            // onClick={() => handleStepChange(activeStep + 1)}
            type="button"
            className="mt-6 w-40 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon mx-auto block"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Delivery;