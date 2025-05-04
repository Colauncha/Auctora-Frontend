import { useState, useEffect } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { current } from "../../utils";
import { useNavigate } from "react-router-dom";
import Loading from '../../assets/loader2';
import Alerts from '../../Components/alerts/Alerts';

const CreateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone_number: '',
  });
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: '',
    message: '',
    detail: '',
  });
  const navigate = useNavigate();
  const endpoint = `${current}users/update`;

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 10000);
  };

  const runFetch = async (data) => {
    console.log(data);
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        showAlert(
          'fail',
          errorData.message || 'Failed to update profile',
          errorData.detail || 'Please try again later',
        );
        throw new Error(errorData);
      }
      const resp = await response.json();
      showAlert('success', resp.message || 'Profile updated successfully');
      console.log('Success: ', resp);
      return resp.success;
    } catch (error) {
      console.error('Error: ', error);
      return false;
    }
  };

  useEffect(() => {
    setLoading(true);
    const newAcct = JSON.parse(sessionStorage.getItem('newAccount'));
    if (!newAcct) {
      const { first_name, last_name, username, phone_number } = JSON.parse(
        sessionStorage.getItem('_user'),
      );
      setTimeout(() => {
        setProfile({ first_name, last_name, username, phone_number });
        setLoading(false);
      }, 1000);
      return;
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }
  }, []);

  const Next = async () => {
    setLoading(true);
    const data = profile;
    (await runFetch(data)) &&
      (!JSON.parse(sessionStorage.getItem('newAccount'))
        ? setTimeout(() => navigate('/dashboard'), 1000)
        : setTimeout(() => navigate('/update-address'), 1000));
    setLoading(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      {alertT.isAlert && (
        <Alerts
          key={`${alertT.level}-${alertT.message}`}
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      <div className="formatter">
        <div className="py-6">
          {' '}
          {/* Reduced padding */}
          <Breadcrumbs />
          <div className="flex items-center justify-center">
            <div className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4">
              {' '}
              {/* Reduced bottom margin */}
              <h1 className="text-left text-4xl mb-4 font-bold text-maroon">
                {' '}
                {/* Reduced margin */}
                Profile Information
              </h1>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Section */}
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="first_name"
                        className="block text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder="First Name"
                        onChange={(e) => handleChange(e)}
                        value={profile.first_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="last_name"
                        className="block text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder="Last Name"
                        onChange={(e) => handleChange(e)}
                        value={profile.last_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                      />
                    </div>
                  </div>

                  {/* Right Section */}
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-gray-700 mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        onChange={(e) => handleChange(e)}
                        value={profile.username}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone_number"
                        className="block text-gray-700 mb-1"
                      >
                        Phone number
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        placeholder="Phone"
                        onChange={(e) => handleChange(e)}
                        value={profile.phone_number}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-maroon"
                      />
                    </div>
                  </div>
                </div>
                {/* Next Button */}
                <div className="mt-4 flex justify-center gap-2 space-y-3 transition-[gap] duration-300 hover:gap-6">
                  <button
                    onClick={Next}
                    type="button"
                    className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
                  >
                    Next
                  </button>
                  {loading && (
                    <div className="flex justify-center mt-4">
                      <Loading />
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

export default CreateAccount;
