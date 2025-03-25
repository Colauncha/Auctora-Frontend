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
