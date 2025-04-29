
import { google_auth } from "../../Constants";
import PropTypes from 'prop-types';
import Button from "../Button";
import Input from "./Input";
import useModeStore from "../../Store/Store";
import { useNavigate } from "react-router-dom";
import Loader from "../../assets/loader";
import { useState } from "react";
import useAuthStore from "../../Store/AuthStore";
import style from "./css/auth.module.css";
import { current } from "../../utils";
import { FaEyeSlash } from "react-icons/fa";

const AuthFormSignIn = ({ heading }) => {
  const { isMobile } = useModeStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHarshed, setIsHarshed] = useState(false);
  const [error, setError] = useState("");
  const [alertT, setAlert] = useState({ isAlert: false, level: 'warn', message: "" });
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const signUp = () => navigate("/sign-up");
  const forgotPassword = () => navigate("/forgot-password");

  const validatePassword = (pwd) => {
    const startsWithCapital = /^[A-Z]/.test(pwd);
    const hasMinLength = pwd.length >= 8;
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(pwd);

    return startsWithCapital && hasMinLength && hasNumber && hasSpecialChar;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validatePassword(password)) {
      setLoading(false);
      setError("Password must start with a capital letter, be at least 8 characters, include a number and a special character.");
      return;
    }

    const data = {
      identifier: email,
      password
    };

    let endpoint = `${current}users/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', JSON.stringify(data.data.token));
        setAlert({ isAlert: true, level: "success", message: "Log In Successful" });

        setTimeout(() => {
          login(data.data.token.split('.')[0]);
          setLoading(false);
          sessionStorage.getItem('email-otp') ? navigate('/otp') : navigate('/dashboard');
        }, 500);
      } else {
        const errorData = await response.json();
        setTimeout(() => {
          setLoading(false);
          setAlert({ isAlert: true, message: `${errorData.message}: ${errorData.detail}` });
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setAlert({ isAlert: true, message: error.message });
      }, 500);
    }
  };

  return (
    <div className="w-[620px] h-[500px] p-10 bg-white rounded-tl-md rounded-bl-md">
      <form onSubmit={submit}>
        {loading && <Loader />}
        <div className={
          `${alertT.isAlert ? style.alertShow : style.alertNone}
           ${alertT.level === 'success' ? style.alertSuccess : ''}`
        }>
          {alertT.message}
        </div>
        <fieldset className="flex flex-col gap-3">
          <legend className="text-[30px] font-[700] text-[#9f3247]">
            {heading}
          </legend>

          {isMobile && (
            <div className="flex items-center gap-1">
              <p className="text-[#848a8f] text-[12px]">
                Don&apos;t have an account?{" "}
              </p>
              <span
                className="text-[#de506d] text-[12px] cursor-pointer"
                onClick={signUp}
              >
                Sign Up
              </span>
            </div>
          )}

          <Input
            title={`Email`}
            id={`email`}
            value={email}
            type={`email`}
            htmlFor={`email`}
            className={`focus:outline-[#9f3248]`}
            onChange={(e) => {
              setAlert({ isAlert: false, message: "" });
              setEmail(e.target.value);
            }}
          />

          <div className="relative w-full">
            <Input
              title={`Password`}
              id={`password`}
              type={isHarshed ? "text" : "password"}
              htmlFor={`password`}
              value={password}
              className={`focus:outline-[#9f3248] w-full`}
              onChange={(e) => {
                setAlert({ isAlert: false, message: "" });
                setPassword(e.target.value);
              }}
            />
            <FaEyeSlash
            className="absolute right-3 top-8 text-gray-600 cursor-pointer"
            onClick={() => setIsHarshed(!isHarshed)}
          />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={forgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            label={`Login`}
            type="submit"
            className={`hover:bg-[#de506d]`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Login"}
          </Button>
        </fieldset>
      </form>

      <div className="flex flex-col gap-3 mt-2 items-center">
        <p>Or Login with</p>
        <div className="flex items-center gap-3">
          <img src={google_auth} alt="" className="w-10 h-10 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

AuthFormSignIn.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default AuthFormSignIn;
