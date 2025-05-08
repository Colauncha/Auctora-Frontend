import { useState } from 'react';
import style from './css/Withdrawal.module.css';
import Alerts from '../alerts/Alerts';
import Loader from '../../assets/loader2';
import { PayStacklogo } from '../../Constants';

const Withdrawal = () => {
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
        <button
          onClick={() => {
            if (amount) {
              showAlert('success', 'Funding successful', '');
            } else {
              showAlert('error', 'Please enter an amount', '');
            }
          }}
        >
          {loading ? <Loader /> : 'Withdraw'}
        </button>
      </div>
    </div>
  );
};

export default Withdrawal;
