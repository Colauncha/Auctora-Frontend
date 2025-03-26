import { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { current } from '../../utils'

const AddressForm = () => {
  const [country, setCountry] = useState("")
  const [countryStates, setCountryStates] = useState([]);
  const [state, setState] = useState("");
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const runFetch = async (state = null) => {
    let endpoint;
    if (state === null) {
      endpoint = `${current}misc/states`
    } else {
      endpoint = `${current}misc/cities/${state}`
    }
    console.log(endpoint)
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(response.json())
      }
      const resp = await response.json()
      console.log("Success: ", resp)
      setCountryStates(resp.data)
      return resp.data
    } catch (error) {
      console.error("Error: ", error)
      return false;
    }
  }

  useEffect(() => {
    const run = async () => await runFetch()
    try {
      run()
    } catch (error) {
      console.error(error)
    }
  }, [])

  const Next = () => {
    navigate("/AccountForm");
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setState(""); // Reset state selection
    setAreas([]); // Reset areas
  };

  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    const cities = await runFetch(selectedState);
    console.log(cities)
    setAreas(cities);
    // setAreas(countryOptions[country]?.areas[selectedState] || []);
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
            </select>
            {/* Select State */}
            <select
              value={state}
              onChange={handleStateChange}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              disabled={!countryStates.length}
            >
              <option value="">
                {countryStates.length ? "Select State" : "Select Country First"}
              </option>
              {countryStates.map((state, index) => (
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
