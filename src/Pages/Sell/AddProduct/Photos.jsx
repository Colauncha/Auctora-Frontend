import { useState } from "react";
import { PropTypes } from "prop-types";
import uploadIcon from "../../../assets/icons/upload.png"; // Make sure this icon is styled in blue
import { FaTrash } from "react-icons/fa";
import { current } from "../../../utils";
import Loader from '../../../assets/loader2';

const Photos = ({ activeStep, handleStepChange }) => {
  const [images, setImages] = useState([]); // Store uploaded images
  const [loading, setLoading] = useState(false); // Loading state
  const [uploading, setUploading] = useState(false); // Uploading state

  const handleFileUpload = (event) => {
    setLoading(true);
    const files = event.target.files;
    if (files.length + images.length > 5) {
      setLoading(false);
      alert('You can upload a maximum of 5 photos.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target.result;
        const imageName = file.name;
        const imageSize = (file.size / 1024 / 1024).toFixed(2) + ' MB'; // Convert bytes to MB

        setImages((prev) => [
          ...prev,
          { url: imageUrl, name: imageName, size: imageSize, file: file },
        ]);
      };

      reader.readAsDataURL(file);
    }
    setLoading(false);
  };

  const handleDeleteImage = (index) => {
    setLoading(true);
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setLoading(false);
  };

  const uploadImage = async () => {
    setUploading(true);
    const endpoint = `${current}items/upload_images`;
    const formData = new FormData();
    const itemId = JSON.parse(sessionStorage.getItem('product')).data?.item[0]
      ?.id;

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
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      sessionStorage.setItem('product', JSON.stringify(result));
      setUploading(false);
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      alert('Upload failed. Please try again.');
      return false;
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter">
        <div className=" bg-white rounded-lg p-10 mb-4 mt-4 ">
          {/* Header */}
          <h2 className="w-full max-w-full text-xl font-bold mb-4">
            Add product photos (max 5)
          </h2>

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
                Max size - 5Mb
              </p>
              <p className="text-xs text-gray-500 mt-1">Jpg, Png, Gif</p>
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
                <p className="text-xs text-gray-500 mt-1">{image.size}</p>

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
            {loading && (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4 justify-center">
            <button
              onClick={async () => {
                (await uploadImage())
                  ? handleStepChange(activeStep + 1)
                  : () => {};
              }}
              type="button"
              className="px-20 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded-full focus:outline-none hover:from-maroon hover:to-maroon"
            >
              Next
            </button>

            {uploading && (
              <div className="flex items-center">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Photos.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
}

export default Photos;
