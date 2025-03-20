import { productListArr } from "../../Constants";
import Card from "../../Components/Card";
import { useState, useEffect } from "react";
import Button from "../../Components/Button";
import { useNavigate, useLocation } from "react-router-dom";
import useModeStore from "../../Store/Store";

const AuctionListing = () => {
  const { isMobile } = useModeStore();
  const [visibleCards, setVisibleCards] = useState(4);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadMore = () => {
    setVisibleCards((prev) => Math.min(prev + 4, productListArr.length));
  };

  const displayedCards = isDesktop
    ? productListArr
    : productListArr.slice(0, visibleCards);

  const navigate = useNavigate();
  const viewAll = () => navigate("/Ongoing-Auction");

  const location = useLocation();
  const isHomePath = location.pathname === "/";

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1280px] px-4">
        {/* Cards Grid with Bigger Cards */}
        <div
          className={`grid gap-10  
            ${isHomePath ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}
          `}
        >
          {displayedCards.map((item, idx) => (
            <div key={idx} className="w-full flex justify-center">
              <Card
                imgUrl={item.imgUrl}
                itemName={item.itemName}
                bid={item.bid}
                bidTimes={item.bidTimes}
                sellerName={item.sellerName}
                price={item.price}
                countDown={item.countDown}
                to={`/category/${item.slug}`}
                className="w-full max-w-[400px] min-h-[500px]"
              />
            </div>
          ))}
        </div>

        {/* "View All" Button - Properly Centered */}
        {/* "View All" Button - Properly Centered & Styled */}
{isHomePath && (
  <div className="w-full flex justify-center mt-8">
    <Button
      label="View All"
      onClick={viewAll}
      className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] 
                 w-[180px] h-[50px] text-white text-center font-medium 
                 flex items-center justify-center rounded-full 
                 shadow-md hover:scale-105 transition-transform duration-300"
    />
  </div>
)}

      </div>
    </div>
  );
};

export default AuctionListing;
