import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../../Components/Breadcrumbs";

const AuctionDetails = () => {
  const { state } = useLocation();
  const product = state?.product;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="bg-[#F2F0F1] min-h-screen">
      <div className="formatter">
        <div className="py-6">
          <Breadcrumbs />
          <div className="flex items-center justify-center mb-20">
            <div className="w-full max-w-full bg-white rounded-lg p-10 mb-6 mt-4">
              <h1 className="text-left text-4xl mb-4 font-extrabold text-maroon">
                Auction Details
              </h1>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Image */}
                <div className="w-full md:w-1/2">
                  <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt="Product"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl font-bold mb-2">{product.name || product.fileName}</h2>
                  
                  {/* Auction Status */}
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.status === "active" ? "Active" : "Closed"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{product.description}</p>

                  {/* Bidding Info */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold text-lg mb-2">Bidding Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Highest Bid</p>
                        <p className="font-bold">RS {product.highestBid}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bids Count</p>
                        <p className="font-bold">{product.size.match(/\((\d+) bids\)/)?.[1] || '0'}</p>
                      </div>
                      {product.buyNowPrice && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Buy Now Price</p>
                          <p className="font-bold">RS {product.buyNowPrice}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Auction {product.status === "active" ? "ends" : "ended"} on</p>
                    <p className="font-medium">{new Date(product.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;