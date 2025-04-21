// ForgotPassword.jsx or LoginForm.jsx (more appropriate name maybe)
import { useState } from "react";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // const [error, setError] = useState("");
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Do login logic or password reset logic
    // setError("");
  };

  return (

    <form onSubmit={handleSubmit} className="m-52 flex flex-col gap-4">
      <input 
      title={`Email`}
      id={`email`}
      type="email"
      placeholder="Email"
      value={email}
      className="m-1 border-2 border-gray-200 rounded-md p-2"
      onChange={(e) => setEmail(e.target.value)}
      required
      />
      <button type="submit" onClick={handleSubmit}>
        Reset Password
      </button>
      
      
    </form>
  );
};

export default ForgotPassword;
