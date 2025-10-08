import { useState } from 'react';
import { Eye, EyeOff, House } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Store/AuthStore';
import { current } from '../../utils';
import Fetch from '../../utils/Fetch';
import Loader from '../../assets/loader2';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setMessage('Email and password are required');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { data, error, success } = await Fetch({
        url: current + 'users/login',
        method: 'POST',
        requestData: { identifier, password },
      });

      if (!success) {
        setMessage(`Invalid credentials or login failed, ${error}`);
        setMessageType('error');
        setLoading(false);
        return;
      }
      console.log(data);
      login(true, data?.data?.token?.token, data?.data?.user);

      const role = data.data.user.role;
      if (role === 'client') {
        setMessage('Unauthorized. Please use regular login.');
        setMessageType('error');
        setTimeout(() => {
          navigate('/sign-in');
        }, 1000);
      } else {
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] w-full p-10">
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl text-[#110000C2] font-semibold mb-6">
          Admin Log in
        </h2>

        <span
          className="fixed top-5 left-5 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#9f3248] to-[#de506d] hover:to-[#de506cec] hover:from-[#9f3248e4] hover:shadow-lg hover:scale-105 rounded-full shadow-md transition-all duration-500"
          onClick={() => navigate('/')}
        >
          <House className="hover:scale-105 text-white" size={24} />
        </span>
        {/* Feedback message */}
        {message && (
          <div
            className={`mb-4 text-center px-4 py-2 rounded w-full max-w-sm ${
              messageType === 'success'
                ? 'bg-green-100 text-green-700 border border-green-400'
                : 'bg-red-100 text-red-700 border border-red-400'
            }`}
          >
            {message}
          </div>
        )}

        <form className="w-full max-w-sm">
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Email
          </label>
          <input
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Password
          </label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-[#94B0F8] rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-[#113ca8]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex relative w-full justify-between mb-6">
            {/* Login Button with Spinner */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`flex items-center justify-center w-[100%] h-10 rounded-2xl px-4 py-2 transition cursor-pointer shadow-md ${
                loading
                  ? 'bg-gradient-to-r from-[#9f32485b] to-[#de506c44] text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#9f3248] to-[#de506d] hover:from-[#de506d] hover:to-[#9f3248] text-white'
              }`}
            >
              {loading ? <Loader otherStyles={'w-5 h-5'} /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
