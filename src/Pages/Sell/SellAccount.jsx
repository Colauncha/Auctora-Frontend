import { useRef, useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import Loader from '../../assets/loader2';
import { current } from '../../utils';

const SellAccount = () => {
  const [otp, setOtp] = useState([]);
  const refBox0 = useRef();
  const refBox1 = useRef();
  const refBox2 = useRef();
  const refBox3 = useRef();
  const refBox4 = useRef();
  const refBox5 = useRef();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const runFetch = async (cred) => {
    const endpoint = `${current}users/verify_otp`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(cred),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(response.json());
      }
      const resp = await response.json();
      console.log('Success: ', resp.success);
      return resp.success;
    } catch (error) {
      console.error('Error: ', error);
      return false;
    }
  };

  const Verify = async () => {
    setLoading(true);
    const otp_ = otp.join('');
    const cred = {
      otp: otp_,
      email: sessionStorage.getItem('email-otp'),
    };
    if (otp_.length < 6) {
      alert('OTP must be six characters');
    } else {
      setTimeout(async () => {
        console.log(cred);
        if (await runFetch(cred)) {
          sessionStorage.removeItem('email-otp');
          setLoading(false);
          navigate('/update-profile');
        }
      }, 2000);
    }
  };

  const [resending, setResending] = useState(false);

const resendOtp = async () => {
  if (resending) return;

  const email = sessionStorage.getItem('email-otp');
  if (!email) {
    alert("Email not found. Please log in again.");
    return;
  }

  setResending(true);
  try {
    const endpoint = `${current}users/reset_otp?email=${encodeURIComponent(email)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('OTP Resent Successfully:', data);
      alert("OTP has been resent to your email.");
    } else {
      const errorData = await response.json();
      console.error('Failed to Resend OTP:', errorData);
      alert(`${errorData.message || "Error"}: ${
        errorData.detail || "Could not resend OTP."
      }`);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    alert("An unexpected error occurred while resending OTP.");
  } finally {
    setResending(false);
  }
};


  const moveFocus = (event, nextRef) => {
    if (event.key >= '0' && event.key <= '9') {
      setOtp((prev) => [...prev, event.target.value]);
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    } else if (event.key === 'Backspace') {
      event.target.value = '';
      otp.pop();
      setOtp(otp);
      event.target.previousElementSibling?.focus();
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
            <div className="flex flex-col lg:flex-row w-full max-w-[1430px] rounded-lg overflow-hidden mb-28">
              <div className="flex-1 p-8 lg:p-16 bg-white">
                <h1 className="text-3xl lg:text-4xl mb-4 font-bold text-maroon">
                  Verify Email
                </h1>
                <div className="mt-6">
                  <label className="block font-medium text-gray-700 mb-2">
                    OTP
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={refBox0}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                      onKeyUp={(e) => {
                        moveFocus(e, refBox1);
                      }}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox1}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                      onKeyUp={(e) => {
                        moveFocus(e, refBox2);
                      }}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox2}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                      onKeyUp={(e) => {
                        moveFocus(e, refBox3);
                      }}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox3}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                      onKeyUp={(e) => {
                        moveFocus(e, refBox4);
                      }}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox4}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                      onKeyUp={(e) => {
                        moveFocus(e, refBox5);
                      }}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox5}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center"
                      onKeyUp={(e) => {
                        moveFocus(e, null);
                      }}
                      type="text"
                      maxLength={1}
                    />
                  </div>
                  <p className="text-gray-500 mt-4">
                    The code will be sent via email.
                  </p>
                  <div className="flex flex-row items-center gap-5 space-y-5 mt-6">
                    <button
                      onClick={Verify}
                      className={`mt-6 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white ${
                        loading ? 'w-[50%]' : 'w-full'
                      } py-3 rounded-full hover:bg-red-700 transition-all duration-300`}
                      disabled={loading}
                    >
                      Verify
                    </button>
                    {loading && <Loader />}
                  </div>

                  <p className="text-gray-500 mt-4">
                    Didn’t receive the code?{' '}
                    {/* <button
    onClick={async () => {
      const email = sessionStorage.getItem('email-otp'); 
      
      if (!email) {
        alert("Email not found. Please log in again.");
        return;
      }

      try {
        const endpoint = `${current}users/resend_otp`; 
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), 
        });

        if (response.ok) {
          const data = await response.json();
          console.log('OTP Resent Successfully:', data);
          alert("OTP has been resent to your email.");
        } else {
          const errorData = await response.json();
          console.error('Failed to Resend OTP:', errorData);
          alert(`${errorData.message || "Error"}: ${
            errorData.detail || "Could not resend OTP."
          }`);
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
        alert("An unexpected error occurred while resending OTP.");
      }
    }}
    className="text-red-600 hover:underline"
  >
    Resend OTP
  </button> */}
                    <button
                      onClick={resendOtp}
                      className="text-red-600 hover:underline"
                      disabled={resending}
                    >
                      {resending ? 'Resending...' : 'Resend OTP'}
                    </button>
                  </p>
                </div>
              </div>

              {/* Right Section - Promotional Content */}
              <div
                className="flex-1 bg-gradient-to-br from-[#5e1a28] to-[#b73f57] p-8 lg:p-16 flex flex-col justify-center items-center text-white rounded-lg"
                style={{
                  borderTopLeftRadius: '0px',
                  borderBottomLeftRadius: '0px',
                }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold">
                  AUCTION ON BIDDIUS
                </h2>
                <p className="mt-4 text-lg text-center">
                  Ready to showcase your products to a global audience? Create
                  an Biddius seller account now! Tap into the excitement of
                  auctions, connect with eager buyers, and turn your items into
                  extraordinary finds. Join the auction adventure today!
                </p>
                <button className="mt-8 bg-[#7B2334] text-[#fff] px-6 py-3 rounded-full hover:bg-red-800">
                  Already have an account? Login here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellAccount