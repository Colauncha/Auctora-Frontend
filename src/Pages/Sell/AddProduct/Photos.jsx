// const Photos = ({ activeStep, handleStepChange }) => {
//     return (
//       <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//         <h2 className="text-xl font-bold mb-4">Photos Page</h2>
//         <p>This is the content for the Photos step.</p>
//       </div>
//     );
//   };
  
//   export default Photos;


// import { useState } from "react";

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images
//   const [uploadProgress, setUploadProgress] = useState({}); // Track upload progress for each image

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024).toFixed(2) + " KB"; // Convert bytes to KB

//         // Simulate upload progress
//         let progress = 0;
//         const interval = setInterval(() => {
//           progress += 10;
//           setUploadProgress((prev) => ({
//             ...prev,
//             [imageName]: progress,
//           }));

//           if (progress >= 100) {
//             clearInterval(interval);
//             setImages((prev) => [
//               ...prev,
//               { url: imageUrl, name: imageName, size: imageSize },
//             ]);
//           }
//         }, 100);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Canvas Area */}
//       <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleFileUpload}
//           className="hidden"
//           id="upload-photo"
//         />
//         <label
//           htmlFor="upload-photo"
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
//         >
//           Upload Photo
//         </label>
//         <p className="text-sm text-gray-500 mt-2">
//           Click to upload photos from your device.
//         </p>
//       </div>

//       {/* Display Uploaded Images */}
//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {images.map((image, index) => (
//           <div key={index} className="border p-4 rounded-lg">
//             {/* Image Preview */}
//             <img
//               src={image.url}
//               alt={image.name}
//               className="w-full h-32 object-cover rounded-lg"
//             />

//             {/* Product Name */}
//             <p className="text-sm font-semibold mt-2">{image.name}</p>

//             {/* Progress Bar */}
//             {uploadProgress[image.name] < 100 && (
//               <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//                 <div
//                   className="bg-blue-500 h-2 rounded-full"
//                   style={{ width: `${uploadProgress[image.name]}%` }}
//                 ></div>
//               </div>
//             )}

//             {/* Image Size */}
//             {uploadProgress[image.name] >= 100 && (
//               <p className="text-sm text-gray-500 mt-2">Size: {image.size}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Photos;

// import { useState } from "react";
// import uploadIcon from "<div styleName={} />../../assets/icons/upload.png";

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images
//   const [uploadProgress, setUploadProgress] = useState({}); // Track upload progress for each image

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         // Simulate upload progress
//         let progress = 0;
//         const interval = setInterval(() => {
//           progress += 10;
//           setUploadProgress((prev) => ({
//             ...prev,
//             [imageName]: {
//               progress,
//               uploadedSize: ((file.size * progress) / 100 / 1024 / 1024).toFixed(2) + " MB",
//               totalSize: imageSize,
//             },
//           }));

//           if (progress >= 100) {
//             clearInterval(interval);
//             setImages((prev) => [
//               ...prev,
//               { url: imageUrl, name: imageName, size: imageSize },
//             ]);
//           }
//         }, 100);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Upload Section */}
//       <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
//         <img src={uploadIcon} alt="" />
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleFileUpload}
//           className="hidden"
//           id="upload-photo"
//         />
//         <label
//           htmlFor="upload-photo"
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
//         >
//           Upload a photo
//         </label>
//         <p className="text-sm text-gray-500 mt-2">
//           Max size - 25Mb <br /> Jpg, Png, Gif
//         </p>
//       </div>

//       {/* Display Uploaded Images */}
//       <div className="mt-6 space-y-4">
//         {images.map((image, index) => (
//           <div key={index} className="border p-4 rounded-lg">
//             {/* Image Name and Size */}
//             <p className="text-sm font-semibold">
//               {image.name} <br />
//               <span className="text-gray-500">{image.size}</span>
//             </p>

//             {/* Progress Bar */}
//             {uploadProgress[image.name]?.progress < 100 && (
//               <div className="mt-2">
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${uploadProgress[image.name].progress}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {uploadProgress[image.name].progress}%{" "}
//                   {uploadProgress[image.name].uploadedSize} /{" "}
//                   {uploadProgress[image.name].totalSize}
//                 </p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Next Button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;


// import { useState } from "react";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa"; // For the delete icon

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images
//   const [uploadProgress, setUploadProgress] = useState({}); // Track upload progress for each image

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         // Simulate upload progress
//         let progress = 0;
//         const interval = setInterval(() => {
//           progress += 10;
//           setUploadProgress((prev) => ({
//             ...prev,
//             [imageName]: {
//               progress,
//               uploadedSize: ((file.size * progress) / 100 / 1024 / 1024).toFixed(2) + " MB",
//               totalSize: imageSize,
//             },
//           }));

