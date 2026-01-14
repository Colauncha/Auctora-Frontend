// import { useState } from 'react';
// import style from './css/FundingWallet.module.css';
// import Alerts from '../alerts/Alerts';
// import Loader from '../../assets/loaderWhite';
// import { current } from '../../utils';
// import { PayStacklogo } from '../../Constants';

// const FundingWallet = () => {
//   const [amount, setAmount] = useState('');
//   const [alertT, setAlert] = useState({
//     isAlert: false,
//     level: 'warn',
//     message: '',
//     detail: '',
//   });
//   const [loading, setLoading] = useState(false);

//   const showAlert = (level, message, detail = '') => {
//     setAlert({ isAlert: true, level, message, detail });
//     setTimeout(() => {
//       setAlert({ isAlert: false, level: '', message: '', detail: '' });
//     }, 10000);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     if (!amount) {
//       setTimeout(() => {
//         showAlert('warn', 'Please enter an amount', '');
//         setLoading(false);
//       }, 1000);
//       return;
//     }

//     // if (amount < 1000) {
//     //   setTimeout(() => {
//     //     showAlert('warn', 'Minimum funding amount is ₦1000', '');
//     //     setLoading(false);
//     //   }, 1000);
//     //   return;
//     // }

//     const endpoint = `${current}users/transactions/init?amount=${amount}`;

//     try {
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       if (response.ok) {
//         const resp = await response.json();
//         showAlert(
//           'success',
//           'Funding Initialization successful',
//           'Redirecting you to payment portal',
//         );
//         console.log(resp);
//         setTimeout(() => {
//           window.open(resp.data.authorization_url, '_blank');
//           // window.location.href = resp.data.authorization_url;
//         }, 1000);
//       } else {
//         const resp = await response.json();
//         showAlert(
//           'error',
//           resp.message || 'Funding failed',
//           resp.detail || 'Please try again',
//         );
//       }
//     } catch (error) {
//       showAlert('error', 'An error occurred', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={style.container}>
//       {alertT.isAlert && (
//         <Alerts
//           message={alertT.message}
//           detail={alertT.detail}
//           type={alertT.level}
//         />
//       )}
//       <div className={style.header}>
//         <h2>Powered by</h2>
//         <img src={PayStacklogo} alt="Paystack Logo" />
//       </div>
//       <div className={style.input}>
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Enter amount in Naira"
//         />
//         <button onClick={() => handleSubmit()}>
//           {loading ? (
//             <Loader otherStyles="h-[20px] w-[20px] border-2" />
//           ) : (
//             'Fund Wallet'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FundingWallet;

import { useState } from 'react';
import Alerts from '../alerts/Alerts';
import Loader from '../../assets/loaderWhite';
import { current } from '../../utils';
import { PayStacklogo } from '../../Constants';

const FundingWallet = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: 'warn',
    message: '',
    detail: '',
  });

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 10000);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!amount) {
      showAlert('warn', 'Please enter an amount');
      setLoading(false);
      return;
    }

    const endpoint = `${current}users/transactions/init?amount=${amount}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const resp = await response.json();

      if (!response.ok) {
        showAlert(
          'error',
          resp.message || 'Funding failed',
          resp.detail || 'Please try again'
        );
        return;
      }

      showAlert(
        'success',
        'Funding initialized successfully',
        'Redirecting you to payment portal'
      );

      setTimeout(() => {
        window.open(resp.data.authorization_url, '_blank');
      }, 1000);
    } catch (error) {
      showAlert('error', 'An error occurred', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {alertT.isAlert && (
        <Alerts
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-sm text-gray-500">Powered by</h2>
          <img src={PayStacklogo} alt="Paystack Logo" className="h-6" />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Funding Amount
          </label>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              ₦
            </span>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-gray-500">Secure payment via Paystack</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-medium text-white bg-[#9f3247] hover:bg-[#9f3247de] disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
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
