


// import Stopwatch from "./Stopwatch";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";

// const   CountDown = () => {

// const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

//   useEffect(() => {
//     if (isAuthenticated) {
//       const fetchUserData = async () => {
//         try {
//           const response = await fetch(`${current}users/notifications/`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//           });

//           const data = await response.json();

//           if (!response.ok) {
//             if (
//               data.status_code === 401 &&
//               data.message === 'Unauthenticated'
//             ) {
//               if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//                 intervalRef.current = null;
//               }
//               logoutUser(); // Triggers a state update and possibly a rerender
//               return;
//             }
//             throw new Error('Failed to fetch user data');
//           }

//           sessionStorage.setItem(
//             'notifications',
//             JSON.stringify({ data: data.data, total: data.total }),
//           );
//           setNotifTotal(data.total);
//         } catch (error) {
//           console.error(error);
//         }
//       };

//       fetchUserData(); // run once immediately
//       intervalRef.current = setInterval(fetchUserData, 60000);

//       return () => {
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//           intervalRef.current = null;
//         }
//       };
//     }
//   }, [isAuthenticated, logoutUser]);

//   const toggleMenu = () => setIsMenuOpen((prev) => !prev);
//   const navigate = useNavigate();

//     const handleNotification = () => {
//     navigate('/Ongoing-Auction');
//   };

//   return (
//     <div className="mt-[40px] lg:py-[80px] flex flex-col gap-[32px]">
//       {/* Heading */}
//       <h1 className="w-full text-[32px] leading-[80px] md:text-[48px] lg:text-[64px] font-[700] text-[#9F3247]">
//         Your Gateway to Exciting Auctions
//       </h1>

//       {/* Description */}
//       <p className="w-full text-[16px] md:text-[18px] text-[#9F3247]">
//         Discover treasures at Biddius - where bidding meets buying. Join online
//         auctions and find unique items to buy and sell with excitement!
//       </p>

//       {/* Stopwatch and Button */}
//       <div className="flex flex-col-reverse gap-[36px] md:flex-col items-center md:items-start">
//         <Stopwatch days={5} hours={4} minutes={55} seconds={35} />
//         <div className="w-full">
//           <Button
//   label="Bid Now"
//   className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] w-full lg:w-[200px]"
//   onClick={() => {
//   if (isAuthenticated) {
//     navigate('/Ongoing-Auction');
//   } else {
//     sessionStorage.setItem('postSignupRedirect', '/Ongoing-Auction');
//     navigate('/signup');
//   }
// }}

  
// />

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountDown;



import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Stopwatch from "./Stopwatch";
import Button from "./Button";
import useAuthStore from "../Store/AuthStore";


const CountDown = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const setNotifTotal = useAuthStore((state) => state.setNotifTotal); // or however you're setting it
  const intervalRef = useRef(null);
  const current = import.meta.env.VITE_API_BASE_URL; // or wherever `current` is defined
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${current}users/notifications/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.status_code === 401 && data.message === "Unauthenticated") {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              logoutUser();
              return;
            }
            throw new Error("Failed to fetch user data");
          }

          sessionStorage.setItem(
            "notifications",
            JSON.stringify({ data: data.data, total: data.total })
          );
          setNotifTotal(data.total);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUserData();
      intervalRef.current = setInterval(fetchUserData, 60000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isAuthenticated, logoutUser, setNotifTotal, current]);

  const handleBidNow = () => {
    if (isAuthenticated) {
      navigate("/Ongoing-Auction");
    } else {
      sessionStorage.setItem("postSignupRedirect", "/Ongoing-Auction");
      navigate("/sign-in");
    }
  };

  return (
    <div className="mt-[40px] lg:py-[80px] flex flex-col gap-[32px]">
      {/* Heading */}
      <h1 className="w-full text-[32px] leading-[80px] md:text-[48px] lg:text-[64px] font-[700] text-[#9F3247]">
        Your Gateway to Exciting Auctions
      </h1>

      {/* Description */}
      <p className="w-full text-[16px] md:text-[18px] text-[#9F3247]">
        Discover treasures at Biddius - where bidding meets buying. Join online
        auctions and find unique items to buy and sell with excitement!
      </p>

      {/* Stopwatch and Button */}
      <div className="flex flex-col-reverse gap-[36px] md:flex-col items-center md:items-start">
        <Stopwatch days={5} hours={4} minutes={55} seconds={35} />
        <div className="w-full">
          <Button
            label="Bid Now"
            className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] w-full lg:w-[200px]"
            onClick={handleBidNow}
          />
        </div>
      </div>
    </div>
  );
};

export default CountDown;
