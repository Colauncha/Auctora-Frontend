import { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { current } from '../../utils';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isHarshed, setIsHarshed] = useState(false);
  const [isHarshedC, setIsHarshedC] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(true);
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const url = `${current}users/get_reset_token?email=${encodeURIComponent(
      email,
    )}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (response.ok) {
        setMessage('Reset token sent to your email.');
        setStep(2); // Move to step 2
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send reset token.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while requesting reset token.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must start with a capital letter, be at least 8 characters, include a number and a special character.',
      );
      return;
    }
    if (!validatePassword(confirmPassword)) {
      setError(
        'Password must start with a capital letter, be at least 8 characters, include a number and a special character.',
      );
      return;
    }

    const url = `${current}users/reset_password`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password,
          confirm_password: confirmPassword,
        }),
      });

      if (response.ok) {
        setMessage('Password reset successful. You can now log in.');
        setSuccess(true);
        setStep(1);
        setEmail('');
        setToken('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while resetting password.');
    }
  };

  const validatePassword = (pwd) => {
    const startsWithCapital = /^[A-Z]/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(pwd);

    return startsWithCapital && hasMinLength && hasNumber && hasSpecialChar;
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-2 mb-40 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-center">
          {step === 1 ? 'Forgot Password' : 'Reset Your Password'}
        </h2>

        {message && (
          <p className="text-red-800 font-bold text-center mb-2 text-sm">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 font-bold text-center mb-2 text-sm">
            {error}
          </p>
        )}

        {success && (
          <div className="flex justify-center mb-3">
            <button
              type="submit"
              className="w-[80px] bg-red-800 text-white py-1.5 rounded-md hover:bg-red-900 text-sm"
              onClick={() => navigate('/sign-in')}
            >
              Login
            </button>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="flex flex-col gap-3">
            <input
              title="Email"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full px-4 bg-red-800 text-white py-2 rounded-md hover:bg-red-900 text-sm"
            >
              Send Reset Token
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
            <input
              title="Reset Token"
              id="token"
              type="text"
              placeholder="Enter reset token"
              value={token}
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <div className="relative">
              <input
                title="New Password"
                id="password"
                type={isHarshed ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                className="border border-gray-300 rounded-md p-2 w-full text-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isHarshed ? (
                <FaEye
                  className="absolute right-2 top-2.5 text-gray-500 cursor-pointer text-sm"
                  onClick={() => setIsHarshed(!isHarshed)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute right-2 top-2.5 text-gray-500 cursor-pointer text-sm"
                  onClick={() => setIsHarshed(!isHarshed)}
                />
              )}
            </div>
            <div className="relative">
              <input
                title="Confirm Password"
                id="confirmPassword"
                type={isHarshedC ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                className="border border-gray-300 rounded-md p-2 w-full text-sm"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {isHarshedC ? (
                <FaEye
                  className="absolute right-2 top-2.5 text-gray-500 cursor-pointer text-sm"
                  onClick={() => setIsHarshedC(!isHarshedC)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute right-2 top-2.5 text-gray-500 cursor-pointer text-sm"
                  onClick={() => setIsHarshedC(!isHarshedC)}
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 bg-red-800 text-white py-2 rounded-md hover:bg-red-900 text-sm"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
