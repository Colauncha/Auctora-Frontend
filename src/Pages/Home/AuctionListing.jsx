import Card from '../../Components/Card';
import { useState, useEffect } from 'react';
import Button from '../../Components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
// import useModeStore from "../../Store/Store";
import { currencyFormat, current, charLimit } from '../../utils';

const AuctionListing = () => {
  // const { isMobile } = useModeStore();

  const [visibleCards, setVisibleCards] = useState(4);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const [auctions, setAuctions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch(`${current}landing/trending_auctions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',

            // Add any required API keys or headers here
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json(); // Log the entire response from the API endpoint
        console.log('API Response:', data.data); // Transform API data to match your card component's expected format
        const formattedAuctions = data.data.map((auction) => {
          console.log(auction);
          return {
            imgUrl:
              auction.item[0].image_link?.link ||
              'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg',
            name: auction.item[0].name || 'Untitled Auction',
            currentBid: currencyFormat(auction.current_price) || 0,
            startingPrice: currencyFormat(auction.start_price) || 0,
            buyNowPrice: currencyFormat(auction.buy_now_price) || 0,
            bidCount: auction.watchers_count || 0,
            seller: auction.seller_name || 'Anonymous',
            description: auction.description || 'No description available',
            timeLeft: auction.end_date || 'N/A',
            slug: auction.id || 'no-id',
          };
        });

        // Log formatted auctions to verify transformation
        console.log('Formatted Auctions:', formattedAuctions);
        setAuctions(formattedAuctions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMore = () => {
    setVisibleCards((prev) => Math.min(prev + 4, auctions.length));
  };

  const displayedCards = isDesktop ? auctions : auctions.slice(0, visibleCards);

  const navigate = useNavigate();

  const viewAll = () => navigate('/Ongoing-Auction');

  const location = useLocation();

  const isHomePath = location.pathname === '/';
  if (loading) {
    return (
      <div className="w-full flex justify-center py-8">
        {' '}
        <div className="w-full max-w-[1280px] px-4 text-center">
          {' '}
          <div className="animate-pulse flex space-x-4">
            {' '}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 space-y-4 py-1">
                {' '}
                <div className="h-48 bg-gray-200 rounded"></div>{' '}
                <div className="space-y-2">
                  {' '}
                  <div className="h-4 bg-gray-200 rounded"></div>{' '}
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>{' '}
                </div>{' '}
              </div>
            ))}{' '}
          </div>{' '}
        </div>{' '}
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full flex justify-center py-8">
        {' '}
        <div className="w-full max-w-[1280px] px-4 text-center text-red-500">
          {' '}
          Error loading auctions: {error}{' '}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-[#9F3247] text-white rounded"
          >
            {' '}
            Retry{' '}
          </button>{' '}
        </div>{' '}
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="w-full flex justify-center py-8">
        {' '}
        <div className="w-full max-w-[1280px] px-4 text-center">
          {' '}
          No trending auctions available at the moment{' '}
        </div>{' '}
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center">
      {' '}
      <div className="w-full max-w-[1280px] px-4">
        {' '}
        <div
          className={`grid gap-10 ${
            isHomePath
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          } `}
        >
          {' '}
          {displayedCards.map((item, idx) => (
            <div key={idx} className="w-full flex justify-center">
              {' '}
              <Card
                imgUrl={item.imgUrl}
                // Display auction

                image
                itemName={charLimit(item.name, 20)}
                price={item.currentBid}
                sellerName={item.seller}
                bid={item.bidCount}
                bidTimes={item.bidCount}
                countDown={item.timeLeft}
                to={`/product-details/${item.slug}`}
                className="w-[600px] max-w-[600px] min-h-[500px]"
              />{' '}
            </div>
          ))}{' '}
        </div>{' '}
        {isHomePath && !isDesktop && auctions.length > visibleCards && (
          <div className="w-full flex justify-center mt-8">
            {' '}
            <Button
              label="Load More"
              onClick={loadMore}
              className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] w-[180px] h-[50px] text-white text-center font-medium flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            />{' '}
          </div>
        )}{' '}
        {isHomePath && (
          <div className="w-full flex justify-center mt-8">
            {' '}
            <Button
              label="View All"
              onClick={viewAll}
              className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] w-[180px] h-[50px] text-white text-center font-medium flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            />{' '}
          </div>
        )}{' '}
      </div>{' '}
    </div>
  );
};
export default AuctionListing;
