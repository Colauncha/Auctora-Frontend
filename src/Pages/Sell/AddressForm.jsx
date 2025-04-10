import { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import { current } from '../../utils'
import Loader from '../../assets/loader2';

const AddressForm = () => {
  const [loading, setLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [countryStates, setCountryStates] = useState([]);
  const [state, setState] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const runFetch = async ({ state = null, data = null, method = 'GET' }) => {
    let endpoint = `${current}misc/states`;
    if (method === 'GET' && state) {
      endpoint = `${current}misc/cities/${state}`;
    } else if (method !== 'GET') {
      endpoint = `${current}users/update_address/`;
    }
    console.log(endpoint);
    try {
      const response = await fetch(endpoint, {
        method,
        body: data ? JSON.stringify(data) : null,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        console.error('Error response: ', error);
        throw new Error(error.message || 'An error occurred');
      }
      const resp = await response.json();
      console.log('Success: ', resp);
      return resp.data || [];
    } catch (error) {
      console.error('Error: ', error);
      return false;
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const response = await runFetch({ method: 'GET' });
      if (response) {
        setCountryStates(response);
      } else {
        console.log('Error fetching states');
      }
      setLoading(false);
    };
    run();
  }, []);

  const Next = async () => {
    setNextLoading(true);
    const data = {
      country,
      state,
      city: selectedArea,
      address,
    };

    const result = await runFetch({
      method: 'PUT',
      data,
    });

    if (result) {
      setTimeout(() => {
        setNextLoading(false);
        !JSON.parse(sessionStorage.getItem('newAccount'))
          ? navigate('/dashboard')
          : navigate('/bank-account');
      }, 1000);
    } else {
      setTimeout(() => {
        setNextLoading(false);
        alert('Address details not saved.');
      }, 500);
    }
  };
  //

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setState(''); // Reset state selection
    setAreas([]); // Reset areas
  };

  const handleStateChange = async (e) => {
    try {
      setLoading(true);
      const selectedState = e.target.value;
      setState(selectedState);
      setAreas([]); // Reset areas when state changes
      const cities = await runFetch({ state: selectedState });
      console.log(cities);
      setAreas(cities || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cities: ', error);
      setAreas([]);
    }
  };

  const handleAreaChange = (e) => {
    const selectedArea = e.target.value;
    setSelectedArea(selectedArea);
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          {' '}
          {/* Reduced padding */}
          <Breadcrumbs />
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg p-10 mb-6 mt-4 w-full max-w-full">
              <h1 className="text-left text-4xl mb-4 font-bold text-maroon">
                {' '}
                {/* Reduced margin */}
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
                    <option value="Nigerian">Nigeria</option>
                  </select>
                  {/* Select State */}
                  <select
                    value={state}
                    onChange={handleStateChange}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    disabled={!countryStates.length}
                  >
                    <option value="">
                      {countryStates.length
                        ? 'Select State'
                        : 'Select Country First'}
                    </option>
                    {countryStates?.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Row 2: Area */}
                {/* Row 2: Area with inline Loader */}
                <div className="flex items-center gap-4">
                  <select
                    className="state-area p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-full sm:w-96 md:w-[648px] lg:w-[648px]"
                    disabled={!areas.length}
                    value={selectedArea}
                    onChange={handleAreaChange}
                  >
                    <option value="">
                      {areas.length ? 'Select Area' : 'Select State First'}
                    </option>
                    {areas.map((area, index) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>

                  {loading && (
                    <div className="flex items-center">
                      <Loader />
                    </div>
                  )}
                </div>

                {/* Row 3: Complete Address */}
                <div>
                  <textarea
                    placeholder="Enter complete address here."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 resize-none h-32"
                  ></textarea>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={Next}
                    type="button"
                    className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
                  >
                    Next
                  </button>
                  {nextLoading && (
                    <div className="flex item-center">
                      <Loader />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AddressForm;