// import { useState } from 'react';
// import style from './css/Withdrawal.module.css';
// import Alerts from '../alerts/Alerts';
// import Loader from '../../assets/loaderWhite';
// import { PayStacklogo } from '../../Constants';
// import { current, currencyFormat } from '../../utils';

// const Withdrawal = () => {
//   const [amount, setAmount] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const [alertT, setAlert] = useState({
//     isAlert: false,
//     level: 'warn',
//     message: '',
//     detail: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [isAuthenticating, setIsAuthenticating] = useState(false);

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

//     if (!password) {
//       setTimeout(() => {
//         showAlert('warn', 'Please enter your password', '');
//         setLoading(false);
//       }, 1000);
//       return;
//     }

//     const endpoint = `${current}users/transactions/withdraw?amount=${amount}`;
//     const identifier = JSON.parse(sessionStorage.getItem('_user')).email;

//     try {
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           identifier,
//           password,
//         }),
//       });
//       if (response.ok) {
//         const resp = await response.json();
//         showAlert(
//           'success',
//           resp.message || 'Withdrawal Initialization successful',
//           `Withdrawal of ${currencyFormat(resp.data.amount)} is ${
//             resp.data.status
//           }`,
//         );
//         console.log(resp);
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

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
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
//         <div className="flex flex-row w-[100%]">
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount in Naira"
//           />
//           <button
//             onClick={() => setIsAuthenticating(!isAuthenticating)}
//             className="bg-blue-500 text-white"
//           >
//             Authenticate
//           </button>
//         </div>
        
//         {/* Password input field that appears when authenticating */}
//         {isAuthenticating && (
//           <div className="relative w-[100%] mt-3">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? (
//                 <span className="text-lg">👁️</span> // Eye open icon
//               ) : (
//                 <span className="text-lg">👁️‍🗨️</span> // Eye closed icon
//               )}
//             </button>
//           </div>
//         )}

//         <button
//           className="flex justify-center items-center"
//           onClick={() => handleSubmit()}
//         >
//           {loading ? (
//             <Loader otherStyles="h-[20px] w-[20px] border-2" />
//           ) : (
//             'Withdraw'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Withdrawal;
import { useState } from 'react';
import style from './css/Withdrawal.module.css';
import Alerts from '../alerts/Alerts';
import Loader from '../../assets/loaderWhite';
import { PayStacklogo } from '../../Constants';
import { current, currencyFormat } from '../../utils';
import { Eye, EyeOff } from 'lucide-react';

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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

    if (!password) {
      showAlert('warn', 'Please enter your password');
      setLoading(false);
      return;
    }

    const endpoint = `${current}users/transactions/withdraw?amount=${amount}`;
    const identifier = JSON.parse(sessionStorage.getItem('_user')).email;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const resp = await response.json();

      if (!response.ok) {
        showAlert('error', resp.message || 'Withdrawal failed', resp.detail);
        return;
      }

      showAlert(
        'success',
        resp.message || 'Withdrawal initialized',
        `Withdrawal of ${currencyFormat(resp.data.amount)} is ${
          resp.data.status
        }`
      );
    } catch (error) {
      showAlert('error', 'Unexpected error', error.message);
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

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-sm text-gray-500">Powered by</h2>
          <img src={PayStacklogo} alt="Paystack Logo" className="h-6" />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Withdrawal Amount
          </label>

          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₦ Enter amount"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setIsAuthenticating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Authenticate
            </button>
          </div>
        </div>

        {/* Password */}
        {isAuthenticating && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Account Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 rounded-xl font-medium text-white bg-[#9f3247] hover:bg-[#9f3247de] disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <Loader otherStyles="h-[20px] w-[20px] border-2" />
          ) : (
            'Withdraw Funds'
          )}
        </button>
      </div>
    </div>
  );
};

export default Withdrawal;
