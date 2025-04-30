import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './css/ReferralView.module.css';
import Button from '../../Components/Button';
import { AddIcon } from '../../Constants';
import Loader from '../../assets/loader2';
import { current } from '../../utils';
import Alerts from '../alerts/Alerts';
import { FaEarthAfrica, FaCode } from 'react-icons/fa6';

const ReferralView = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewBox, setViewBox] = useState({
    state: 'code',
    value: code,
  });
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: 'warn',
    message: '',
    detail: '',
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const generateCode = async () => {
    setLoading(true);
    const endpoint = `${current}users/referral_code`;

    try {
      let response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const resp = await response.json();
        setCode(resp.data.referral_code);
        setUrl(resp.data.referral_url);
        setViewBox({
          state: 'code',
          value: resp.data.referral_code,
        });
        console.log(resp);
        setLoading(false);
        setAlert({
          isAlert: true,
          level: 'success',
          message: 'Referral code generated successfully',
        });
      } else {
        const errorData = await response.json();
        console.error('sign up failed: ', errorData);
        setLoading(false);
        setAlert({
          isAlert: true,
          message: `${errorData.message}`,
          detail: `${errorData.detail}`,
          level: 'fail',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleView = () => {
    if (viewBox.state === 'code') {
      setViewBox({
        state: 'url',
        value: url,
      });
    } else {
      setViewBox({
        state: 'code',
        value: code,
      });
    }
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
            className="py-1 w-[30dvw] text-[#7d2435] text-xs indent-2 bg-[#fafafaaa] rounded-s-lg focus:outline-none"
            name="text"
            type="text"
          />
          <button
            onClick={() => toggleView()}
            className="py-1 text-white bg-[#7d243599] flex justify-center items-center w-10 h-10 transition duration-300 hover:bg-[#7d243544] relative group"
          >
            {viewBox.state === 'code' ? (
              <FaEarthAfrica size={20} color={'#ffffff'} />
            ) : (
              <FaCode size={20} color={'#ffffff'} />
            )}
            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
              Toggle Code/URL
            </span>
          </button>
          <button
            onClick={() => handleCopy()}
            className={`py-1 rounded-e-lg text-white bg-[#7d243599] flex justify-center items-center w-10 h-10 transition duration-300 hover:bg-[#7d243544] relative group ${
              copied && 'bg-green-500'
            }`}
          >
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
            onClick={() => generateCode()}
          />
          {loading && <Loader otherStyles={'h-[20px] w-[20px] border-2'} />}
        </div>
      </div>
      <div className={style.list}>
        {data?.length >= 0 ? (
          data?.map((referee, ind) => {
            <div key={ind}>{referee.email}</div>;
          })
        ) : (
          <div className="flex items-center justify-center">
            No referees yet
          </div>
        )}
      </div>
    </div>
  );
};

ReferralView.propTypes = {
  data: PropTypes.arrayOf(Object),
};

export default ReferralView;
