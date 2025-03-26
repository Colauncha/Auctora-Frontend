import { useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { current } from "../../utils";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    phone_number: "",
  })
  const navigate = useNavigate();
  const endpoint = `${current}users/update`

  const runFetch = async (data) => {
    console.log(data)
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error(response.json())
      }
      const resp = response.json
      console.log("Success: ", resp)
      return true
    } catch (error) {
      console.error("Error: ", error)
      return false;
    }
  }

  const Next = async () => {
    const data = profile
    await runFetch(data) && navigate("/update-address")
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
  <div className="bg-[#F2F0F1] min-h-screen">
    <div className="formatter">
      <div className="py-6"> {/* Reduced padding */}
        <Breadcrumbs />
        <div className="flex items-center justify-center">
          <div className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4"> {/* Reduced bottom margin */}
            <h1 className="text-left text-4xl mb-4 font-bold text-maroon"> {/* Reduced margin */}
              Profile Information
            </h1>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Section */}
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      placeholder="First Name"
                      onChange={e => handleChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      placeholder="Last Name"
                      onChange={e => handleChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                    />
                  </div>
                </div>

                {/* Right Section */}
                <div>
                  <div className="mb-4">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username"
                      onChange={e => handleChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      placeholder="Phone"
                      onChange={e => handleChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                    />
                  </div>
                </div>
              </div>

              {/* ID Card Front and Back in One Row */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="idCardFront" className="block text-gray-700 mb-1">
                    ID Card Front
                  </label>
                  <div className="text-center py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-700 cursor-pointer">
                    <img src={uploadIcon} alt="Upload icon" className="h-6 mx-auto mt-8" />
                    <p className="mt-1 mb-8 text-maroon">Upload picture</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="idCardBack" className="block text-gray-700 mb-1">
                    ID Card Back
                  </label>
                  <div className="text-center py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-700 cursor-pointer">
                    <img src={uploadIcon} alt="Upload icon" className="h-6 mx-auto mt-8" />
                    <p className="mt-1 mb-8 text-maroon">Upload picture</p>
                  </div>
                </div>
              </div> */}

              {/* Next Button */}
              <div className="mt-4"> {/* Reduced margin */}
                <button
                onClick={Next}
                  type="button"
                  className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default CreateAccount;
