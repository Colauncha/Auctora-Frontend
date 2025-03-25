// import BreadCrumb from "../../Components/Breadcrumbs";
// import style from "./css/Dashboard.module.css"
// import { useState, useEffect } from "react";
// import Button from "../../Components/Button";
// import { useNavigate } from "react-router-dom";
// import { 
//   Withdraw,
//   WalletHistory,
//   FundWallet,
//   AddIcon,
//   ActivityIcon,
//   SettingsIcon,
//   Logout,
//   Edit,
//   Money,
// } from "../../Constants"
// import Loader from "../../assets/loader";
// import useAuthStore from "../../Store/AuthStore";
// import { ctaContext } from "../../Store/ContextStore";
// import { capitalize, currencyFormat, charLimit, current } from "../../utils";
// import Avatar  from "./Avatar";


// const Dashboard = () => {
//   const [user, setUser] = useState({});
//   const [displayName, setDisplayName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [auctions, setAuctions] = useState([]);
//   const navigate = useNavigate();
//   const logoutUser = useAuthStore((state) => state.logout);
//   const offCta = ctaContext((state) => state.turnOff)


//   useEffect(() => {
//     setLoading(true)
//     offCta()

//     const getUser = async () => { 
//       let endpoint = `${current}users/profile`;
//       try {
//         const response = await fetch(endpoint, {
//           method: "GET",
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//           credentials: "include",
//         })
//         if (response.ok) {
//           let data = await response.json()
//           setTimeout(() => {
//             setUser(data.data)
//             setDisplayName(data.data.username ? `@${capitalize(data.data.username)}` : data.data.email)
//             setAuctions(data.data.auctions)
//             setLoading(false)
//             sessionStorage.setItem('_user', JSON.stringify(data.data))
//             console.log(data.data)
//           }, 1000)
//         } else {
//           let data = await response.json()
//           console.error(data)
//           navigate("/sign-in")
//         }
//       } catch (error) {
//         console.log(error)
//         navigate("/sign-in")
//       }
//     }
//     let data = JSON.parse(sessionStorage.getItem('_user'))
//     if (!data) {
//       getUser();
//       return
//     } else {
//       setUser(data);
//       setDisplayName(data.username ? `@${capitalize(data.username)}` : data.email);
//       setAuctions(data.auctions);
//       setLoading(false);
//       return;
//     }
//   }, [navigate, offCta])

//   const logout = async () => {
//     setLoading(true)
//     let endpoint = `${current}users/logout`;

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         credentials: "include",
//       })
//       if (response.ok) {
//         let data = await response.json()
//         console.log(data)
//         setTimeout(() => {
//           setLoading(false)
//           logoutUser()
//           localStorage.removeItem("token")
//           localStorage.removeItem("userId")
//           sessionStorage.removeItem('_user')
//           navigate("/")
//         }, 500)

//       } else {
//         let data = await response.json()
//         setLoading(false)
//         console.error(data)
//       }
//     } catch (error) {
//       setLoading(false)
//       console.log(error)
//     }
//   }

//   const viewAuction = async (id) => {
//     console.log(id)
//   }

