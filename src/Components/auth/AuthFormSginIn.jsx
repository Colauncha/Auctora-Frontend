import { google_auth } from '../../Constants';
import PropTypes from 'prop-types';
import Button from '../Button';
import Input from './Input';
import useModeStore from '../../Store/Store';
import { useNavigate } from 'react-router-dom';
import Loader from '../../assets/loader';
import { useState } from 'react';
import useAuthStore from '../../Store/AuthStore';
import { current } from '../../utils';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Alerts from '../alerts/Alerts';

const AuthFormSignIn = ({ heading }) => {
  const { isMobile } = useModeStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHarshed, setIsHarshed] = useState(false);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: '',
    message: '',
    detail: '',
  });
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 5000);
  };

  const signUp = () => navigate('/sign-up');
  const forgotPassword = () => navigate('/forgot-password');

  const googleSignIn = async () => {
    const response = await fetch(`${current}users/google/auth`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      window.open(data.data.url, '_blank');
    } else {
      const errorData = await response.json();
      showAlert('fail', errorData.message, errorData.detail);
    }
  };

  const validatePassword = (pwd) => {
    const startsWithCapital = /^[A-Z]/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(pwd);
    return startsWithCapital && hasMinLength && hasNumber && hasSpecialChar;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validatePassword(password)) {
      showAlert(
        'warn',
        'Password must start with a capital letter, be at least 8 characters, include a number and a special character.',
      );
      setLoading(false);
      return;
    }

    const data = {
      identifier: email,
      password,
    };

    try {
      const response = await fetch(`${current}users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        showAlert('success', data.message, 'Log In Successful');

        setTimeout(() => {
          login(true);
          setLoading(false);

          if (
            sessionStorage.getItem('newAccount') &&
            sessionStorage.getItem('email-otp') === email
          ) {
            navigate('/otp');
          } else {
            sessionStorage.removeItem('newAccount');
            sessionStorage.removeItem('email-otp');
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        const errorData = await response.json();
        showAlert('fail', errorData.message, errorData.detail);
        setLoading(false);
      }
    } catch (error) {
      showAlert('fail', error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-[620px] h-[560px] mb-40 p-10 bg-white rounded-tl-md rounded-bl-md">
      <form onSubmit={submit}>
        {loading && <Loader />}
        {alertT.isAlert && (
          <Alerts
            key={`${alertT.level}-${alertT.message}`}
            message={alertT.message}
            detail={alertT.detail}
            type={alertT.level}
          />
        )}

        <fieldset className="flex flex-col gap-3">
          <legend className="text-[30px] font-[700] text-[#9f3247]">
            {heading}
          </legend>

          {isMobile && (
            <div className="flex items-center gap-1">
              <p className="text-[#848a8f] text-[12px]">
                Don&apos;t have an account?
              </p>
              <span
                className="text-[#de506d] text-[12px] cursor-pointer"
                onClick={signUp}
              >
                Sign Up
              </span>
            </div>
          )}

          <Input
            title="Email"
            id="email"
            type="email"
            value={email}
            htmlFor="email"
            className="focus:outline-[#9f3248]"
            onChange={(e) => {
              setAlert({ isAlert: false, level: '', message: '', detail: '' });
              setEmail(e.target.value);
            }}
          />

          <div className="relative w-full">
            <Input
              title="Password"
              id="password"
              type={isHarshed ? 'text' : 'password'}
              value={password}
              htmlFor="password"
              className="focus:outline-[#9f3248] w-full"
              onChange={(e) => {
                setAlert({
                  isAlert: false,
                  level: '',
                  message: '',
                  detail: '',
                });
                setPassword(e.target.value);
              }}
            />
            {isHarshed ? (
              <FaEye
                className="absolute right-3 top-8 text-gray-600 cursor-pointer"
                onClick={() => setIsHarshed(false)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-3 top-8 text-gray-600 cursor-pointer"
                onClick={() => setIsHarshed(true)}
              />
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={forgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            label="Login"
            type="submit"
            className="hover:bg-[#de506d]"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Login'}
          </Button>
        </fieldset>
      </form>

      <div className="flex flex-col gap-3 mt-2 items-center">
        <p>Or Login with</p>
        <div
          onClick={googleSignIn}
          className="bg-[#f5f5f5] p-3 rounded-full cursor-pointer hover:bg-[#de506d] hover:scale-105 transition-transform duration-300"
        >
          <img
            src={google_auth}
            alt="Google Auth"
            className="w-10 h-10 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

AuthFormSignIn.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default AuthFormSignIn;
