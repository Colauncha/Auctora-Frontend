import { useState } from "react";
import deliveryIcon from "../../../assets/svg/DeliverySVG.svg";
import photosIcon from "../../../assets/svg/Photos.svg";
import categoryIcon from "../../../assets/svg/category.svg";
import descriptionIcon from "../../../assets/svg/Description.svg";
import Description from "./Description";
import Categories from "./Categories";
import Photos from "./Photos";
import Delivery from "./Delivery";
import Breadcrumbs from "../../../Components/Breadcrumbs";

const ProgressTracker = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValidity, setFormValidity] = useState({
    0: false, // Description
    1: false, // Categories
    2: false, // Photos
    3: false, // Delivery
  });

    
    const [formData, setFormData] = useState({
      item: {
        name: '',
        description: '',
        category_id: '',
        sub_category_id: '',
      },
      product: {
        start_price: 0,
        current_price: 0,
        buy_now: false,
        buy_now_price: 0,
        start_date: new Date().toISOString(),
        end_date: '',
        users_id: sessionStorage.getItem('_user')
          ? JSON.parse(sessionStorage.getItem('_user')).id
          : '',
        private: false,
        participants: [],
        status: 'pending',
      },
      photos: [],
      delivery: {
        options: [],
        address: '',
      },
    });
  

  const steps = ["Description", "Categories", "Photos", "Delivery"];

    // Add updateFormData function
    const updateFormData = (newData) => {
      setFormData(newData);
    };

  const handleStepChange = (index) => {
    // Prevent moving to any step unless all previous steps are completed
    if (index > 0) {
      const allPreviousStepsValid = Array(index).fill().every((_, i) => formValidity[i]);
      if (!allPreviousStepsValid) {
        setErrorMessage(`Please complete all previous steps first`);
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    }
  
    // Handle forward movement (only if current step is valid)
    if (index > activeStep) {
      if (!formValidity[activeStep]) {
        setErrorMessage(`Please complete the current step first`);
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
      setCompletedSteps([...completedSteps, activeStep]);
    } 
    // Handle backward movement
    else if (index < activeStep) {
      setCompletedSteps(completedSteps.filter((step) => step < index));
    }
  
    setActiveStep(index);
    setErrorMessage(''); // Clear any existing error when navigation succeeds
  };

  const updateFormValidity = (stepIndex, isValid) => {
    setFormValidity((prev) => ({
      ...prev,
      [stepIndex]: isValid,
    }));

    if (isValid && !completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const stepIcons = [descriptionIcon, categoryIcon, photosIcon, deliveryIcon];

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      {/* Your existing styles remain unchanged */}
      <style>{`
        /* 500px and below */
        @media (max-width: 500px) {
          .progress-step-icon {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
          .progress-step-icon img {
            width: 0.75rem !important;
            height: 0.75rem !important;
          }
          .progress-step-label {
            font-size: 0.75rem !important;
            margin-top: 0.25rem !important;
          }
          .progress-connector {
            width: 1.5rem !important;
            top: -0.6rem !important;
          }
        }

        /* 360px and below - Extra compact */
        @media (max-width: 360px) {
          .progress-step-icon {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
          .progress-step-icon img {
            width: 0.65rem !important;
            height: 0.65rem !important;
          }
          .progress-connector {
            width: 1rem !important;
          }
          .progress-step-gap {
            margin-left: 0.25rem !important;
            margin-right: 0.25rem !important;
          }
          .progress-step-label {
            font-size: 0.7rem !important;
          }
        }
      `}</style>

      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="bg-[#F0F0F0] flex flex-col items-center space-y-3 py-3 min-h-[calc(100vh-200px)]">
            {/* Error message display */}
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2 animate-pulse">
                {errorMessage}
              </div>
            )}

            {/* Rest of your existing JSX remains unchanged */}
            <div className="flex items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  {/* Step Indicator */}
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleStepChange(index)}
                  >
                    <div
                      className={`progress-step-icon w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                        index === activeStep
                          ? 'bg-maroon'
                          : completedSteps.includes(index)
                          ? 'bg-green-500'
                          : 'bg-white'
                      }`}
                    >
                      <img
                        src={stepIcons[index]}
                        alt={step}
                        className={`transition-all ${
                          index === activeStep || completedSteps.includes(index)
                            ? 'filter brightness-0 invert'
                            : ''
                        }`}
                      />
                    </div>
                    <p
                      className={`progress-step-label text-sm mt-2 font-bold transition-all ${
                        completedSteps.includes(index)
                          ? 'text-green-500'
                          : 'text-black'
                      }`}
                    >
                      {step}
                    </p>
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="progress-step-gap flex items-center justify-center mx-1 relative top-[-12px]">
                      <div className="progress-connector w-12 h-0.5 border-t-2 border-dotted border-red-500 transition-all" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Active Step Content */}
            {activeStep === 0 && (
              <Description
              activeStep={activeStep}
              updateFormValidity={updateFormValidity}
              formData={formData}           // Add this prop
              updateFormData={updateFormData} // Add this prop
              handleStepChange={handleStepChange}
            />
            )}
           {activeStep === 1 && (
              <Categories
              activeStep={activeStep}
              updateFormValidity={updateFormValidity}
              formData={formData}
              updateFormData={updateFormData}
              handleStepChange={handleStepChange}
            />
            )}
            {activeStep === 2 && (
  <Photos
  activeStep={activeStep}
  handleStepChange={handleStepChange}
  formData={formData}           // Required
  updateFormData={updateFormData} // Required
  updateFormValidity={updateFormValidity} // Required for validation
/>
            )}
            {activeStep === 3 && (
                <Delivery
                activeStep={activeStep}
                handleStepChange={handleStepChange}
                formData={formData}
                updateFormData={updateFormData}
                updateFormValidity={updateFormValidity}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleStepChange(activeStep - 1)}
                disabled={activeStep === 0}
                className={`px-3 py-2 rounded-lg transition ${
                  activeStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handleStepChange(activeStep + 1)}
                disabled={
                  !formValidity[activeStep] || activeStep === steps.length - 1
                }
                className={`px-6 py-2 rounded-lg transition ${
                  !formValidity[activeStep] || activeStep === steps.length - 1
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
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

export default ProgressTracker;