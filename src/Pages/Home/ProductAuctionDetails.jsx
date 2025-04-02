import React, { useState, useEffect, useMemo } from "react";
import { 
  FiArrowLeft, FiHeart, FiShare2, FiDollarSign, 
  FiClock, FiUser, FiCheck, FiShield, FiTruck 
} from "react-icons/fi";
import { BsLightningCharge, BsStarFill } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import nikon1 from "../../assets/uploads/Nikon 1.png";
import nikon2 from "../../assets/uploads/Nikon 2.png";
import nikon3 from "../../assets/uploads/Nikon 3.png";
import nikon4 from "../../assets/uploads/Nikon 4.png";

const ProductAuctionDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 23,
    seconds: 45
  });

  // Memoize product data to prevent unnecessary re-renders
  const product = useMemo(() => ({
    name: "Nikon Professional DSLR Camera",
    images: [nikon1, nikon2, nikon3, nikon4],
    currentPrice: 1500,
    startingPrice: 1000,
    buyNowPrice: 2000,
    description: "Nikon Professional DSLRs, like the D6 and D850, are known for their robust build, high-resolution sensors, and advanced features, catering to professional photographers who demand top-tier performance and reliability.",
    location: "New York, NY",
    bids: 12,
    seller: {
      name: "CameraProShop",
      rating: 4.9,
      reviews: 342
    },
    details: {
      model: "Nikon D7500",
      year: 2017,
      lens: "18-140mm f/3.5-5.6G ED VR",
      condition: "Excellent",
      includes: ["Camera body", "18-140mm lens", "Battery", "Charger", "Strap"],
      shipping: {
        cost: "Free",
        insurance: "Included",
        returnPolicy: "30 days"
      }
    }
  }), []);

  // Optimized countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.days * 86400 + prev.hours * 3600 + 
                          prev.minutes * 60 + prev.seconds - 1;
        
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        
        return {
          days: Math.floor(totalSeconds / 86400),
          hours: Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Memoized star rating component
  const StarRating = useMemo(() => ({ rating }) => (
    <>
      {Array(5).fill(0).map((_, i) => (
        <BsStarFill 
          key={i} 
          className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`}
        />
      ))}
    </>
  ), []);

  return (
    <div className="min-h-screen bg-gray-50 mb-40">
      {/* Header */}
      {/* <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="mr-2" />
            <span className="hidden sm:inline">Back to Auctions</span>
          </button>
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Share this product"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-maroon bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1}/{product.images.length}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden transition-all ${selectedImage === index ? 'ring-2 ring-maroon' : 'hover:ring-1 hover:ring-gray-300'}`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-bold mb-4 text-maroon">Product Description <span>- {product.location}</span></h3>
              <p className="text-gray-700">{product.description}</p>
              {/* <p className="text-maroon mt-4">{product.location}</p> */}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-maroon mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Professional
                </span>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Current Bid</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center">
                      <FaEthereum className="text-blue-500 mr-1" />
                      {product.currentPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Buy Now</p>
                    <p className="text-2xl font-bold text-green-600 flex items-center justify-end">
                      <FaEthereum className="text-green-500 mr-1" />
                      {product.buyNowPrice}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span><FiDollarSign className="inline mr-1" /> Start: {product.startingPrice}</span>
                  <span><BsLightningCharge className="inline mr-1" /> {product.bids} bids</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="text-sm font-medium text-maroon mb-2">Auction Ending Soon!</h4>
                <div className="flex justify-between text-center">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex-1">
                      <div className="text-xl font-bold text-red-600">{value}</div>
                      <div className="text-xs text-black-500 capitalize">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                  aria-label="Place a bid"
                >
                  <BsLightningCharge className="mr-2" />
                  Place Bid
                </button>
                <button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
                  aria-label="Buy now"
                >
                  <FiCheck className="mr-2" />
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiShield className="text-green-500 mr-2" />
                    <span>Authenticity Guaranteed</span>
                  </div>
                  <div className="flex items-center">
                    <FiTruck className="text-blue-500 mr-2" />
                    <span>Free Shipping</span>
                  </div>
                </div>
              </div>

              {/* Seller Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-maroon">Seller Information</h2>
                <div className="flex items-center bg-black bg-opacity-5 p-4 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center mr-4">
                    <FiUser className="text-gray-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">{product.seller.name}</h4>
                    <div className="flex items-center">
                      <StarRating rating={product.seller.rating} />
                      <span className="text-gray-500 text-sm ml-2">
                        {product.seller.rating} ({product.seller.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductAuctionDetails;