import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1 = send email, Step 2 = reset password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHarshed, setIsHarshed] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `https://api.biddius.com/api/users/get_reset_token?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        setMessage("Reset token sent to your email.");
        setStep(2); // Move to step 2
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send reset token.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while requesting reset token.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must start with a capital letter, be at least 8 characters, include a number and a special character."
      );
      return;
    }
    if (!validatePassword(confirmPassword)) {
      setError(
        "Password must start with a capital letter, be at least 8 characters, include a number and a special character."
      );
      return;
    }

    try {
      const response = await fetch(
        `https://api.biddius.com/api/users/reset_password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            password,
            confirm_password: confirmPassword,
          }),
        }
      );

      if (response.ok) {
        setMessage("Password reset successful. You can now log in.");
        setSuccess(true)
        setStep(1); // Reset back to step 1 if you want
        setEmail("");
        setToken("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while resetting password.");
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
    <div className="m-52 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">
        {step === 1 ? "Forgot Password" : "Reset Your Password"}
      </h2>

      {message && <p className="text-blue-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {step === 1 ? (
        <form onSubmit={handleRequestToken} className="flex flex-col gap-4">
          <input
            title="Email"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            className="m-1 border-2 border-gray-200 rounded-md p-2"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Send Reset Token
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <input
            title="Reset Token"
            id="token"
            type="text"
            placeholder="Enter reset token"
            value={token}
            className="m-1 border-2 border-gray-200 rounded-md p-2 w-full"
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <div className="relative w-full">
            <input
              title="New Password"
              id="password"
              type={isHarshed ? "text" : "password"}
              // htmlFor="password"
              placeholder="New Password"
              value={password}
              className="m-1 border-2 border-gray-200 rounded-md p-2 w-full"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaEyeSlash
              className="absolute right-8 top-5 text-gray-600 cursor-pointer"
              onClick={() => setIsHarshed(!isHarshed)}
            />
          </div>
          <div className="relative w-full">
            <input
              title="Confirm Password"
              id="confirmPassword"
              type={isHarshed ? "text" : "password"}
              // htmlFor="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              className="m-1 border-2 border-gray-200 rounded-md p-2 w-full"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FaEyeSlash
              className="absolute right-8 top-5 text-gray-600 cursor-pointer"
              onClick={() => setIsHarshed(!isHarshed)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