//           if (progress >= 100) {
//             clearInterval(interval);
//             setImages((prev) => [
//               ...prev,
//               { url: imageUrl, name: imageName, size: imageSize },
//             ]);
//           }
//         }, 100);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle image deletion
//   const handleDeleteImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Upload Section and Uploaded Images Side by Side */}
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Upload Section */}
//         <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center flex-1">
//             <img src={uploadIcon} alt="" srcset="" />
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileUpload}
//             className="hidden"
//             id="upload-photo"
//           />
//           <label
//             htmlFor="upload-photo"
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
//           >
//             Upload a photo
//           </label>
//           <p className="text-sm text-gray-500 mt-2">
//             Max size - 25Mb <br /> Jpg, Png, Gif
//           </p>
//         </div>

//         {/* Uploaded Images Section */}
//         <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {images.map((image, index) => (
//             <div
//               key={index}
//               className="relative border p-4 rounded-lg group"
//             >
//               {/* Image Preview */}
//               <img
//                 src={image.url}
//                 alt={image.name}
//                 className="w-full h-32 object-cover rounded-lg"
//               />

//               {/* Image Name and Size */}
//               <p className="text-sm font-semibold mt-2">
//                 {image.name} <br />
//                 <span className="text-gray-500">{image.size}</span>
//               </p>

//               {/* Progress Bar */}
//               {uploadProgress[image.name]?.progress < 100 && (
//                 <div className="mt-2">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full"
//                       style={{ width: `${uploadProgress[image.name].progress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {uploadProgress[image.name].progress}%{" "}
//                     {uploadProgress[image.name].uploadedSize} /{" "}
//                     {uploadProgress[image.name].totalSize}
//                   </p>
//                 </div>
//               )}

//               {/* Delete Icon (Visible on Hover) */}
//               <div
//                 className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
//                 onClick={() => handleDeleteImage(index)}
//               >
//                 <FaTrash className="text-red-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Next Button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;


