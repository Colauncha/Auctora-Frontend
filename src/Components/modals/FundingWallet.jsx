import { useState } from 'react';
import style from './css/FundingWallet.module.css';
import Alerts from '../alerts/Alerts';
import Loader from '../../assets/loaderWhite';
import { current } from '../../utils';
import { PayStacklogo } from '../../Constants';

const FundingWallet = () => {
  const [amount, setAmount] = useState('');
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: 'warn',
    message: '',
    detail: '',
  });
  const [loading, setLoading] = useState(false);

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

    // if (amount < 1000) {
    //   setTimeout(() => {
    //     showAlert('warn', 'Minimum funding amount is ₦1000', '');
    //     setLoading(false);
    //   }, 1000);
    //   return;
    // }

    const endpoint = `${current}users/transactions/init?amount=${amount}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const resp = await response.json();
        showAlert(
          'success',
          'Funding Initialization successful',
          'Redirecting you to payment portal',
        );
        console.log(resp);
        setTimeout(() => {
          window.open(resp.data.authorization_url, '_blank');
          // window.location.href = resp.data.authorization_url;
        }, 1000);
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
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in Naira"
        />
        <button onClick={() => handleSubmit()}>
          {loading ? (
            <Loader otherStyles="h-[20px] w-[20px] border-2" />
          ) : (
            'Fund Wallet'
          )}
        </button>
      </div>
    </div>
  );
};

export default FundingWallet;
