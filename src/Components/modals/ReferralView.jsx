import { useState, useEffect } from 'react';
import style from './css/ReferralView.module.css';
import Button from '../../Components/Button';
import { AddIcon } from '../../Constants';
import Loader from '../../assets/loader2';
import { current, currencyFormat } from '../../utils';
import Alerts from '../alerts/Alerts';
import { FaEarthAfrica, FaCode } from 'react-icons/fa6';

const ReferralView = () => {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [referredUsers, setReferredUsers] = useState(null);
  const [copied, setCopied] = useState(false);
  const [viewBox, setViewBox] = useState({ state: 'code', value: code });
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: 'warn',
    message: '',
    detail: '',
  });

  useEffect(() => {
    setTimeout(() => {
      const user = JSON.parse(sessionStorage.getItem('_user'));
      if (user?.referral_code !== null) {
        setCode(user?.referral_code);
        setUrl(
          `https://biddius.com/sign-up?referral_code=${user?.referral_code}`,
        );
        setViewBox({ state: 'code', value: user?.referral_code });
        if (user.referred_users) {
          setReferredUsers(Object.values(user.referred_users));
        }
      }
      setLoading(false);
    }, 1500);
  }, []);

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 10000);
  };

  const generateCode = async () => {
    setLoading(true);
    const endpoint = `${current}users/referral_code`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const resp = await response.json();
        setCode(resp.data.referral_code);
        setUrl(resp.data.referral_url);
        setViewBox({ state: 'code', value: resp.data.referral_code });
        showAlert(
          'success',
          'Referral code generated successfully',
          'You can now share your referral code with others.',
        );
      } else {
        const errorData = await response.json();
        showAlert(
          'fail',
          errorData.message,
          errorData.detail || 'An error occurred while generating the code.',
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setViewBox((prev) => ({
      state: prev.state === 'code' ? 'url' : 'code',
      value: prev.state === 'code' ? url : code,
    }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(viewBox.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={style.container}>
      {alertT.isAlert && (
        <Alerts
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      <div className={style.main}>
        <div className="flex w-full shadow-sm">
          <input
            value={viewBox.value}
            placeholder="Referral Code"
            readOnly
            className="py-1 lg:w-[30dvw] md:w-[55dvw] sm:w-[50dvw] text-[#7d2435] text-xs indent-2 bg-[#fafafaaa] rounded-s-lg focus:outline-none"
            name="text"
            type="text"
          />
          <button
            onClick={toggleView}
            className="py-1 text-white bg-[#7d243599] flex justify-center items-center w-10 h-10 transition duration-300 hover:bg-[#7d243544] relative group"
          >
            {viewBox.state === 'code' ? (
              <FaEarthAfrica size={20} color="#ffffff" />
            ) : (
              <FaCode size={20} color="#ffffff" />
            )}
            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
              Toggle Code/URL
            </span>
          </button>
          <button
            onClick={handleCopy}
            className={`py-1 rounded-e-lg text-white flex justify-center items-center w-10 h-10 transition duration-300 relative group ${
              copied ? 'bg-green-500' : 'bg-[#7d243599] hover:bg-[#7d243544]'
            }`}
          >
            {/* Copy icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none"
            >
              <rect width={24} height={24} />
              <rect
                x={4}
                y={8}
                width={12}
                height={12}
                rx={1}
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6V5C8 4.44772 8.44772 4 9 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H18"
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 2"
              />
            </svg>
            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
              Copy Referral Code/URL
            </span>
          </button>
        </div>
        <div className={style.generate}>
          <Button
            icon={AddIcon}
            className={style.button}
            iconClassName={style.buttonIcon}
            label="Generate Code"
            onClick={generateCode}
          />
          {loading && <Loader otherStyles="h-[20px] w-[20px] border-2" />}
        </div>
      </div>

      <div className={style.list}>
        {referredUsers && referredUsers.length > 0 ? (
          referredUsers.map((referee, ind) => (
            <div className={style.listRef} key={ind}>
              <div>{referee.email}</div>
              <div>
                <span>
                  <strong>Amount: </strong>
                  {currencyFormat(referee.commissions_amount)}
                </span>
                <span className="ml-4">
                  <strong>Count:</strong> {referee.commissions_paid}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            No referees yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralView;
