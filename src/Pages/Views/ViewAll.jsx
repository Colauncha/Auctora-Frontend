import Slider from '../../Components/Slider';
// import AuctionListing from "../Home/AuctionListing";
import Preloader from '../../Components/Preloader';
import Breadcrumbs from '../../Components/Breadcrumbs';
import Pagination from '../../Components/Pagination';
import { useState, useEffect } from 'react';
import useModeStore from '../../Store/Store';
import { FaAngleDown } from 'react-icons/fa';
import { filter_icom } from '../../Constants';
import Modal from '../../Components/Modal';
import { current, currencyFormat } from '../../utils';
import Card from '../../Components/Card';

const ViewAll = () => {
  const { isMobile } = useModeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
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
      throw new Error(`Error ${errorData.message}`);
    }

    return await response.json();
  };

  // useEffect utilized for debuging state change
  useEffect(() => {
    console.log(`From View all page ${currentPage}`);
  }, [currentPage]);

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

  return (
    <div className="formatter">
      <Breadcrumbs />
      <div className="flex flex-col items-center lg:my-10 lg:mb-20">
        <div className="w-full flex flex-col justify-between lg:flex-row  ">
          <div className="w-full lg:w-[15%] hidden lg:block p-2">
            <Slider />
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
                <div className="flex place-items-center">
                  <div className="text-slate-400 text-sm">Sorted by</div>:
                  <span className="font-bold pl-2 text-sm flex gap-1 place-items-center cursor-pointer">
                    Most Popular <FaAngleDown />
                  </span>
                </div>
              )}
            </div>
            {loading ? (
              <Preloader />
            ) : (
              <div
                className={`grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
              >
                {auctions.map((item) => (
                  <div key={item.id} className="w-full flex justify-center">
                    <Card
                      imgUrl={
                        item.item[0]?.image_link?.link ||
                        'https://res.cloudinary.com/dtkv6il4e/image/upload/v1743008126/ddsdomp6w9lwqb2igqx7.jpg'
                      }
                      // Display auction
                      itemName={item.item[0]?.name}
                      price={currencyFormat(item.current_price)}
                      sellerName={item.user.username || 'Anonymous'}
                      bid={item.bids_count}
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
          <div className="hidden lg:flex w-[50%] justify-end items-center gap-2">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
          <div className="flex w-[30%] items-center justify-end gap-4">
            <p className="text-[#a5a5a5] text-[14px]">Per page: </p>
            <select
              className="w-full lg:w-[15%] h-[30px] p-1 border rounded-md bg-white border-[#a5a5a5] text-[#a5a5a5]"
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
