// import { useState, useEffect, useRef } from "react";
// import { PropTypes } from "prop-types";
// import uploadIcon from "../../../assets/icons/upload.png";
// import { FaTrash } from "react-icons/fa";
// import Loader from '../../../assets/loader2';
// import LoaderW from '../../../assets/loaderWhite';
// // import { current } from '../../../utils';
// import { toastWarn } from '../../../utils/toast';

// const Photos = ({
//   activeStep,
//   handleStepChange,
//   formData,
//   updateFormData,
//   updateFormValidity, // Added this prop
// }) => {
//   const [images, setImages] = useState(formData.photos || []);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const prevImagesRef = useRef(images);
//   const chooseImageInputRef = useRef(null);

//   // Update form data and validate when images change
//   useEffect(() => {
//     if (JSON.stringify(images) !== JSON.stringify(prevImagesRef.current)) {
//       updateFormData({
//         ...formData,
//         photos: images,
//       });
//       updateFormValidity(activeStep, images.length > 0);
//       prevImagesRef.current = images;
//     }
//   }, [images, formData, activeStep, updateFormData, updateFormValidity]);

//   const handleReset = () => {
//     setImages([]);
//   };

//   const handleFileUpload = (event) => {
//     setLoading(true);
//     const files = Array.from(event.target.files || []);

//     if (files.length === 0) {
//       setLoading(false);
//       return;
//     }

//     // Check maximum 5 images total
//     if (files.length + images.length > 5) {
//       toastWarn('Maximum 5 photos allowed');
//       setLoading(false);
//       return;
//     }

//     const newImages = [];
//     const fileReaders = files.map((file) => {
//       return new Promise((resolve) => {
//         if (file.size > 5 * 1024 * 1024) {
//           toastWarn(`${file.name} exceeds 5MB limit`);
//           resolve();
//           return;
//         }

