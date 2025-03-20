import React from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {

      const navigate = useNavigate();
      const Next = () => {
        navigate("/");
      };

  return (
<div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex justify-center items-center">
            <div className="bg-white border border-gray-300 p-10 mb-2 mt-4 rounded-lg w-full max-w-full">
              <h1 className="text-4xl font-bold text-maroon mb-12 text-left">
                Get Started
              </h1>
              <p className="text-lg text-gray-700 mb-6 text-center">
                Add your first product to sell
              </p>
              <div className="flex justify-center">
                <button
                  className="px-16 py-3 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon transition duration-300 mb-4"
                >
                  Add products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
