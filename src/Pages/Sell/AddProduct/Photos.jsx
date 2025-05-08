import { useState, useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import uploadIcon from "../../../assets/icons/upload.png"; 
import { FaTrash } from "react-icons/fa";
import Loader from '../../../assets/loader2';
import { current } from '../../../utils';
import Alerts from '../../../Components/alerts/Alerts';

const Photos = ({
  activeStep,
  handleStepChange,
  formData,
  updateFormData,
  updateFormValidity, // Added this prop
}) => {
  const [images, setImages] = useState(formData.photos || []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const prevImagesRef = useRef(images);
  const [alertT, setAlert] = useState({
    isAlert: false,
    level: '',
    message: '',
    detail: '',
  });

  const showAlert = (level, message, detail = '') => {
    setAlert({ isAlert: true, level, message, detail });
    setTimeout(() => {
      setAlert({ isAlert: false, level: '', message: '', detail: '' });
    }, 5000);
  };

  // Update form data and validate when images change
  useEffect(() => {
    if (JSON.stringify(images) !== JSON.stringify(prevImagesRef.current)) {
      updateFormData({
        ...formData,
        photos: images,
      });
      updateFormValidity(activeStep, images.length > 0);
      prevImagesRef.current = images;
    }
  }, [images, formData, activeStep, updateFormData, updateFormValidity]);

  const handleReset = () => {
    setImages([]);
  };

  const handleFileUpload = (event) => {
    setLoading(true);
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      setLoading(false);
      return;
    }

    // Check maximum 5 images total
    if (files.length + images.length > 5) {
      showAlert('warn', 'Maximum 5 photos allowed');
      // alert('Maximum 5 photos allowed');
      setLoading(false);
      return;
    }

    const newImages = [];
    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        if (file.size > 5 * 1024 * 1024) {
          showAlert('warn', `${file.name} exceeds 5MB limit`);
          // alert(`${file.name} exceeds 5MB limit`);
          resolve();
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            url: e.target.result,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            file: file,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then(() => {
      setImages((prev) => [...prev, ...newImages]);
      setLoading(false);
    });
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleNext = () => {
  //   if (images.length === 0) {
  //     alert('Please add at least one photo');
  //     return;
  //   }
  //   handleStepChange(activeStep + 1);
  // };

  const uploadImage = async () => {
    setUploading(true);
    const endpoint = `${current}items/upload_images`;
    const formData = new FormData();
    const itemId = JSON.parse(sessionStorage.getItem('product')).item[0]?.id;

    if (images.length === 0) {
      setUploading(false);
      showAlert('warn', 'Please add at least one photo');
      // alert('Please add at least one photo');
      return;
    }

    images.forEach((image, index) => {
      if (image) {
        console.log(image);
        formData.append(`image${index + 1}`, image.file);
      }
    });

    try {
      const response = await fetch(
        `${endpoint}?item_id=${encodeURIComponent(itemId)}`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const error = await response.json();
        showAlert(
          'fail',
          error.message || 'Upload failed',
          error.detail || 'Please try again',
        );
        throw new Error(`Error: ${error}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      showAlert('success', result.message, 'Upload successful');
      setTimeout(() => {
        setUploading(false);
        handleStepChange(activeStep + 1);
      }, 1000);
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      // showAlert('fail', 'Upload failed', 'Please try again');
      // alert('Upload failed. Please try again.');
      return false;
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      {alertT.isAlert && (
        <Alerts
          key={`${alertT.level}-${alertT.message}`}
          message={alertT.message}
          detail={alertT.detail}
          type={alertT.level}
        />
      )}
      <div className="formatter">
        <div className="bg-white rounded-lg p-10 mb-4 mt-4">
          <h2 className="text-xl font-bold mb-4">Add product photos (max 5)</h2>

          <div className="border-2 border-dotted border-gray-300 p-4 rounded-lg bg-gray-50 flex flex-wrap gap-4 min-h-[400px]">
            {/* Upload Button */}
            <div className="w-[100px] flex-shrink-0">
              <div className="border-2 border-blue-500 p-2 rounded-lg w-[100px] h-[100px] flex flex-col items-center justify-center cursor-pointer">
                <img src={uploadIcon} alt="Upload" className="w-6 h-6 mb-1" />
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
                  className="text-xs text-center cursor-pointer"
                >
                  Upload photo
                </label>
              </div>
              <p className="text-xs mt-1">Max 5MB</p>
            </div>

            {/* Image Previews */}
            {images.map((image, index) => (
              <div key={index} className="relative w-[100px] group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-[100px] h-[100px] object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash className="text-white text-xs" />
                </button>
                <p className="text-xs truncate mt-1">{image.name}</p>
              </div>
            ))}

            {loading && (
              <div className="flex items-center justify-center w-full">
                <Loader />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => handleStepChange(activeStep - 1)}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              Previous
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
              >
                Reset
              </button>
              <button
                onClick={uploadImage}
                disabled={images.length === 0}
                className={`px-6 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full ${
                  images.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-maroon hover:to-maroon'
                }`}
              >
                Next
              </button>
              {(uploading || loading) && <Loader />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Photos.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  updateFormValidity: PropTypes.func.isRequired, // Added this propType
};

export default Photos;