//         const reader = new FileReader();
//         reader.onload = (e) => {
//           newImages.push({
//             url: e.target.result,
//             name: file.name,
//             size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
//             file: file,
//           });
//           resolve();
//         };
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(fileReaders).then(() => {
//       setImages((prev) => [...prev, ...newImages]);
//       setLoading(false);
//     });
//   };

//   const handleDeleteImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const uploadImage = async () => {
//     setUploading(true);
//     // const endpoint = `${current}items/upload_images`;
//     // const itemId = JSON.parse(sessionStorage.getItem('product')).item[0]?.id;
//     const formData_ = new FormData();

//     if (images.length === 0) {
//       setUploading(false);
//       toastWarn('Please add at least one photo');
//       return;
//     }

//     images.forEach((image, index) => {
//       if (image) {
//         formData_.append(`image${index + 1}`, image.file);
//       }
//     });

//     console.log('Images:', formData_);
//     updateFormData({
//       ...formData,
//       photos: images,
//     });

//     setTimeout(() => {
//       setUploading(false);
//       handleStepChange(activeStep + 1);
//     }, 1000);
//     return true;
//     // try {
//     //   const response = await fetch(
//     //     `${endpoint}?item_id=${encodeURIComponent(itemId)}`,
//     //     {
//     //       method: 'PUT',
//     //       body: formData_,
//     //       headers: {
//     //         Authorization: `Bearer ${localStorage.getItem('token')}`,
//     //       },
//     //       credentials: 'include',
//     //     },
//     //   );

//     //   if (!response.ok) {
//     //     const error = await response.json();
//     //     showAlert(
//     //       'fail',
//     //       error.message || 'Upload failed',
//     //       error.detail || 'Please try again',
//     //     );
//     //     throw new Error(`Error: ${error}`);
//     //   }

//     //   const result = await response.json();
//     //   console.log('Upload successful:', result);
//     //   showAlert('success', result.message, 'Upload successful');
//     //   setTimeout(() => {
//     //     setUploading(false);
//     //     handleStepChange(activeStep + 1);
//     //   }, 1000);
//     //   return true;
//     // } catch (error) {
//     //   console.error('Upload failed:', error);
//     //   setUploading(false);
//     //   // showAlert('fail', 'Upload failed', 'Please try again');
//     //   // alert('Upload failed. Please try again.');
//     //   return false;
//     // }
//   };

//   return (
//     <div className="bg-[#F2F0F1] min-h-screen w-full">
//       <div className="formatter">
//         <div className="bg-white rounded-lg p-10 mb-4 mt-4">
//           <h2 className="text-xl font-bold mb-4">Add product photos (max 5)</h2>

//           <div className="border-2 border-dotted border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-4 min-h-[400px]">
//             {/* Upload Button */}
//             <div className="w-[100px] flex-shrink-0">
//               <div
//                 // onClick={chooseImageInputRef.current?.click()}
//                 onClick={handleFileUpload}
//                 className="relative border-2 border-blue-500 p-2 rounded-lg w-[100px] h-[100px] flex flex-col items-center justify-center cursor-pointer"
//               >
//                 <img
//                   src={uploadIcon}
//                   alt="Upload"
//                   // onClick={handleFileUpload}
//                   className="w-6 h-6 mb-1"
//                 />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={chooseImageInputRef}
//                   multiple
//                   onClick={handleFileUpload}
//                   // onChange={handleFileUpload}
//                   className="hidden absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
//                   id="upload-photo"
//                 />
//                 <label
//                   htmlFor="upload-photo"
//                   className="text-xs text-center cursor-pointer"
//                 >
//                   Upload photo
//                 </label>
//               </div>
//               <p className="text-xs mt-1">Max 5MB</p>
//             </div>

//             {/* Image Previews */}
//             {images.map((image, index) => (
//               <div key={index} className="relative w-[100px] group">
//                 <img
//                   src={image.url}
//                   alt={image.name}
//                   className="w-[100px] h-[100px] object-cover rounded-lg"
//                 />
//                 <button
//                   onClick={() => handleDeleteImage(index)}
//                   className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <FaTrash className="text-white text-xs" />
//                 </button>
//                 <p className="text-xs truncate mt-1">{image.name}</p>
//               </div>
//             ))}

//             {loading && (
//               <div className="flex items-center justify-center w-full">
//                 <Loader />
//               </div>
//             )}
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               onClick={() => handleStepChange(activeStep - 1)}
//               className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
//             >
//               Previous
//             </button>

//             <div className="flex gap-2">
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={uploadImage}
//                 disabled={images.length === 0}
//                 className={`px-6 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full ${
//                   images.length === 0
//                     ? 'opacity-50 cursor-not-allowed'
//                     : 'hover:from-maroon hover:to-maroon'
//                 }`}
//               >
//                 {uploading ? (
//                   <LoaderW otherStyles="h-[25px] w-[25px] border-2 bg-[rgba(230, 84, 113, 0.59)]" />
//                 ) : (
//                   'Next'
//                 )}
//               </button>
//               {loading && <Loader />}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Photos.propTypes = {
//   handleStepChange: PropTypes.func.isRequired,
//   activeStep: PropTypes.number.isRequired,
//   formData: PropTypes.object.isRequired,
//   updateFormData: PropTypes.func.isRequired,
//   updateFormValidity: PropTypes.func.isRequired, // Added this propType
// };

// export default Photos;

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';

import uploadIcon from '../../../assets/icons/upload.png';
import Loader from '../../../assets/loader2';
import LoaderW from '../../../assets/loaderWhite';
import { toastWarn } from '../../../utils/toast';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 5MB

const Photos = ({
  activeStep,
  handleStepChange,
  formData,
  updateFormData,
  updateFormValidity,
}) => {
  const fileInputRef = useRef(null);

  const [images, setImages] = useState(formData.photos || []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * Keep local images synchronized with the parent form data.
   *
   * This is mainly useful when navigating backwards/forwards between
   * steps and the parent form data already contains photos.
   */
  useEffect(() => {
    setImages(formData.photos || []);
  }, [formData.photos]);

  /**
   * Keep parent form data and step validity synchronized with images.
   */
  useEffect(() => {
    updateFormData({
      ...formData,
      photos: images,
    });

    updateFormValidity(activeStep, images.length > 0);
  }, [images, formData, activeStep, updateFormData, updateFormValidity]);

  //   useEffect(() => {
  //     if (JSON.stringify(images) !== JSON.stringify(prevImagesRef.current)) {
  //       updateFormData({
  //         ...formData,
  //         photos: images,
  //       });
  //       updateFormValidity(activeStep, images.length > 0);
  //       prevImagesRef.current = images;
  //     }
  //   }, [images, formData, activeStep, updateFormData, updateFormValidity]);

  /**
   * Open the native file picker.
   */
  const openFilePicker = () => {
    if (loading || uploading) return;

    fileInputRef.current?.click();
  };

  /**
   * Reset the native file input.
   *
   * This allows the user to select the same file again after removing it.
   */
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Validate and convert selected files into preview objects.
   */
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setLoading(true);

    try {
      const remainingSlots = MAX_IMAGES - images.length;

      if (remainingSlots <= 0) {
        toastWarn(`Maximum ${MAX_IMAGES} photos allowed`);
        return;
      }

      const filesToProcess = files.slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        toastWarn(`You can only add ${remainingSlots} more photo(s)`);
      }

      const validFiles = [];

      filesToProcess.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toastWarn(`${file.name} exceeds the 1MB limit`);
          return;
        }

        if (!file.type.startsWith('image/')) {
          toastWarn(`${file.name} is not a valid image`);
          return;
        }

        validFiles.push(file);
      });

      if (!validFiles.length) {
        return;
      }

      const newImages = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.onload = () => {
                resolve({
                  id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID?.() || Date.now()}`,
                  url: reader.result,
                  name: file.name,
                  size: (file.size / (1024 * 1024)).toFixed(2),
                  file,
                });
              };

              reader.onerror = () => {
                reject(new Error(`Failed to read ${file.name}`));
              };

              reader.readAsDataURL(file);
            })
        )
      );

      setImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.error('Failed to process images:', error);
      toastWarn('Unable to process selected images');
    } finally {
      setLoading(false);
      resetFileInput();
    }
  };

  /**
   * Remove one image.
   */
  const handleDeleteImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  /**
   * Remove all images.
   */
  const handleReset = () => {
    if (uploading) return;

    setImages([]);
    resetFileInput();
  };

  /**
   * Upload images / proceed to the next step.
   *
   * Replace the simulated timeout with your API request when ready.
   */
  const uploadImage = async () => {
    if (uploading) return;

    if (!images.length) {
      toastWarn('Please add at least one photo');
      return;
    }

    setUploading(true);

    try {
      const formData_ = new FormData();

      images.forEach((image, index) => {
        if (image.file) {
          formData_.append(`image${index + 1}`, image.file);
        }
      });

      console.log('Images:', formData_);

      // Keep the parent form data up to date.
      updateFormData({
        ...formData,
        photos: images,
      });

      /*
       * Replace this with your actual API request:
       *
       * const response = await fetch(endpoint, {
       *   method: 'PUT',
       *   body: formData_,
       *   credentials: 'include',
       * });
       *
       * if (!response.ok) {
       *   throw new Error('Upload failed');
       * }
       */

      await new Promise((resolve) => setTimeout(resolve, 1000));

      handleStepChange(activeStep + 1);
    } catch (error) {
      console.error('Upload failed:', error);
      toastWarn('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className="bg-white rounded-lg p-10 mb-4 mt-4">
          <h2 className="text-xl font-bold mb-4">Add product photos (max 5)</h2>

          <div className="border-2 border-dotted border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-4 min-h-[400px]">
            {/* Upload button */}
            {images.length < MAX_IMAGES && (
              <div className="w-[100px] flex-shrink-0">
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={loading || uploading}
                  className="relative border-2 border-blue-500 p-2 rounded-lg w-[100px] h-[100px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src={uploadIcon} alt="Upload" className="w-6 h-6 mb-1" />

                  <span className="text-xs text-center">Upload photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={loading || uploading}
                  className="hidden"
                />

                <p className="text-xs mt-1 text-center">Max 1MB</p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center w-full">
                <Loader />
              </div>
            )}

            {/* Image previews */}
            {images.map((image) => (
              <div key={image.id} className="relative w-[100px] group">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={uploading}
                    aria-label={`Delete ${image.name}`}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  >
                    <FaTrash className="text-white text-xs" />
                  </button>
                </div>

                <p className="text-xs truncate mt-1" title={image.name}>
                  {image.name}
                </p>

                <p className="text-[10px] text-gray-500">{image.size} MB</p>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => handleStepChange(activeStep - 1)}
              disabled={uploading}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={images.length === 0 || uploading}
                className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={uploadImage}
                disabled={images.length === 0 || uploading || loading}
                className={`px-6 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full ${
                  images.length === 0 || uploading || loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-[#5e1a28] hover:to-[#5e1a28]'
                }`}
              >
                {uploading ? (
                  <LoaderW otherStyles="h-[25px] w-[25px] border-2 bg-[rgba(230,84,113,0.59)]" />
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};;

Photos.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  updateFormValidity: PropTypes.func.isRequired,
};

export default Photos;
