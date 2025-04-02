
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../Components/Breadcrumbs";
import image1 from "../../../assets/uploads/photo+icon (1).png";
import image2 from "../../../assets/uploads/photo+icon.png";
import { FiPlus } from "react-icons/fi";

const YourProduct = () => {
  const navigate = useNavigate();

  const [auctions, setAuctions ] = useState([]);

  // const [auctions, setAuctions ] = useState({} => {
  //   try {
  //     const userData = sessionStorage.getItem("_user");
  //     return userData ? JSON.parse(userData).auctions : [];
  //   } catch (error) {
  //     console.error("Error parsing user data from sessionStorage:", error);
  //     return [];
  //   }
  // });

  useEffect(() => { 
      setAuctions(JSON.parse(sessionStorage.getItem("_user")).auctions); 
      console.log(JSON.parse(sessionStorage.getItem("_user")).auctions);
  }, []); 

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Camera",
      fileName: "XYZ name.jpg",
      image: image1,
      size: "RS 350 (3 bids)",
      status: "active", // "active" or "closed"
      highestBid: 350,
      buyNowPrice: 500,
      description: "High-quality digital camera with 24MP resolution",
      endDate: "2023-12-31"
    },
    {
      id: 2,
      name: "Painting",
      fileName: "XYZ name.jpg",
      image: image2,
      size: "RS 350 (3 bids)",
      status: "closed", // "active" or "closed"
      highestBid: 420,
      buyNowPrice: null, // no buy now price
      description: "Vintage oil painting from 1960s",
      endDate: "2023-11-15"
    }
  ]);

  const fileInputRef = useRef(null);

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = {
        id: items.length + 1,
        fileName: file.name,
        image: URL.createObjectURL(file),
        size: "New upload",
        status: "active",
        highestBid: 0,
        buyNowPrice: null,
        description: "New product description",
        endDate: "2023-12-31"
      };
      setItems([...items, newImage]);
    }
  };



  const handleProductClick = (product) => {
    navigate('/auctiondetails', { state: { product } });
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex items-center justify-center">
            <div className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4" style={{ minHeight: '500px' }}>
              <h1 className="text-left text-4xl mb-4 font-extrabold text-maroon">
                Your Products
              </h1>
              
              <div className="flex flex-wrap gap-6">
                {auctions.map((item) => (
                  <div 
                    key={item.id} 
                    className="relative group cursor-pointer"
                    onClick={() => handleProductClick(item)}
                  >
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden">
                      <img
                        src={item.item[0].image_link.link || 'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743008126/ddsdomp6w9lwqb2igqx7.jpg'} 
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left mt-2">
                      <p className="text-sm font-semibold text-black">
                        {item.fileName}
                      </p>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </div>
                  </div>
                ))}

                {/* Plus Icon for Upload */}
                <div 
                  className="w-[100px] h-[100px] bg-red-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                  onClick={handleAddImage}
                >
                  <FiPlus className="text-maroon text-3xl" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourProduct;