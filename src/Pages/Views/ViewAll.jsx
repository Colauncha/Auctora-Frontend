import Slider from '../../Components/Slider';
// import AuctionListing from "../Home/AuctionListing";
import Preloader from '../../Components/Preloader';
import Breadcrumbs from '../../Components/Breadcrumbs';
import Pagination from '../../Components/Pagination';
import { useState, useEffect } from 'react';
import useModeStore from '../../Store/Store';
// import { FaAngleDown } from 'react-icons/fa';
import { filter_icom } from '../../Constants';
import Modal from '../../Components/Modal';
import { current, currencyFormat } from '../../utils';
import Card from '../../Components/Card';
import PriceRange from '../../Components/PriceRange';
import Button from '../../Components/Button';


const ViewAll = () => {
  const { isMobile } = useModeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [currentPriceQuery, setCurrentPriceQuery] = useState([]);
  const [startPriceQuery, setStartPriceQuery] = useState([]);
  const [buyNowPriceQuery, setBuyNowPriceQuery] = useState([]);
  // const [statusQuery, setStatusQuery] = useState('active');
  // const [buyNowQuery, setBuyNowQuery] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Fetch function
  const runFetch = async ({
    method = 'GET',
    endpoint = endpoint,
    per_page = 20,
    page = 1,
    others = null,
  }) => {
    let endPoint = `${endpoint}?page=${page}&per_page=${per_page}&status=ACTIVE`;
    if (others !== null) {
      let queryString = '';
      for (let k in others) {
        queryString = queryString + `&${k}=${encodeURIComponent(others[k])}`;
      }
      endPoint = `${endPoint}${queryString}`;
    }
    console.log(endPoint);
    const response = await fetch(endPoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      // setLoading(false);
      const errorData = await response.json();
      alert(`Error ${errorData.message}`);
      throw new Error(`Error ${errorData.message}`);
    }

    return await response.json();
  };

  // useEffect utilized for debuging state change
  useEffect(() => {
    console.log(`From View all page ${currentPage}`);
    console.log(auctions.current_price);
  }, [currentPage, auctions]);

  // Proper useEffect
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const endpoint = `${current}auctions/`;
        const resp = await runFetch({ endpoint, per_page: itemsPerPage });
        let data = resp.data;
        setTotalPages(resp.pages);
        setAuctions(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [itemsPerPage]);

  const handlePageChange = (page) => {
    window.scrollTo(0, 0);
    setLoading(true);
    setCurrentPage(page);
    const fetchData = async () => {
      try {
        const endpoint = `${current}auctions/`;
        const resp = await runFetch({ endpoint, page, per_page: itemsPerPage });
        let data = resp.data;
        setAuctions(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  const handleSortChange = (sortAlg = 'popular') => {
    const sortAlgorithm = {
      popular: (a, b) => b.watchers_count - a.watchers_count,
      created_at: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      bids: (a, b) => b.bids.length - a.bids.length,
      price: (a, b) => b.current_price - a.current_price,
      bid_now: (a, b) => b.bid_now_price - a.bid_now_price,
      ending_date: (a, b) => new Date(a.end_date) - new Date(b.end_date),
    };
    setAuctions((prevAuctions) => {
      const sortedAuctions = [...prevAuctions].sort(sortAlgorithm[sortAlg]);
      return sortedAuctions;
    });
  };

  const handleFilterChange = async () => {
    let queries = {};
    if (startPriceQuery.length > 0) {
      queries.start_price = startPriceQuery.join('-');
    }
    if (currentPriceQuery.length > 0) {
      queries.current_price = currentPriceQuery.join('-');
    }
    if (buyNowPriceQuery.length > 0) {
      queries.buy_now_price = buyNowPriceQuery.join('-');
    }
    window.scrollTo(0, 0);
    setLoading(true);
    const fetchData = async () => {
      try {
        const endpoint = `${current}auctions/`;
        const resp = await runFetch({
          endpoint,
          page: currentPage,
          per_page: itemsPerPage,
          others: queries,
        });
        let data = resp.data;
        setAuctions(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    await fetchData();
  };

  const handleClearFilter = () => {
    setBuyNowPriceQuery([]);
    setCurrentPriceQuery([]);
    setStartPriceQuery([]);
  };

  return (
    <div className="formatter">
      <Breadcrumbs />
      <div
        className="flex flex-col items-center lg:my-10 lg:mb-20 sm:my-10"
        style={{ marginBottom: '80px' }}
      >
        <div className="w-full flex flex-col justify-start lg:flex-row mx-auto lg:gap-12">
          <div className="flex flex-col w-full lg:w-[25%] hidden lg:block p-2">
            <h2 className="font-[500] text-start text-[#9f3248] text-[18px]">
              Filters
            </h2>
            <PriceRange func={setCurrentPriceQuery} label={'Current Price'} />
            <PriceRange func={setStartPriceQuery} label={'Start Price'} />
            <PriceRange func={setBuyNowPriceQuery} label={'Buy Now Price'} />
            {/* <div className="flex flex-col gap-2">
              <h3 className="font-[500] text-start text-[#9f3248] text-[16px]">
                Status
              </h3>
              <div className="flex gap-2 place-items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={statusQuery === 'active'}
                  onChange={(e) => {
                    setStatusQuery(e.target.value);
                  }}
                />
                <label htmlFor="active">Active</label>
              </div>
              <div className="flex gap-2 place-items-center">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={statusQuery === 'completed'}
                  onChange={(e) => {
                    setStatusQuery(e.target.value);
                  }}
                />
                <label htmlFor="completed">Completed</label>
              </div>
            </div> */}
            <Button
              label="Apply Filter"
              className="w-full mt-4"
              onClick={handleFilterChange}
            />
            <Button
              label="Clear Filters"
              className="w-full mt-4"
              onClick={handleClearFilter}
            />
          </div>
          <div className="w-full lg:w-[70%]">
            <div className="flex items-center justify-between pb-4">
              <h1 className="text-start text-[#9f3248] font-[700] text-[28px]">
                Ongoing Auctions
              </h1>
              {isMobile ? (
                <img
                  src={filter_icom}
                  onClick={openModal}
                  className="cursor-pointer"
                />
              ) : (
                <div className="flex place-items-center gap-2">
                  <div className="text-slate-400 text-sm">Sorted by: </div>
                  <select
                    onChange={(e) => {
                      handleSortChange(e.target.value);
                    }}
                    className="font pl-2 text-sm text-[#a5a5a5] rounded-md flex gap-1 place-items-center cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="created_at">Most Recent</option>
                    <option value="bids">Most Bids</option>
                    <option value="price">Current Price</option>
                    <option value="bid_now">Bid Now Price</option>
                    <option value="ending_date">Ending Date</option>
                  </select>
                </div>
              )}
            </div>
            {loading ? (
              <Preloader />
            ) : (
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
              >
                {auctions.map((item) => (
                  <div key={item.id} className="w-full flex">
                    <Card
                      imgUrl={
                        item.item[0]?.image_link?.link ||
                        'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743008126/ddsdomp6w9lwqb2igqx7.jpg'
                      }
                      // Display auction
                      itemName={item.item[0]?.name}
                      price={currencyFormat(item.current_price)}
                      sellerName={item.user?.username || 'Anonymous'}
                      bid={item.bids.length}
                      countDown={item.end_date}
                      to={`/product-details/${item.id}`}
                      className="w-[400px] max-w-[500px] min-h-[500px]"
                    />
                  </div>
                ))}
              </div>
            )}
            <Modal isOpen={modalOpen} onClose={closeModal}>
              <Slider />
            </Modal>
          </div>
        </div>

        {/* Pagination */}
        <div className="w-full flex gap-10 justify-center items-center mt-10">
          <div className="lg:flex w-[50%] justify-end items-center gap-2">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="flex w-[30%] items-center justify-end gap-4">
            <p className="text-[#a5a5a5] text-[14px]">Per page: </p>
            <select
              className="w-full h-[30px] p-1 border rounded-md bg-white border-[#a5a5a5] text-[#a5a5a5] lg:w-[15%]"
              onChange={(e) => {
                handlePageChange(currentPage);
                setItemsPerPage(e.target.value);
              }}
            >
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option selected value="20">
                20
              </option>
              <option value="24">24</option>
              <option value="28">28</option>
              <option value="32">32</option>
              <option value="36">36</option>
              <option value="40">40</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAll;