// import { useState } from "react";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa"; // For the delete icon

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         setImages((prev) => [
//           ...prev,
//           { url: imageUrl, name: imageName, size: imageSize },
//         ]);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Canvas for Upload and Images */}
//       <div className="border-2 border-gray-200 p-4 rounded-lg bg-gray-50">
//         {/* Upload Section */}
//         <div className="border-2 border-blue-500 p-4 rounded-lg text-center mx-auto mb-6 max-w-[200px]">
//           <img src={uploadIcon} alt="Upload" className="mx-auto w-8 mb-2" />
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileUpload}
//             className="hidden"
//             id="upload-photo"
//           />
//           <label
//             htmlFor="upload-photo"
//             className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
//           >
//             Upload a photo
//           </label>
//         </div>

//         {/* Uploaded Images Section */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//           {images.map((image, index) => (
//             <div
//               key={index}
//               className="relative border p-2 rounded-lg group max-w-[100px] mx-auto"
//             >
//               {/* Image Preview */}
//               <img
//                 src={image.url}
//                 alt={image.name}
//                 className="w-full h-20 object-cover rounded-lg"
//               />

//               {/* Delete Icon (Visible on Hover) */}
//               <div
//                 className="absolute top-1 right-1 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
//                 onClick={() => handleDeleteImage(index)}
//               >
//                 <FaTrash className="text-red-500" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Next Button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;


// import { useState } from "react";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa"; // For the delete icon

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         setImages((prev) => [
//           ...prev,
//           { url: imageUrl, name: imageName, size: imageSize },
//         ]);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Canvas for Upload and Images */}
//       <div className="border-2 border-gray-200 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-6">
//         {/* Upload Section */}
//         <div className="border-2 border-blue-500 p-4 rounded-lg text-center max-w-[180px]">
//           <img src={uploadIcon} alt="Upload" className="mx-auto w-8 mb-2" />
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileUpload}
//             className="hidden"
//             id="upload-photo"
//           />
//           <label
//             htmlFor="upload-photo"
//             className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
//           >
//             Upload a photo
//           </label>
//           <p className="text-sm text-gray-500 mt-2">
//             Max size - 25Mb <br /> Jpg, Png, Gif
//           </p>
//         </div>

//         {/* Uploaded Images Section */}
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border p-2 rounded-lg group max-w-[180px]"
//           >
//             {/* Image Preview */}
//             <img
//               src={image.url}
//               alt={image.name}
//               className="w-full h-24 object-cover rounded-lg"
//             />

//             {/* Image Name and Size */}
//             <p className="text-sm font-semibold mt-2 text-center">
//               {image.name}
//               <br />
//               <span className="text-gray-500">{image.size}</span>
//             </p>

//             {/* Delete Icon (Centered with Red Background) */}
//             <div
//               className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg cursor-pointer"
//               onClick={() => handleDeleteImage(index)}
//             >
//               <FaTrash className="text-white text-xl" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Next Button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;


// import { useState } from "react";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa"; // For the delete icon

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         setImages((prev) => [
//           ...prev,
//           { url: imageUrl, name: imageName, size: imageSize },
//         ]);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Canvas for Upload and Images */}
//       <div className="border-2 border-gray-200 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-6">
//         {/* Upload Section */}
//         <div className="text-center max-w-[180px]">
//           <div className="border-2 border-blue-500 p-2 rounded-lg w-[180px] h-[180px] flex flex-col items-center justify-center">
//             <img
//               src={uploadIcon}
//               alt="Upload"
//               className="w-12 h-12 mb-2 object-contain"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleFileUpload}
//               className="hidden"
//               id="upload-photo"
//             />
//             <label
//               htmlFor="upload-photo"
//               className="w-3/4 py-2 bg-blue-500 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 text-center"
//             >
//               Upload a photo
//             </label>
//           </div>
//           {/* Max size text outside blue outline */}
//           <p className="text-sm text-gray-500 mt-2">
//             Max size - 25Mb <br /> Jpg, Png, Gif
//           </p>
//         </div>

//         {/* Uploaded Images Section */}
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border p-2 rounded-lg max-w-[180px] w-[180px] h-[180px] group"
//           >
//             {/* Image Preview */}
//             <img
//               src={image.url}
//               alt={image.name}
//               className="w-full h-full object-cover rounded-lg"
//             />

//             {/* Image Name and Size */}
//             <p className="text-sm font-semibold mt-2 text-center">
//               {image.name}
//               <br />
//               <span className="text-gray-500">{image.size}</span>
//             </p>

//             {/* Delete Icon (Centered and Subtle) */}
//             <div
//               className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               onClick={() => handleDeleteImage(index)}
//             >
//               <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
//                 <FaTrash className="text-white text-xl" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Next Button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;


// import { useState } from "react";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa"; // For the delete icon

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         setImages((prev) => [
//           ...prev,
//           { url: imageUrl, name: imageName, size: imageSize },
//         ]);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Canvas for Upload and Images */}
//       <div className="border-2 border-dotted border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-6">
//         {/* Upload Section */}
//         <div className="text-left max-w-[140px]">
//           <div className="border-2 border-blue-500 p-2 rounded-lg w-[140px] h-[140px] flex flex-col items-center justify-center">
//             <img
//               src={uploadIcon}
//               alt="Upload"
//               className="w-10 h-10 mb-2 object-contain"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleFileUpload}
//               className="hidden"
//               id="upload-photo"
//             />
//             <label
//               htmlFor="upload-photo"
//               className="w-3/4 py-1 bg-blue-500 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 text-center"
//             >
//               Upload a photo
//             </label>
//           </div>
//           {/* Max size text under blue outline and aligned left */}
//           <p className="text-sm text-gray-500 mt-1">
//             Max size - 25Mb <br /> Jpg, Png, Gif
//           </p>
//         </div>

//         {/* Uploaded Images Section */}
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border p-2 rounded-lg max-w-[140px] w-[140px] h-[140px] group"
//           >
//             {/* Image Preview */}
//             <img
//               src={image.url}
//               alt={image.name}
//               className="w-full h-full object-cover rounded-lg"
//             />

//             {/* Image Name and Size (aligned left) */}
//             <p className="text-sm font-semibold mt-2 text-left">
//               {image.name}
//               <br />
//               <span className="text-gray-500">{image.size}</span>
//             </p>

//             {/* Delete Icon (Centered and Circular) */}
//             <div
//               className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               onClick={() => handleDeleteImage(index)}
//             >
//               <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                 <FaTrash className="text-white text-lg" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Next Button */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;

// import { useState } from "react";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa"; // For the delete icon

// const Photos = ({ activeStep, handleStepChange }) => {
//   const [images, setImages] = useState([]); // Store uploaded images

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     if (files.length + images.length > 10) {
//       alert("You can upload a maximum of 10 photos.");
//       return;
//     }

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const imageUrl = e.target.result;
//         const imageName = file.name;
//         const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

//         setImages((prev) => [
//           ...prev,
//           { url: imageUrl, name: imageName, size: imageSize },
//         ]);
//       };

//       reader.readAsDataURL(file);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     const updatedImages = images.filter((_, i) => i !== index);
//     setImages(updatedImages);
//   };

//   return (
//     <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md mb-[30px]">
//       {/* Header */}
//       <h2 className="text-xl font-bold mb-4">Add product photos (max 10)</h2>

//       {/* Canvas for Upload and Images */}
//       <div className="border-2 border-dotted border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-6 justify-center">
//         {/* Upload Section */}
//         <div className="text-left max-w-[100px]">
//           <div className="border-2 border-blue-500 p-2 rounded-lg w-[100px] h-[100px] flex flex-col items-center justify-center">
//             <img
//               src={uploadIcon}
//               alt="Upload"
//               className="w-3 h-3 mb-1 object-contain filter-blue"
//             />
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleFileUpload}
//               className="hidden"
//               id="upload-photo"
//             />
//             <label
//               htmlFor="upload-photo"
//               className="text-black-500 text-xs cursor-pointer hover:text-blue-600 transition duration-300 text-center"
//             >
//               Upload a photo
//             </label>
//           </div>
//           {/* Max size text under blue outline and aligned left */}
//           <p className="text-xs font-semibold text-black-500 mt-1">
//             Max size - 25Mb 
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//           Jpg, Png, Gif
//           </p>
//         </div>

//         {/* Uploaded Images Section */}
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="relative border p-2 rounded-lg max-w-[100px] w-[100px] h-[100px] group"
//           >
//             {/* Image Preview */}
//             <img
//               src={image.url}
//               alt={image.name}
//               className="w-full h-full object-cover rounded-lg"
//             />

//             {/* Image Name and Size (aligned left) */}
//             <p className="text-xs font-semibold text-black-500 mt-3">
//               {image.name}
//               {/* <br />
//               <span className="text-xs text-gray-500">{image.size}</span> */}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//             {image.size}
//           </p>

//             {/* Delete Icon (Centered and Circular) */}
//             <div
//               className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               onClick={() => handleDeleteImage(index)}
//             >
//               <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
//                 <FaTrash className="text-white text-sm" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Centered Next Button with Maroon Background */}
//       <div className="mt-6 flex justify-center">
//         <button
//           onClick={() => handleStepChange(activeStep + 1)}
//           className="px-6 py-2 bg-maroon text-white rounded-lg hover:bg-red-700 transition duration-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Photos;



import { useState } from "react";
import uploadIcon from "../../../assets/icons/upload.png"; // Make sure this icon is styled in blue
import { FaTrash } from "react-icons/fa";

 
const Photos = ({ activeStep, handleStepChange }) => {
  const [images, setImages] = useState([]); // Store uploaded images

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length + images.length > 10) {
      alert("You can upload a maximum of 10 photos.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target.result;
        const imageName = file.name;
        const imageSize = (file.size / 1024 / 1024).toFixed(2) + " MB"; // Convert bytes to MB

        setImages((prev) => [
          ...prev,
          { url: imageUrl, name: imageName, size: imageSize },
        ]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
<div className="bg-[#F2F0F1] min-h-screen w-full">
<div className="formatter">
    <div className=" bg-white rounded-lg p-10 mb-4 mt-4 ">
      {/* Header */}
      <h2 className="w-full max-w-full text-xl font-bold mb-4">Add product photos (max 10)</h2>

      
      <div className="border-2 border-dotted border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-6 justify-start h-96">
        
        <div className="text-left max-w-[100px]">
          <div className="border-2 border-blue-500 p-2 rounded-lg w-[100px] h-[100px] flex flex-col items-center justify-center">
            <img
              src={uploadIcon}
              alt="Upload"
              className="w-3 h-3 mb-1 object-contain filter-blue"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="upload-photo"
            />
            <label
              htmlFor="upload-photo"
              className="text-black-500 text-xs cursor-pointer hover:text-blue-600 transition duration-300 text-center"
            >
              Upload a photo
            </label>
          </div>
          
          <p className="text-xs font-semibold text-black-500 mt-1">
            Max size - 25Mb 
          </p>
          <p className="text-xs text-gray-500 mt-1">
          Jpg, Png, Gif
          </p>
        </div>

        {/* Uploaded Images Section */}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative p-0 rounded-lg max-w-[100px] w-[100px] h-[100px] group"
          >
            {/* Image Preview */}
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
            />

            {/* Image Name and Size  */}
            <p className="text-xs font-semibold text-black-500 mt-1">
              {image.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {image.size}
            </p>

            {/* Delete Icon */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => handleDeleteImage(index)}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <FaTrash className="text-white text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="mt-6 flex justify-center">

        <button
            //   onClick={Next}
            onClick={() => handleStepChange(activeStep + 1)}
                type="button"
                className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
              >
                Next
              </button>
      </div>
    </div>
    </div>
    </div>


  );
};

export default Photos;
