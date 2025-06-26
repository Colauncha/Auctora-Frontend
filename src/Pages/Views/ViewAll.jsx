import Preloader from '../../Components/Preloader';
import Breadcrumbs from '../../Components/Breadcrumbs';
import Pagination from '../../Components/Pagination';
import { useState, useEffect } from 'react';
import useModeStore from '../../Store/Store';
import { FaFilter } from 'react-icons/fa';
import Modal from '../../Components/Modal';
import { current, currencyFormat, charLimit } from '../../utils';
import Card from '../../Components/Card';
import PriceRange from '../../Components/PriceRange';
import CategoryFilter from '../../Components/CaregoryFilter';
import RadioButtonFilter from '../../Components/RadioButtonFilter';
import Button from '../../Components/Button';

const ViewAll = () => {
  const { isMobile } = useModeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [currentPriceQuery, setCurrentPriceQuery] = useState([]);
  const [startPriceQuery, setStartPriceQuery] = useState([]);
  const [category, setCategory] = useState({});
  const [buyNowPriceQuery, setBuyNowPriceQuery] = useState([]);
  const [statusQuery, setStatusQuery] = useState('ACTIVE');
  const [buyNowQuery, setBuyNowQuery] = useState(null);
  const [clearFilter, setClearFilter] = useState(false);
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
    let endPoint = `${endpoint}?page=${page}&per_page=${per_page}`;
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

  // Proper useEffect
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const endpoint = `${current}auctions/?status=ACTIVE&`;
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
    if (Object.keys(category).length > 0) {
      const catId = Object.keys(category)[0];
      queries.category_id = catId;
      if (category[catId].length > 0) {
        const subCatId = category[catId][0];
        queries.sub_category_id = subCatId;
      }
    }

    window.scrollTo(0, 0);
    setLoading(true);
    setCurrentPage(page);
    const fetchData = async () => {
      try {
        const endpoint = `${current}auctions/`;
        const resp = await runFetch({
          endpoint,
          page,
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
    if (Object.keys(category).length > 0) {
      const catId = Object.keys(category)[0];
      queries.category_id = catId;
      if (category[catId].length > 0) {
        const subCatId = category[catId][0];
        queries.sub_category_id = subCatId;
      }
    }
    if (buyNowQuery !== null) {
      queries.buy_now = buyNowQuery;
    }
    if (statusQuery !== null) {
      queries.status = statusQuery;
    }
    console.log('Queries:', queries);

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
        setTotalPages(resp.pages);
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
    setCategory({});
    setStatusQuery('active');

    setTimeout(() => {
      setClearFilter(false);
    }, 1000);
  };

  return (
    <div className="formatter">
      <Breadcrumbs />
      <div
        className="flex flex-col items-center lg:my-10 lg:mb-20 sm:my-10"
        style={{ marginBottom: '80px' }}
      >
        <div className="w-full flex flex-col justify-start lg:flex-row mx-auto lg:gap-12">
          <div className="flex-col w-full lg:w-[20%] p-2 hidden lg:flex">
            <h2 className="font-[500] text-start text-[#9f3248] text-[18px]">
              Filters
            </h2>
            <CategoryFilter
              clear={clearFilter}
              func={setCategory}
              label={'Category'}
            />
            <RadioButtonFilter
              label={'Status'}
              func={setStatusQuery}
              clear={clearFilter}
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Cancelled', value: 'CANCLED' },
                { label: 'Pending', value: 'PENDING' },
              ]}
            />
            <RadioButtonFilter
              label={'Buy Now'}
              func={setBuyNowQuery}
              clear={clearFilter}
              options={[
                { label: 'True', value: true },
                { label: 'False', value: false },
              ]}
            />
            <PriceRange
              clear={clearFilter}
              func={setCurrentPriceQuery}
              label={'Current Price'}
            />
            <PriceRange
              clear={clearFilter}
              func={setStartPriceQuery}
              label={'Start Price'}
            />
            <PriceRange
              clear={clearFilter}
              func={setBuyNowPriceQuery}
              label={'Buy Now Price'}
            />
            <Button
              label="Apply Filter"
              className="w-full mt-4"
              onClick={handleFilterChange}
            />
            <Button
              label="Clear Filters"
              className="w-full mt-4"
              onClick={() => {
                setClearFilter(true);
                handleClearFilter();
              }}
            />
          </div>
          <div className="w-full lg:w-[78%]">
            <div className="flex items-center justify-between pb-4">
              <h1 className="text-start text-[#9f3248] font-bold text-xl sm:text-2xl md:text-3xl">
                Ongoing Auctions
              </h1>
              {isMobile ? (
                <div className="w-32 flex justify-center items-center gap-3">
                  <span>Filters:</span>
                  <FaFilter
                    onClick={openModal}
                    className="cursor-pointer text-gray-500"
                  />
                </div>
              ) : (
                <div className="flex place-items-center gap-2">
                  <div className="text-slate-400 text-sm">Sorted by: </div>
                  <select
                    onChange={(e) => {
                      handleSortChange(e.target.value);
                    }}
                    className="px-3 py-1 text-sm rounded-md border border-gray-300 focus:outline-none"
                  >
                    <option className="py-2" value="popular">
                      Most Popular
                    </option>
                    <option className="py-2" value="created_at">
                      Most Recent
                    </option>
                    <option className="py-2" value="bids">
                      Most Bids
                    </option>
                    <option className="py-2" value="price">
                      Current Price
                    </option>
                    <option className="py-2" value="bid_now">
                      Bid Now Price
                    </option>
                    <option className="py-2" value="ending_date">
                      Ending Date
                    </option>
                  </select>
                </div>
              )}
            </div>
            {loading ? (
              <Preloader />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {auctions.map((item) => (
                  <div key={item.id} className="w-full flex mb-4">
                    <Card
                      imgUrl={
                        item.item[0]?.image_link?.link ||
                        'https://res.cloudinary.com/dtkv6il4e/image/upload/v1748091825/Biddius_logo_lkme0j.jpg'
                      }
                      // Display auction
                      itemName={charLimit(item.item[0]?.name, 20)}
                      price={currencyFormat(item.current_price)}
                      sellerName={item.user?.username || 'Anonymous'}
                      bid={item.bids.length}
                      countDown={item.end_date}
                      startDate={item.start_date}
                      to={`/product-details/${item.id}`}
                      className="w-full max-w-xs min-h-[450px] mx-auto"
                      status={item.status}
                    />
                  </div>
                ))}
              </div>
            )}
            <Modal isOpen={modalOpen} onClose={closeModal}>
              <h2 className="font-[500] text-start text-[#9f3248] text-[18px]">
                Filters
              </h2>
              <PriceRange
                clear={clearFilter}
                func={setCurrentPriceQuery}
                label={'Current Price'}
              />
              <PriceRange
                clear={clearFilter}
                func={setStartPriceQuery}
                label={'Start Price'}
              />
              <PriceRange
                clear={clearFilter}
                func={setBuyNowPriceQuery}
                label={'Buy Now Price'}
              />
              <Button
                label="Apply Filter"
                className="w-full mt-4"
                onClick={handleFilterChange}
              />
              <Button
                label="Clear Filters"
                className="w-full mt-4"
                onClick={() => {
                  setClearFilter(true);
                  handleClearFilter();
                }}
              />
            </Modal>
          </div>
        </div>

        {/* Pagination */}
        <div className="w-full flex flex-col lg:flex-row gap-4 justify-between items-center mt-10 px-4">
          <div className="lg:flex w-[50%] justify-end items-center gap-2">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="flex w-[30%] items-center justify-end gap-3">
            <p className="text-[#a5a5a5] text-[14px] text-center min-w-20">
              Per page:{' '}
            </p>
            <select
              className="w-[100px] h-[35px] px-2 border rounded-md text-sm text-[#333] focus:outline-none"
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