//   return (
//     <>
//       <div className={style.container}>
//         <div className={style.sandwich}>
//           <div className={style.avatar}>
//             <Avatar imageUrl={user?.image ? user.image.public_url : null} username={user.username ? user.username : user.email} />
//             <div className={style.avatarAfter}></div>
//             <p>{charLimit(displayName, 20)}</p>
//             <p className={style.avatarEmail}>{user.username ? charLimit(user.email, 20) : ''}</p>
//           </div>
//           <div className={style.actions}>
//             <Button icon={AddIcon} className={style.button} iconClassName={style.buttonIcon} label="Create New" onClick={() => {}} />
//             <Button icon={ActivityIcon} className={style.button} iconClassName={style.buttonIcon} label="Auctions" onClick={() => {}} />
//             <Button icon={WalletHistory} className={style.button} iconClassName={style.buttonIcon} label="Wallet History" onClick={() => {}} />
//           </div>
//           <div className={style.preferences}>
//             <Button icon={SettingsIcon} className={style.button} iconClassName={style.buttonIcon} label="Settings" onClick={() => {}} />
//             <Button icon={Logout} className={style.button} iconClassName={style.buttonIcon} label="Logout" onClick={() => logout()} />
//           </div>
//         </div>
//         <div className={style.panel}>
//           <BreadCrumb />
//           {loading && <Loader />}
//           <div className={style.top}>
//             <div className={style.greet}>
//               <h1>Welcome back, {charLimit(displayName, 20)}</h1>
//               <div className="flex gap-3 flex-wrap">
//                 <Button icon={Money} className={style.panelButton} iconClassName={style.buttonIcon} label="Account details" onClick={() => {}} />
//                 <Button icon={Edit} className={style.panelButton} iconClassName={style.buttonIcon} label="Update profile" onClick={() => {}} />
//                 <Button icon={AddIcon} className={style.panelButton} iconClassName={style.buttonIcon} label="Create Auction" onClick={() => {}} />
//                 {/* <Button icon={FundWallet} className={style.panelButton} iconClassName={style.buttonIcon} label="Update profile" onClick={() => {}} /> */}
//               </div>
//             </div>
//             <div className={style.wallet}>
//               <h1>Wallet Balance</h1>
//               <div className={style.walletBalance}>
//                 <p className="relative group" id={style.total}>
//                   <strong>Total:</strong>
//                   <div>{user.wallet ? currencyFormat(user.wallet) : currencyFormat("0.00")}</div>
//                   <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                     Total amount in your wallet
//                   </span>
//                 </p>
//                 <p className="relative group" id={style.available}>
//                   <span>Available:</span> 
//                   <span>{user.wallet ? currencyFormat(user.available_balance) : currencyFormat("0.00")}</span>
//                   <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                     Money spent while bidding is deducted from this balance
//                   </span>
//                 </p>
//               </div>
//               <div className={style.walletActions}>
//                 <Button icon={FundWallet} className={style.panelButton} iconClassName={style.buttonIcon} label="Fund Wallet" onClick={() => {}} />
//                 <Button icon={Withdraw} className={style.panelButton} iconClassName={style.buttonIcon} label="Withdraw" onClick={() => {}} />
//               </div>
//             </div>
//           </div>
//           <div className={style.bottom}>
//             <div className={style.bottomLeft}>
//               {loading ?? <Loader />}
//               {
//                 auctions && auctions.length > 0 ? (
//                   <>
//                     <h1>Your Auctions <span onClick={() => {}}>View all</span></h1>
//                     <table className={style.auctionTable}>
//                       <thead>
//                         <tr>
//                           <th>Name</th>
//                           <th>Description</th>
//                           <th>Start price</th>
//                           <th>Current price</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                     <tbody>
//                       {auctions.map((obj) => (
//                         <tr key={obj.id} onClick={() => viewAuction(obj.id)}>
//                         <td className="relative group">
//                           {charLimit(obj.item[0]?.name, 10)}
//                           {/* {charLimit(obj.id, 10)} */}
//                           <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                           {obj.item[0]?.name}
//                           {/* {obj.id} */}
//                           </span>
//                         </td>
//                         <td className="relative group">
//                           {charLimit(obj.item[0]?.description, 20)}
//                           {/* {charLimit(obj.id, 20)} */}
//                           <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                           {obj.item[0]?.description}
//                           {/* {obj.id} */}
//                           </span>
//                         </td>
//                         <td className="relative group">
//                           {currencyFormat(obj.start_price)}
//                           <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                           {currencyFormat(obj.start_price)}
//                           </span>
//                         </td>
//                         <td className="relative group">
//                           {currencyFormat(obj.current_price)}
//                           <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                           {currencyFormat(obj.current_price)}
//                           </span>
//                         </td>
//                         <td className="relative group">
//                           {capitalize(obj.status)}
//                           <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
//                           {capitalize(obj.status)}
//                           </span>
//                         </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                   {/* <Button label="View All" className={`${style.panelButton} ${style.bottomLeftButton}`} onClick={() => {}} /> */}
//                 </>
//               ) : (
//               <>
//                 <h2>No Auctions yet</h2>
//                 <Button icon={AddIcon} className={style.panelButton} iconClassName={style.buttonIcon} label="Create Auction" onClick={() => {}} />
//               </>
//               )
//               }
//             </div>
//             <div className={style.bottomRight}>
//               <div className={style.bottomRightRating}>
//                 <p>Ratings</p>
//               </div>
//               <div className={style.bottomRightBids}>
//                 <p>Bids</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;

