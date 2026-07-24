import { useRef, useState } from "react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import Loader from '../../assets/loader2';
import { current, authFetch } from '../../utils';
import { toastSuccess, toastError, toastWarn } from '../../utils/toast';
import { FaClipboardList } from 'react-icons/fa';

const SellAccount = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
      const response = await authFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(cred),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        toastError(errorData.message || 'Error', errorData.detail);
        throw new Error(await response.json());
      }
      const resp = await response.json();
      console.log('Success: ', resp.success);
      toastSuccess(resp.message || 'Success', resp.detail || 'OTP verified successfully');
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
      toastWarn('OTP must be six characters', 'Please enter a valid OTP');
      setLoading(false);
      return;
    } else {
      if (await runFetch(cred)) {
        sessionStorage.removeItem('email-otp');
        setTimeout(() => {
          setLoading(false);
          navigate('/update-profile');
        }, 2000);
      }
    }
  };

  const [resending, setResending] = useState(false);

  const resendOtp = async () => {
    if (resending) return;

    const email = sessionStorage.getItem('email-otp');
    if (!email) {
      toastError('Email not found', 'Please log in again to resend OTP');
      return;
    }

    setResending(true);
    try {
      const endpoint = `${current}users/reset_otp?email=${encodeURIComponent(
        email,
      )}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('OTP Resent Successfully:', data);
        toastSuccess(
          'OTP Resent Successfully',
          data.data.detail || 'Please check your email for the new OTP.',
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to Resend OTP:', errorData);
        toastError(errorData.message || 'Error', errorData.detail || 'Could not resend OTP.');
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      toastError('An unexpected error occurred while resending OTP.');
    } finally {
      setResending(false);
    }
  };

  const otpRefs = [refBox0, refBox1, refBox2, refBox3, refBox4, refBox5];

  const handleOtpChange = (event, index, nextRef) => {
    const char = event.target.value.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index]) {
      event.target.previousElementSibling?.focus();
    }
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    const chars = text.replace(/\D/g, '').slice(0, 6).split('');
    setOtp((prev) => {
      const next = [...prev];
      chars.forEach((char, idx) => {
        next[idx] = char;
      });
      return next;
    });
    otpRefs[Math.max(chars.length - 1, 0)]?.current?.focus();
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
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center outline-1 focus:outline-[#5e1a28]"
                      onChange={(e) => handleOtpChange(e, 0, refBox1)}
                      onKeyDown={(e) => handleOtpKeyDown(e, 0)}
                      value={otp[0]}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox1}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center outline-1 focus:outline-[#5e1a28]"
                      onChange={(e) => handleOtpChange(e, 1, refBox2)}
                      onKeyDown={(e) => handleOtpKeyDown(e, 1)}
                      value={otp[1]}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox2}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center outline-1 focus:outline-[#5e1a28]"
                      onChange={(e) => handleOtpChange(e, 2, refBox3)}
                      onKeyDown={(e) => handleOtpKeyDown(e, 2)}
                      value={otp[2]}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox3}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center outline-1 focus:outline-[#5e1a28]"
                      onChange={(e) => handleOtpChange(e, 3, refBox4)}
                      onKeyDown={(e) => handleOtpKeyDown(e, 3)}
                      value={otp[3]}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox4}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center outline-1 focus:outline-[#5e1a28]"
                      onChange={(e) => handleOtpChange(e, 4, refBox5)}
                      onKeyDown={(e) => handleOtpKeyDown(e, 4)}
                      value={otp[4]}
                      type="text"
                      maxLength={1}
                    />
                    <input
                      ref={refBox5}
                      className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-center outline-1 focus:outline-[#5e1a28]"
                      onChange={(e) => handleOtpChange(e, 5, null)}
                      onKeyDown={(e) => handleOtpKeyDown(e, 5)}
                      value={otp[5]}
                      type="text"
                      maxLength={1}
                    />
                  </div>
                  <div className="w-full flex gap-6 items-center">
                    <p className="text-gray-500 mt-4">
                      The code will be sent via email.
                    </p>
                    <span
                      className="flex gap-1 items-center text-gray-500 text-sm mt-4 cursor-pointer group relative"
                      onClick={handlePaste}
                    >
                      <FaClipboardList
                        size={16}
                        className="group-hover:text-[#5e1a28] transition-colors duration-500 ease-in-out"
                      />
                      <p className="group-hover:text-[#5e1a28] transition-colors duration-500 ease-in-out">
                        Paste
                      </p>
                    </span>
                  </div>
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
                  Ready to showcase your products to a global audience? Create a
                  Biddius seller account now! Tap into the excitement of
                  auctions, connect with eager buyers, and turn your items into
                  extraordinary finds. Join the auction adventure today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellAccount