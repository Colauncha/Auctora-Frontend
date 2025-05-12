import BreadCrumb from "../../Components/Breadcrumbs";
import style from "./css/Dashboard.module.css"
import { useState, useEffect } from "react";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { 
  Withdraw,
  WalletHistory,
  FundWallet,
  AddIcon,
  ActivityIcon,
  SettingsIcon,
  Logout,
  Edit,
  Money,
} from "../../Constants"
import Loader from "../../assets/loader";
import useAuthStore from "../../Store/AuthStore";
import { ctaContext } from "../../Store/ContextStore";
import { capitalize, currencyFormat, charLimit, current } from "../../utils";
import Avatar  from "./Avatar";
import { BsStarFill } from 'react-icons/bs';
import { PropTypes } from 'prop-types';
import { useMemo } from 'react';
import MainModal from '../../Components/modals/MainModal';
import ReferralView from '../../Components/modals/ReferralView';
import FundingWallet from '../../Components/modals/FundingWallet';
import Withdrawal from '../../Components/modals/Withdrawal';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const offCta = ctaContext((state) => state.turnOff);

  // Modals
  const [modalIsOpen, setModalIsOpen] = useState({ state: false, type: '' });

  // useEffect(() => {
  //   setLoading(true);
  //   offCta();
  //   sessionStorage.removeItem('newAccount');
  //   sessionStorage.removeItem('_user');

  //   const getUser = async () => {
  //     let endpoint = `${current}users/profile`;
  //     try {
  //       const response = await fetch(endpoint, {
  //         method: 'GET',
  //         credentials: 'include',
  //       });
  //       if (response.ok) {
  //         let data = await response.json();
  //         setTimeout(() => {
  //           setUser(data.data);
  //           setDisplayName(
  //             data.data.username
  //               ? `@${capitalize(data.data.username)}`
  //               : data.data.email,
  //           );
  //           setAuctions(data.data.auctions);
  //           setBids(data.data.bids);
  //           setRating(data.data.rating);
  //           setLoading(false);
  //           sessionStorage.setItem('_user', JSON.stringify(data.data));
  //           console.log(data.data);
  //         }, 1000);
  //       } else {
  //         let data = await response.json();
  //         console.error(data);
  //         navigate('/sign-in');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       navigate('/sign-in');
  //     }
  //   };

  //   let userId = localStorage.getItem('userId');
  //   let data = JSON.parse(sessionStorage.getItem('_user'));
  //   if (!data || !userId) {
  //     console.log('running fetch...');
  //     getUser();
  //     return;
  //   } else {
  //     console.log(data);
  //     setUser(data);
  //     setDisplayName(
  //       data.username ? `@${capitalize(data.username)}` : data.email,
  //     );
  //     setAuctions(data.auctions);
  //     setLoading(false);
  //     return;
  //   }
  // }, [navigate, offCta]);

  useEffect(() => {
    setLoading(true);
    offCta();
    sessionStorage.removeItem('newAccount');
    sessionStorage.removeItem('_user');

    const getUser = async () => {
      const endpoint = `${current}users/profile`;
      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include', // important for sending cookies
        });

        if (response.ok) {
          const result = await response.json();
          const data = result.data;
          if (data === null) {
            setLoading(false);
            navigate('/sign-in');
            return;
          }
          setTimeout(() => {
            setUser(data);
            setDisplayName(
              data.username ? `@${capitalize(data.username)}` : data.email,
            );
            setAuctions(data.auctions);
            setBids(data.bids);
            setRating(data.rating);
            setLoading(false);
            sessionStorage.setItem('_user', JSON.stringify(data)); // optional cache
          }, 1000);
        } else {
          const error = await response.json();
          console.error(error);
          navigate('/sign-in');
        }
      } catch (err) {
        console.error(err);
        navigate('/sign-in');
      }
    };

    const cachedData = sessionStorage.getItem('_user');
    if (!cachedData) {
      getUser();
    } else {
      const data = JSON.parse(cachedData);
      setUser(data);
      setDisplayName(
        data.username ? `@${capitalize(data.username)}` : data.email,
      );
      setAuctions(data.auctions);
      setBids(data.bids);
      setRating(data.rating);
      setLoading(false);
    }
  }, [navigate, offCta]);

  const logout = async () => {
    setLoading(true);
    let endpoint = `${current}users/logout`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        setTimeout(() => {
          setLoading(false);
          logoutUser();
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          sessionStorage.removeItem('_user');
          navigate('/');
        }, 500);
      } else {
        let data = await response.json();
        setLoading(false);
        console.error(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const viewAuction = async (id) => {
    navigate(`/auctiondetails/${id}`);
  };

  const AddProduct = () => {
    navigate('/add-product');
  };

  const updateProfile = () => {
    navigate('/update-profile');
  };

  const updateAddress = () => {
    navigate('/update-address');
  };

  const updateBank = () => {
    navigate('/bank-account');
  };

  const viewAuctions = () => {
    navigate('/products');
  };

  const productDetails = (id) => {
    navigate(`/product-details/${id}`);
  };

  const StarRating = useMemo(() => {
    const Component = ({ rating }) => (
      <>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <BsStarFill
              key={i}
              className={`${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              } w-5 h-5`}
            />
          ))}
      </>
    );

    Component.propTypes = {
      rating: PropTypes.number.isRequired,
    };

    return Component;
  }, []);

  const handleCloseModal = () => {
    setModalIsOpen({ state: false, type: '' });
  };

  const showModal = (type) => {
    setModalIsOpen({ state: true, type: type });
  };

  return (
    <>
      <div className={style.container}>
        {modalIsOpen.state && modalIsOpen.type === 'referral' && (
          <MainModal header="Referrals" close={handleCloseModal}>
            <ReferralView />
          </MainModal>
        )}
        {modalIsOpen.state && modalIsOpen.type === 'funding' && (
          <MainModal header="Fund Wallet" close={handleCloseModal}>
            <FundingWallet />
          </MainModal>
        )}
        {modalIsOpen.state && modalIsOpen.type === 'withdraw' && (
          <MainModal header="Withdraw" close={handleCloseModal}>
            <Withdrawal />
          </MainModal>
        )}
        <div className={style.sandwich}>
          <div className={style.avatar}>
            <Avatar
              imageUrl={user?.image ? user.image.public_url : null}
              username={user.username ? user.username : user.email}
            />
            <div className={style.avatarAfter}></div>
            <p>{charLimit(displayName, 20)}</p>
            <p className={style.avatarEmail}>
              {user.username ? charLimit(user.email, 20) : ''}
            </p>
          </div>
          <div className={style.actions}>
            <Button
              icon={AddIcon}
              className={style.button}
              iconClassName={style.buttonIcon}
              label="Create New"
              onClick={() => AddProduct()}
            />
            <Button
              icon={ActivityIcon}
              className={style.button}
              iconClassName={style.buttonIcon}
              label="Auctions"
              onClick={() => viewAuctions()}
            />
            <Button
              icon={WalletHistory}
              className={style.button}
              iconClassName={style.buttonIcon}
              label="Wallet History"
              onClick={() => {}}
            />
          </div>
          <div className={style.preferences}>
            <Button
              icon={SettingsIcon}
              className={style.button}
              iconClassName={style.buttonIcon}
              label="Referral"
              onClick={() => showModal('referral')}
            />
            <Button
              icon={Logout}
              className={style.button}
              iconClassName={style.buttonIcon}
              label="Logout"
              onClick={() => logout()}
            />
          </div>
        </div>
        <div className={style.panel}>
          <BreadCrumb />
          {loading && <Loader />}
          <div className={style.top}>
            <div className={style.greet}>
              <h1>Welcome back, {charLimit(displayName, 20)}</h1>
              <div className="flex gap-3 flex-wrap">
                <Button
                  icon={Money}
                  className={style.panelButton}
                  iconClassName={style.buttonIcon}
                  label="Account details"
                  onClick={() => updateBank()}
                />
                <Button
                  icon={Edit}
                  className={style.panelButton}
                  iconClassName={style.buttonIcon}
                  label="Update profile"
                  onClick={() => updateProfile()}
                />
                <Button
                  icon={AddIcon}
                  className={style.panelButton}
                  iconClassName={style.buttonIcon}
                  label="Create Auction"
                  onClick={() => AddProduct()}
                />
                <Button
                  icon={Edit}
                  className={style.panelButton}
                  iconClassName={style.buttonIcon}
                  label="Update address"
                  onClick={() => updateAddress()}
                />
              </div>
            </div>
            <div className={style.wallet}>
              <h1>Wallet Balance</h1>
              <div className={style.walletBalance}>
                <p className="relative group" id={style.total}>
                  <strong>Available:</strong>
                  <div>
                    {user.wallet
                      ? currencyFormat(user.available_balance)
                      : currencyFormat('0.00')}
                  </div>
                  <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                    Money spent while bidding is deducted from this balance
                  </span>
                </p>
                <p className="relative group" id={style.available}>
                  <span>Total:</span>
                  <span>
                    {user.wallet
                      ? currencyFormat(user.wallet)
                      : currencyFormat('0.00')}
                  </span>
                  <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                    Total amount in your wallet
                  </span>
                </p>
              </div>
              <div className={style.walletActions}>
                <Button
                  icon={FundWallet}
                  className={style.panelButton}
                  iconClassName={style.buttonIcon}
                  label="Fund Wallet"
                  onClick={() => showModal('funding')}
                />
                <Button
                  icon={Withdraw}
                  className={style.panelButton}
                  iconClassName={style.buttonIcon}
                  label="Withdraw"
                  onClick={() => showModal('withdraw')}
                />
              </div>
            </div>
          </div>
          <div className={style.bottom}>
            <div className={style.bottomLeft}>
              {loading ?? <Loader />}
              {auctions && auctions.length > 0 ? (
                <>
                  <h1>
                    Your Auctions{' '}
                    <span onClick={() => viewAuctions()}>View all</span>
                  </h1>
                  <table className={style.auctionTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start price</th>
                        <th>Current price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auctions.map((obj) => (
                        <tr key={obj.id} onClick={() => viewAuction(obj.id)}>
                          <td className="relative group">
                            {charLimit(obj.item[0]?.name, 10)}
                            {/* {charLimit(obj.id, 10)} */}
                            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                              {obj.item[0]?.name}
                              {/* {obj.id} */}
                            </span>
                          </td>
                          <td className="relative group">
                            {charLimit(obj.item[0]?.description, 20)}
                            {/* {charLimit(obj.id, 20)} */}
                            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                              {obj.item[0]?.description}
                              {/* {obj.id} */}
                            </span>
                          </td>
                          <td className="relative group">
                            {currencyFormat(obj.start_price)}
                            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                              {currencyFormat(obj.start_price)}
                            </span>
                          </td>
                          <td className="relative group">
                            {currencyFormat(obj.current_price)}
                            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                              {currencyFormat(obj.current_price)}
                            </span>
                          </td>
                          <td className="relative group">
                            {capitalize(obj.status)}
                            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
                              {capitalize(obj.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* <Button label="View All" className={`${style.panelButton} ${style.bottomLeftButton}`} onClick={() => {}} /> */}
                </>
              ) : (
                <>
                  <h2>No Auctions yet</h2>
                  <Button
                    icon={AddIcon}
                    className={style.panelButton}
                    iconClassName={style.buttonIcon}
                    label="Create Auction"
                    onClick={() => AddProduct()}
                  />
                </>
              )}
            </div>
            <div className={style.bottomRight}>
              <div className={style.bottomRightRating}>
                <StarRating rating={rating} />
              </div>
              <div className={style.bottomRightBids}>
                {bids && bids.length > 0 ? (
                  <div className={style.bidContainer}>
                    <h2>Bids</h2>
                    {bids.map((bid, index) => (
                      <div
                        key={index}
                        className={`${style.bidItem} relative group`}
                        onClick={() => productDetails(bid.auction_id)}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={bid.auction?.item[0]?.image_link?.link}
                            alt="Auction Image"
                            className={style.bidImages}
                          />
                          <p>{bid.auction?.item[0]?.name}</p>
                        </div>
                        <p>{currencyFormat(bid.amount)}</p>
                        <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block z-10">
                          {`Description: ${charLimit(
                            bid.auction?.item[0]?.description,
                            30,
                          )}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <h2>No Bids yet</h2>
                    <Button
                      icon={AddIcon}
                      className={style.panelButton}
                      iconClassName={style.buttonIcon}
                      label="View Auctions"
                      onClick={() => AddProduct()}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

