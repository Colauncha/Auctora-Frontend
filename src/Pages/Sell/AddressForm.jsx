import React, { useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const AddressForm = () => {


  const navigate = useNavigate();

  const Next = () => {
    navigate("/AccountForm");
  };

  const [country, setCountry] = useState("");
  const [states, setStates] = useState([]);
  const [state, setState] = useState("");
  const [areas, setAreas] = useState([]);

  const countryOptions = {
    Nigerian: {
      states: ["Lagos", "Abuja", "Kano", "Rivers"],
      areas: {
        Lagos: ["Ikeja", "Surulere", "Lekki", "Yaba"],
        Abuja: ["Garki", "Asokoro", "Maitama", "Wuse"],
        Kano: ["Nassarawa", "Fagge", "Tarauni", "Ungogo"],
        Rivers: ["Port Harcourt", "Obio-Akpor", "Bonny", "Degema"],
      },
    },
    USA: {
      states: ["California", "Texas", "Florida", "New York"],
      areas: {
        California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
        Texas: ["Houston", "Austin", "Dallas", "San Antonio"],
        Florida: ["Miami", "Orlando", "Tampa", "Tallahassee"],
        "New York": ["Manhattan", "Brooklyn", "Queens", "Bronx"] // No trailing comma here
      },
    },
    India: {
      states: ["Delhi", "Mumbai", "Bangalore", "Chennai"],
      areas: {
        Delhi: ["South Delhi", "Rohini", "Dwarka", "Karol Bagh"],
        Mumbai: ["Andheri", "Bandra", "Colaba", "Goregaon"],
        Bangalore: ["Whitefield", "Koramangala", "Indiranagar", "Jayanagar"],
        Chennai: ["T. Nagar", "Velachery", "Adyar", "Anna Nagar"],
      },
    },
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setStates(countryOptions[selectedCountry]?.states || []);
    setState(""); // Reset state selection
    setAreas([]); // Reset areas
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    setAreas(countryOptions[country]?.areas[selectedState] || []);
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
  <div className="formatter">
    <div className="py-6"> {/* Reduced padding */}
      <Breadcrumbs />
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-lg p-10 mb-6 mt-4 w-full max-w-full">
        {/* <h1 className="text-red-500 font-bold text-left text-3xl mb-6">
          Address Information
        </h1> */}
        <h1 className="text-left text-4xl mb-4 font-bold text-maroon"> {/* Reduced margin */}
        Address Information
          </h1>
        <form className="space-y-6">
          {/* Row 1: Country and State */}
          <div className="flex space-x-6">
            {/* Select Country */}
            <select
              value={country}
              onChange={handleCountryChange}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <option value="">Select Country</option>
              <option value="Nigerian">Nigerian</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
            </select>
            {/* Select State */}
            <select
              value={state}
              onChange={handleStateChange}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              disabled={!states.length}
            >
              <option value="">
                {states.length ? "Select State" : "Select Country First"}
              </option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          {/* Row 2: Area */}
          <div>
          <select
  className="state-area p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-96 md:w-[648px] lg:w-[648px]"
  disabled={!areas.length}
>
  <option value="">
    {areas.length ? "Select Area" : "Select State First"}
  </option>
  {areas.map((area, index) => (
    <option key={index} value={area}>
      {area}
    </option>
  ))}
</select>

          </div>
          {/* Row 3: Complete Address */}
          <div>
            <textarea
              placeholder="Enter complete address here."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 resize-none h-32"
            ></textarea>
          </div>
                        <button
              onClick={Next}
                type="button"
                className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
              >
                Next
              </button>
        </form>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default AddressForm;