import BreadCrumb from "../../Components/Breadcrumbs";
import style from "./css/Dashboard.module.css";
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
} from "../../Constants";
import Loader from "../../assets/loader";
import useAuthStore from "../../Store/AuthStore";
import { ctaContext } from "../../Store/ContextStore";
import { capitalize, currencyFormat, charLimit, current } from "../../utils";
import Avatar from "./Avatar";
import PropTypes from "prop-types";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);
  const offCta = ctaContext((state) => state.turnOff);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      offCta();
      setError(null);

      try {
        const cachedUser = JSON.parse(sessionStorage.getItem('_user'));
        if (cachedUser) {
          setUserData(cachedUser);
          setLoading(false);
          return;
        }

        const response = await fetch(`${current}users/profile`, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.data);
        sessionStorage.setItem('_user', JSON.stringify(data.data));
      } catch (err) {
        setError(err.message);
        navigate("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    const setUserData = (userData) => {
      setUser(userData);
      setDisplayName(
        userData.username 
          ? `@${capitalize(userData.username)}` 
          : userData.email
      );
      setAuctions(userData.auctions || []);
    };

    fetchUserData();
  }, [navigate, offCta]);

  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${current}users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      sessionStorage.removeItem('_user');
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewAuction = (id) => {
    navigate(`/auction/${id}`);
  };

  const Tooltip = ({ content, children }) => (
    <span className={style.tooltipContainer}>
      {children}
      <span className={style.tooltip}>{content}</span>
    </span>
  );

  if (error) {
    return (
      <div className={style.errorContainer}>
        <p>Error: {error}</p>
        <Button label="Try Again" onClick={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.sandwich}>
        <div className={style.avatar}>
          <Avatar 
            imageUrl={user?.image?.public_url} 
            username={user.username || user.email} 
          />
          <div className={style.avatarAfter}></div>
          <Tooltip content={displayName}>
            <p>{charLimit(displayName, 20)}</p>
          </Tooltip>
          {user.username && (
            <Tooltip content={user.email}>
              <p className={style.avatarEmail}>{charLimit(user.email, 20)}</p>
            </Tooltip>
          )}
        </div>

        <div className={style.actions}>
          <Button 
            icon={AddIcon} 
            label="Create New" 
            onClick={() => navigate("/create-auction")}
          />
          <Button 
            icon={ActivityIcon} 
            label="Auctions" 
            onClick={() => navigate("/auctions")}
          />
          <Button 
            icon={WalletHistory} 
            label="Wallet History" 
            onClick={() => navigate("/wallet-history")}
          />
        </div>

        <div className={style.preferences}>
          <Button 
            icon={SettingsIcon} 
            label="Settings" 
            onClick={() => navigate("/settings")}
          />
          <Button 
            icon={Logout} 
            label="Logout" 
            onClick={logout}
            disabled={loading}
          />
        </div>
      </div>

      <div className={style.panel}>
        <BreadCrumb />
        {loading && <Loader />}

        <div className={style.top}>
          <div className={style.greet}>
            <h1>Welcome back, {charLimit(displayName, 20)}</h1>
            <div className={style.buttonGroup}>
              <Button 
                icon={Money} 
                label="Account details" 
                onClick={() => navigate("/account")}
              />
              <Button 
                icon={Edit} 
                label="Update profile" 
                onClick={() => navigate("/profile")}
              />
              <Button 
                icon={AddIcon} 
                label="Create Auction" 
                onClick={() => navigate("/create-auction")}
              />
            </div>
          </div>

          <div className={style.wallet}>
            <h1>Wallet Balance</h1>
            <div className={style.walletBalance}>
              <Tooltip content="Total amount in your wallet">
                <p>
                  <strong>Total:</strong>
                  <span>{currencyFormat(user.wallet || 0)}</span>
                </p>
              </Tooltip>
              <Tooltip content="Money available for bidding">
                <p>
                  <span>Available:</span>
                  <span>{currencyFormat(user.available_balance || 0)}</span>
                </p>
              </Tooltip>
            </div>
            <div className={style.walletActions}>
              <Button 
                icon={FundWallet} 
                label="Fund Wallet" 
                onClick={() => navigate("/fund-wallet")}
              />
              <Button 
                icon={Withdraw} 
                label="Withdraw" 
                onClick={() => navigate("/withdraw")}
              />
            </div>
          </div>
        </div>

        <div className={style.bottom}>
          <div className={style.bottomLeft}>
            {auctions.length > 0 ? (
              <>
                <h1>
                  Your Auctions 
                  <span onClick={() => navigate("/auctions")}>View all</span>
                </h1>
                <div className={style.tableContainer}>
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
                      {auctions.map((auction) => (
                        <tr key={auction.id} onClick={() => viewAuction(auction.id)}>
                          <td>
                            <Tooltip content={auction.item[0]?.name}>
                              {charLimit(auction.item[0]?.name, 10)}
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip content={auction.item[0]?.description}>
                              {charLimit(auction.item[0]?.description, 20)}
                            </Tooltip>
                          </td>
                          <td>{currencyFormat(auction.start_price)}</td>
                          <td>{currencyFormat(auction.current_price)}</td>
                          <td>{capitalize(auction.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={style.emptyState}>
                <h2>No Auctions yet</h2>
                <Button 
                  icon={AddIcon} 
                  label="Create Auction" 
                  onClick={() => navigate("/create-auction")}
                />
              </div>
            )}
          </div>

          <div className={style.bottomRight}>
            <div className={style.bottomRightRating}>
              <h3>Ratings</h3>
              {/* Rating component would go here */}
            </div>
            <div className={style.bottomRightBids}>
              <h3>Recent Bids</h3>
              {/* Bids component would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  onClose: PropTypes.func,
};

export default Dashboard;