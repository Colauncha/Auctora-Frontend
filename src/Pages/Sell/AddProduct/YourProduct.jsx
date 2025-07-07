
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../Components/Breadcrumbs';
import { FiPlus, FiLink } from 'react-icons/fi';
import { currencyFormat } from '../../../utils';

const YourProduct = () => {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('_user'));
    setAuctions(userData.auctions);
    console.log(userData.auctions);
  }, []);

  const handleAddImage = () => {
    // fileInputRef.current.click();
    navigate('/Add-Product');
  };

  const handleProductClick = (product, id) => {
    navigate(`/products/${id}`, { state: { product } });
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex items-center justify-center">
            <div
              className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4"
              style={{ minHeight: '500px' }}
            >
              <h1 className="text-left text-4xl mb-4 font-extrabold text-maroon">
                Your Products
              </h1>

              <div className="flex flex-wrap gap-6">
                {auctions.map((item) => (
                  <div
                    key={item.id}
                    className="relative w-[100px] h-[100px] group cursor-pointer"
                    onClick={() => handleProductClick(item, item.id)}
                  >
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden">
                      <img
                        src={
                          item?.item[0]?.image_link?.link ||
                          'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg'
                        }
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-[100px] rounded-lg bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                        <FiLink />
                      </div>
                    </div>
                    <div className="text-left mt-2">
                      <p className="text-sm font-semibold text-black">
                        {item.item[0]?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currencyFormat(item.start_price)}
                      </p>
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
                    onChange=""
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