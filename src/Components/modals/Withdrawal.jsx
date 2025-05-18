import { useState } from 'react';
import style from './css/Withdrawal.module.css';
import Alerts from '../alerts/Alerts';
import Loader from '../../assets/loaderWhite';
import { PayStacklogo } from '../../Constants';
import { current, currencyFormat } from '../../utils';

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: 'warn',
    message: '',
    detail: '',
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 10000);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!amount) {
      setTimeout(() => {
        showAlert('warn', 'Please enter an amount', '');
        setLoading(false);
      }, 1000);
      return;
    }

    if (!password) {
      setTimeout(() => {
        showAlert('warn', 'Please enter your password', '');
        setLoading(false);
      }, 1000);
      return;
    }

    // if (amount < 1000) {
    //   setTimeout(() => {
    //     showAlert('warn', 'Minimum funding amount is ₦1000', '');
    //     setLoading(false);
    //   }, 1000);
    //   return;
    // }

    const endpoint = `${current}users/transactions/withdraw?amount=${amount}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });
      if (response.ok) {
        const resp = await response.json();
        showAlert(
          'success',
          resp.message || 'Withdrawal Initialization successful',
          `Withdrawal of ${currencyFormat(resp.data.amount)} is ${
            resp.data.status
          }`,
        );
        console.log(resp);
      } else {
        const resp = await response.json();
        showAlert(
          'error',
          resp.message || 'Funding failed',
          resp.detail || 'Please try again',
        );
      }
    } catch (error) {
      showAlert('error', 'An error occurred', error.message);
    } finally {
      setLoading(false);
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
      <div className={style.header}>
        <h2>Powered by</h2>
        <img src={PayStacklogo} alt="Paystack Logo" />
      </div>
      <div className={style.input}>
        <div className="flex flex-row w-[100%]">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in Naira"
          />
          <button
            onClick={() => setIsAuthenticating(!isAuthenticating)}
            className="bg-blue-500 text-white"
          >
            Authenticate
          </button>
        </div>
        {isAuthenticating && (
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        )}
        <button
          className="flex justify-center items-center"
          onClick={() => handleSubmit()}
        >
          {loading ? (
            <Loader otherStyles="h-[20px] w-[20px] border-2" />
          ) : (
            'Withdraw'
          )}
        </button>
      </div>
    </div>
  );
};

export default Withdrawal;
