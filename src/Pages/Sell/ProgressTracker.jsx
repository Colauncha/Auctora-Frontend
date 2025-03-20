// import { useState } from "react";
// import deliveryIcon from "../../assets/svg/DeliverySVG.svg";
// import photosIcon from "../../assets/svg/Photos.svg";
// import categoryIcon from "../../assets/svg/category.svg";
// import descriptionIcon from "../../assets/svg/Description.svg";

// const ProgressTracker = () => {
//   const [activeStep, setActiveStep] = useState(0);

//   const steps = ["Description", "Categories", "Photos", "Delivery"];

//   const handleStepChange = (index) => {
//     setActiveStep(index);
//   };

//   // Map step indices to their respective SVGs
//   const stepIcons = [descriptionIcon, categoryIcon, photosIcon, deliveryIcon];

//   return (
//     <div className="bg-[#F0F0F0] flex flex-col items-center space-y-6 py-6 mt-8 min-h-[calc(100vh-200px)]">
//       {/* Progress Tracker */}
//       <div className="flex items-center">
//         {steps.map((step, index) => (
//           <div key={index} className="flex items-center">
//             {/* Step Section */}
//             <div
//               className="flex flex-col items-center cursor-pointer"
//               onClick={() => handleStepChange(index)}
//             >
//               {/* Step Icon */}
//               <div
//                 className={`w-12 h-12 flex items-center justify-center rounded-full ${
//                   index === activeStep
//                     ? "bg-maroon" // Active step
//                     : "bg-white" // Inactive step (white background, no border)
//                 }`}
//               >
//                 {/* Render SVG for each step */}
//                 <img
//                   src={stepIcons[index]} // Use the corresponding SVG for the step
//                   alt={step}
//                   className={`w-4 h-4 ${
//                     index === activeStep ? "filter brightness-0 invert" : ""
//                   }`} // Change SVG color to white when active
//                 />
//               </div>

//               {/* Step Label */}
//               <p
//                 className={`text-sm mt-2 font-bold text-black`} // Always black and bold
//               >
//                 {step}
//               </p>
//             </div>

//             {/* Centered Dotted Line */}
//             {index < steps.length - 1 && (
//               <div className="flex items-center justify-center mx-2 relative top-[-12px]">
//                 <div
//                   className="w-16 h-0.5 border-t-2 border-dotted border-red-500"
//                   style={{ borderSpacing: "4px" }} // Reduce dot density
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Content Section */}
//       <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//         {activeStep === 0 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Description Page</h2>
//             <p>This is the content for the Description step.</p>
//           </div>
//         )}
//         {activeStep === 1 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Categories Page</h2>
//             <p>This is the content for the Categories step.</p>
//           </div>
//         )}
//         {activeStep === 2 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Photos Page</h2>
//             <p>This is the content for the Photos step.</p>
//           </div>
//         )}
//         {activeStep === 3 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Delivery Page</h2>
//             <p>This is the content for the Delivery step.</p>
//           </div>
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex space-x-4">
//         <button
//           onClick={() =>
//             handleStepChange(activeStep > 0 ? activeStep - 1 : 0)
//           }
//           className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition duration-300"
//         >
//           Previous
//         </button>
//         <button
//           onClick={() =>
//             handleStepChange(
//               activeStep < steps.length - 1 ? activeStep + 1 : activeStep
//             )
//           }
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProgressTracker;

// import { useState } from "react";
// import deliveryIcon from "../../assets/svg/DeliverySVG.svg";
// import photosIcon from "../../assets/svg/Photos.svg";
// import categoryIcon from "../../assets/svg/category.svg";
// import descriptionIcon from "../../assets/svg/Description.svg";

// const ProgressTracker = () => {
//   const [activeStep, setActiveStep] = useState(0);

//   const steps = ["Description", "Categories", "Photos", "Delivery"];

//   const handleStepChange = (index) => {
//     setActiveStep(index);
//   };

//   // Map step indices to their respective SVGs
//   const stepIcons = [descriptionIcon, categoryIcon, photosIcon, deliveryIcon];

//   return (
//     <div className="bg-[#F0F0F0] flex flex-col items-center space-y-6 py-6">
//       {/* Progress Tracker */}
//       <div className="flex items-center">
//         {steps.map((step, index) => (
//           <div key={index} className="flex items-center">
//             {/* Step Section */}
//             <div
//               className="flex flex-col items-center cursor-pointer"
//               onClick={() => handleStepChange(index)}
//             >
//               {/* Step Icon */}
//               <div
//                 className={`w-12 h-12 flex items-center justify-center rounded-full ${
//                   index === activeStep
//                     ? "bg-maroon" // Active step
//                     : "bg-white" // Inactive step (white background, no border)
//                 }`}
//               >
//                 {/* Render SVG for each step */}
//                 <img
//                   src={stepIcons[index]} // Use the corresponding SVG for the step
//                   alt={step}
//                   className={`w-4 h-4 ${
//                     index === activeStep ? "filter brightness-0 invert" : ""
//                   }`} // Change SVG color to white when active
//                 />
//               </div>

//               {/* Step Label */}
//               <p
//                 className={`text-sm mt-2 font-bold text-black`} // Always black and bold
//               >
//                 {step}
//               </p>
//             </div>

//             {/* Centered Dotted Line */}
//             {index < steps.length - 1 && (
//               <div className="flex items-center justify-center mx-2 relative top-[-12px]">
//                 <div
//                   className="w-16 h-0.5 border-t-2 border-dotted border-red-500"
//                   style={{ borderSpacing: "4px" }} // Reduce dot density
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Content Section */}
//       <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
//         {activeStep === 0 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Description Page</h2>
//             <p>This is the content for the Description step.</p>
//           </div>
//         )}
//         {activeStep === 1 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Categories Page</h2>
//             <p>This is the content for the Categories step.</p>
//           </div>
//         )}
//         {activeStep === 2 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Photos Page</h2>
//             <p>This is the content for the Photos step.</p>
//           </div>
//         )}
//         {activeStep === 3 && (
//           <div>
//             <h2 className="text-xl font-bold mb-4">Delivery Page</h2>
//             <p>This is the content for the Delivery step.</p>
//           </div>
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex space-x-4">
//         <button
//           onClick={() =>
//             handleStepChange(activeStep > 0 ? activeStep - 1 : 0)
//           }
//           className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition duration-300"
//         >
//           Previous
//         </button>
//         <button
//           onClick={() =>
//             handleStepChange(
//               activeStep < steps.length - 1 ? activeStep + 1 : activeStep
//             )
//           }
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProgressTracker;