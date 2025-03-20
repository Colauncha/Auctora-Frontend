// const Description = ({ activeStep, handleStepChange }) => {
//     return (
//       <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//         <h2 className="text-xl font-bold mb-4">Description Page</h2>
//         <p>This is the content for the Description step.</p>
//       </div>
//     );
//   };
  
//   export default Description;

import { useState } from "react";

const Description = ({ handleStepChange, activeStep }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    availability: "",
    dimensions: { length: 0, width: 0, height: 0 },
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(product);
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className="bg-white rounded-lg p-10 mb-4 mt-4">
          <h5 className="w-full max-w-full text-xl font-bold mb-4">
            Fill in the basic information about your item
          </h5>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Left Side - Product name & Description */}
            <div className="flex flex-col space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-black font-semibold">Product name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Graphic card GIGABYTE GeForce RTX 3050"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">{product.name.length}/60</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-black font-semibold">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter product details..."
                  value={product.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100 h-60"
                  maxLength={1200}
                />
                <p className="text-sm text-gray-500 mt-1">{product.description.length}/1200</p>
              </div>

              <button
                onClick={() => handleStepChange(activeStep + 1)} // Step transition
                type="button"
                className="w-1/3 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
              >
                Next
              </button>
            </div>

            {/* Right Side - Units, Dimensions, & Price */}
            <div className="flex flex-col space-y-4">
              {/* Availability */}
              <div>
                <label className="block text-black font-semibold">Number of units available</label>
                <input
                  type="number"
                  name="availability"
                  placeholder="Availability"
                  value={product.availability}
                  onChange={handleChange}
                  className="w-3/4 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-black font-semibold">Dimensions (optional)</label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <label>Length [mm]</label>
                    <input
                      type="number"
                      name="length"
                      placeholder="0"
                      value={product.dimensions.length}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          dimensions: { ...product.dimensions, length: e.target.value },
                        })
                      }
                      className="w-12 p-2 border border-gray-300 rounded-md text-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label>Width [mm]</label>
                    <input
                      type="number"
                      name="width"
                      placeholder="0"
                      value={product.dimensions.width}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          dimensions: { ...product.dimensions, width: e.target.value },
                        })
                      }
                      className="w-12 p-2 border border-gray-300 rounded-md text-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label>Height [mm]</label>
                    <input
                      type="number"
                      name="height"
                      placeholder="0"
                      value={product.dimensions.height}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          dimensions: { ...product.dimensions, height: e.target.value },
                        })
                      }
                      className="w-12 p-2 border border-gray-300 rounded-md text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-black font-semibold">Initial price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Product price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-2/4 mt-1 p-2 border border-gray-200 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Description;
