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
  const [formValidity, setFormValidity] = useState({
    0: false, // Description
    1: false, // Categories
    2: false, // Photos
    3: false, // Delivery
  });

  const steps = ["Description", "Categories", "Photos", "Delivery"];

  const handleStepChange = (index) => {
    // If trying to go forward
    if (index > activeStep) {
      // Only allow if current step is completed
      if (formValidity[activeStep]) {
        console.log(
          `Cannot proceed to ${steps[index]}: Current step ${steps[activeStep]} is not valid.`,
          `validity: ${formValidity}`,
        );
        return;
      }

      // Update completed steps
      setCompletedSteps([...completedSteps, activeStep]);
    }
    // If going backward, remove all completed steps after the new index
    else if (index < activeStep) {
      setCompletedSteps(completedSteps.filter((step) => step < index));
    }

    setActiveStep(index);
  };

  // Function to update form validity
  const updateFormValidity = (stepIndex, isValid) => {
    setFormValidity((prev) => ({
      ...prev,
      [stepIndex]: isValid,
    }));

    // If the form becomes valid and we're on this step, mark as completed
    //   if (isValid && !completedSteps.includes(stepIndex) {
    //     setCompletedSteps([...completedSteps, stepIndex]);
    //   }
    // };

    if (isValid && !completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const stepIcons = [descriptionIcon, categoryIcon, photosIcon, deliveryIcon];

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="bg-[#F0F0F0] flex flex-col items-center space-y-3 py-3 min-h-[calc(100vh-200px)]">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  {/* Step Section */}
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleStepChange(index)}
                  >
                    {/* Step Icon */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${
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
                        className={`w-4 h-4 ${
                          index === activeStep || completedSteps.includes(index)
                            ? 'filter brightness-0 invert'
                            : ''
                        }`}
                      />
                    </div>

                    {/* Step Label */}
                    <p
                      className={`text-sm mt-2 font-bold ${
                        completedSteps.includes(index)
                          ? 'text-green-500'
                          : 'text-black'
                      }`}
                    >
                      {step}
                    </p>
                  </div>

                  {/* Dotted Line */}
                  {index < steps.length - 1 && (
                    <div className="flex items-center justify-center mx-1 relative top-[-12px]">
                      <div
                        className="w-12 h-0.5 border-t-2 border-dotted border-red-500"
                        style={{ borderSpacing: '2px' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Render Active Step Component */}
            {activeStep === 0 && (
              <Description
                activeStep={activeStep}
                updateFormValidity={updateFormValidity}
                handleStepChange={handleStepChange}
              />
            )}
            {activeStep === 1 && (
              <Categories
                activeStep={activeStep}
                updateFormValidity={updateFormValidity}
                handleStepChange={handleStepChange}
              />
            )}
            {activeStep === 2 && (
              <Photos
                activeStep={activeStep}
                updateFormValidity={updateFormValidity}
                handleStepChange={handleStepChange}
              />
            )}
            {activeStep === 3 && (
              <Delivery
                activeStep={activeStep}
                updateFormValidity={updateFormValidity}
                handleStepChange={handleStepChange}
              />
            )}

            {/* Navigation Buttons */}
            {/* <div className="flex space-x-4">
              <button
                onClick={() => handleStepChange(activeStep - 1)}
                disabled={activeStep === 0}
                className={`px-3 py-2 rounded-lg transition duration-300 ${
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
                className={`px-6 py-2 rounded-lg transition duration-300 ${
                  !formValidity[activeStep] || activeStep === steps.length - 1
                    ? 'bg-blue-300 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;