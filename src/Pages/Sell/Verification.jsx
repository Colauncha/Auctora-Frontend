import Breadcrumbs from "../../Components/Breadcrumbs";
import { useNavigate } from "react-router-dom";

const Verification = () => {

  const navigate = useNavigate();
  const Next = () => {
    navigate("/Add-Product");
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex justify-center items-center">
            <div className="bg-white p-10 mb-6 mt-4 rounded-lg w-full max-w-full">
              <h1 className="text-4xl font-bold text-maroon mb-6 text-left">
                Verification
              </h1>
              <p className="text-lg text-gray-700 mt-20 mb-28 text-center">
                Please wait for your confirmation mail.
              </p>
              <button
              onClick={Next}
            // onClick={() => handleStepChange(activeStep + 1)}
                type="button"
                className="mt-6 w-40 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon mx-auto block"
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
