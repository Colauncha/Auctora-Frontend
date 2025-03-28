import { useState } from "react"; // Import useState for state management
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../Store/AuthStore";

const Ads = () => {
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const signup = () => {
    navigate("/sign-up", { state: { referrer: "Hompage" } });
  };

  const closeAds = () => {
    setIsVisible(false); // Hide the Ads component
  };

  if (!isVisible) return null; // If not visible, don't render the component

  return (
    <div className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] h-[45px] w-full flex items-center justify-center gap-2 text-[12px] md:text-[14px] overflow-hidden mb-4 relative">
      <button
        onClick={closeAds}
        className="absolute right-10 top-5 transform -translate-y-1/2 text-white text-xl font-bold"
        aria-label="Close Ads"
      >
        ×
      </button>
      <div className="max-w-[1280px] w-full px-4 flex items-center justify-center gap-4">
        {isAuthenticated ? (
          <p className="text-white">Welcome to Auctora</p>
        ) : (
          <>
            <p className="text-white">Sign up and get your first order.</p>
            <Button
              label="Sign Up Now"
              className="text-white bg-transparent h-[28px] border border-[#ffffff55] px-3 py-1 rounded-md hover:bg-[#9F3247] hover:text-[#ffffff] transition-all"
              onClick={signup}
              aria-label="Sign Up Now"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Ads;
