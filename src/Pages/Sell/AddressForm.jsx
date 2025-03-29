import { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { current } from '../../utils';

const AddressForm = () => {
  
  const [country, setCountry] = useState("");
  const [countryStates, setCountryStates] = useState([]); 
  const [state, setState] = useState(""); 
  const [areas, setAreas] = useState([]); 
  const [selectedArea, setSelectedArea] = useState(""); 
  const [completeAddress, setCompleteAddress] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  // Fetch states and areas based on country and state selection
  const runFetch = async (state = null) => {
    // This is where we use the endpoint to fetch the states and areas
    let endpoint = state ? `${current}misc/cities/${state}` : `${current}misc/states`;
    
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) throw new Error(await response.text());
      const resp = await response.json();
      return resp.data || resp;
    } catch (error) {
      setError("Failed to load location data");
      return null;
    }
  };

  // Bring out the states for nigeria when the user selects the country
  useEffect(() => {
    const fetchStates = async () => {
      const states = await runFetch();
      if (states) setCountryStates(states);
    };
    fetchStates();
  }, []);

  // When state is selected, bring out the areas for the state respected state
  const handleStateChange = async (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    setSelectedArea(""); // When the user changes the state then the area also will be empty
    setError(null);
    
    if (selectedState) {
      const cities = await runFetch(selectedState);
      if (cities) setAreas(cities);
    } else {
      setAreas([]);
    }
  };
  

  // My code for the Address Endpoint
  // const updateAddress = async (addressData) => {
  //   try {
  //     const response = await fetch("https://api-auctora.vercel.app/api/users/update_address", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${localStorage.getItem('token')`,
          
  //       },
  //       credentials: "include", 
  //       body: JSON.stringify(addressData)
  //     });

  //     if (!response.ok) {
  //       throw new Error(await response.text());
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const updateAddress = async (addressData) => {
    try {
      // This Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      // This make the request with proper headers
      const response = await fetch("https://api-auctora.vercel.app/api/users/update_address", {
        method: "PUT",
        mode: 'cors', 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Properly formatted token
        },
        credentials: "include", // Include cookies if needed
        body: JSON.stringify(addressData)
      });
  
      // This place handle response
      if (!response.ok) {
        // Try to parse error as JSON first
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Address update failed:', error);
      
      // Errors to render when the token is invalid/expired/server error
      if (error.message.includes('Unauthorized') || 
          error.message.includes('401')) {
        // Token is invalid/expired - redirect to home page
        localStorage.removeItem('token');
        window.location.href = '/l';
        throw new Error('Session expired. Please login again.');
      }
      
      throw error;
    }
  };
//

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!country || !state || !selectedArea || !completeAddress.trim()) {
      setError("Please fill in all address fields");
      return;
    }

    // Prepare data for API
    const addressData = {
      country,
      state,
      city: selectedArea, 
      address: completeAddress
    };

    try {
      //This will send the data to the API endpoint
      await updateAddress(addressData); 
      navigate("/bank-account");
    } catch (error) {
      setError("Failed to save address. Please try again.");
      console.error("Address update error:", error);
    }
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setState("");
    setAreas([]);
    setSelectedArea("");
    setError(null);
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-10 mb-6 mt-4 w-full max-w-full">
              <h1 className="text-left text-4xl mb-4 font-bold text-maroon">
                Address Information
              </h1>
              
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Country Selection */}
                  <div className="flex-1">
                    <select
                      value={country}
                      onChange={handleCountryChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="Nigerian">Nigeria</option>
                    </select>
                  </div>
                  

                  {/* This loads the State field only when the country is selected */}
                  <div className="flex-1">
                    <select
                      value={state}
                      onChange={handleStateChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={!country}
                      required
                    >
                      <option value="">Select State</option>
                      {countryStates.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
                

                {/* This loads the Area field only when the state is selected */}
                <div>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={!state}
                    required
                  >
                    <option value="">Select Area</option>
                    {areas.map((area, index) => (
                      <option key={index} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                
                <div>
                  <textarea
                    value={completeAddress}
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder="Enter complete address here."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-32"
                    required
                    minLength={10}
                  />
                </div>
                
                <button
                  type="submit"
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