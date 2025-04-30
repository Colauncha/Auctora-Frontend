import { google_auth } from '../../Constants';
import Button from '../Button';
import PropTypes from 'prop-types';
import Input from './Input';
import useModeStore from '../../Store/Store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../../assets/loader';
import { current } from '../../utils';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Alerts from '../alerts/Alerts';

const AuthFormSginUp = ({ heading }) => {
  const { isMobile } = useModeStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isHarshed, setIsHarshed] = useState(false);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: '',
    message: '',
    detail: '',
  });
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const referralParam = searchParams.get('referral_code') || '';
  const [referral_code, setReferralCode] = useState(referralParam);

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 5000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let endpoint = `${current}users/register`;

    if (!checked) {
      showAlert('warn', 'Privacy Policy/Terms and Conditions must be agreed!');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      showAlert(
        'warn',
        'Password must start with a capital letter, be at least 8 characters, include a number and a special character.',
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPass) {
      showAlert('fail', 'Passwords do not match');
      setLoading(false);
      return;
    }

    let payload = { email, password };
    if (referral_code.length > 0) {
      payload = { ...payload, referral_code };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 201) {
        const data = await response.json();
        console.log('Sign Up Successful', data);
        showAlert('success', 'Sign Up Successful');
        setTimeout(() => {
          sessionStorage.setItem('email-otp', email);
          sessionStorage.setItem('newAccount', JSON.stringify(true));
          setLoading(false);
          navigate('/sign-in');
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('sign up failed: ', errorData);
        showAlert('fail', `${errorData.message}`, `${errorData.detail}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during sign up', error);
      showAlert('fail', 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const SignIn = () => navigate('/sign-in');

  const validatePassword = (pwd) => {
    const startsWithCapital = /^[A-Z]/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(pwd);

    return startsWithCapital && hasMinLength && hasNumber && hasSpecialChar;
  };

  return (
    <div className="w-[620px] h-[560px] mb-40 p-10 bg-white rounded-tl-md rounded-bl-md">
      {alertT.isAlert && (
        <Alerts
          key={`${alertT.level}-${alertT.message}`}
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      <form action="">
        {loading && <Loader />}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-[30px] font-[700] text-[#9f3247]">
            {heading}
          </legend>

          {isMobile && (
            <div className="flex items-center gap-1">
              <p className="text-[#848a8f] text-[12px]">
                Already have Account?
              </p>
              <span
                className="text-[#de506d] text-[12px] cursor-pointer"
                onClick={SignIn}
              >
                Sign In
              </span>
            </div>
          )}

          <Input
            title={`Email *`}
            id={`email`}
            type={`email`}
            htmlFor={`email`}
            className={`focus:outline-[#9f3248]`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative w-full">
            <Input
              title="Password *"
              id="password"
              type={isHarshed ? 'text' : 'password'}
              htmlFor="password"
              className="focus:outline-[#9f3248] pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isHarshed ? (
              <FaEye
                className="absolute right-3 top-8 text-gray-600 cursor-pointer"
                onClick={() => setIsHarshed(!isHarshed)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-3 top-8 text-gray-600 cursor-pointer"
                onClick={() => setIsHarshed(!isHarshed)}
              />
            )}
          </div>

          <div className="relative w-full">
            <Input
              title="Confirm Password *"
              id="confirm-password"
              type={isHarshed ? 'text' : 'password'}
              htmlFor="confirm-password"
              className="focus:outline-[#9f3248] pr-10"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            {isHarshed ? (
              <FaEye
                className="absolute right-3 top-8 text-gray-600 cursor-pointer"
                onClick={() => setIsHarshed(!isHarshed)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-3 top-8 text-gray-600 cursor-pointer"
                onClick={() => setIsHarshed(!isHarshed)}
              />
            )}
          </div>

          <div className="relative w-full">
            <Input
              title="Referral code (optional)"
              id="referral_code"
              type="text"
              htmlFor="referral_code"
              className="focus:outline-[#9f3248]"
              value={referral_code}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Input
              id={`checkbox`}
              type={`checkbox`}
              htmlFor={`checkbox`}
              className={`outline-none border-none`}
              value={checked}
              onChange={() => setChecked(!checked)}
            />
            <p className="text-[#848a8f]">
              By creating an account, you automatically accept our{' '}
              <a className="text-[#de506d]" href="/privacy-policy">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a className="text-[#de506d]" href="/terms-conditions">
                Terms & Condictions
              </a>
              ,
            </p>
          </div>

          <Button
            label={`Register`}
            onClick={submit}
            disable={checked}
            className={`hover:bg-[#de506d]`}
          >
            {loading ? 'Submitting' : 'Logged IN'}
          </Button>
        </fieldset>
      </form>

      <div className="flex flex-col gap-3 mt-2 items-center">
        <p>Or sign Up With</p>
        <div className="flex items-center gap-3">
          <img src={google_auth} alt="Google Sign In" className="w-10 h-10" />
        </div>
      </div>
    </div>
  );
};

AuthFormSginUp.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default AuthFormSginUp;
