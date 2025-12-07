
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import { LuAlignJustify } from 'react-icons/lu';
import { RiCloseLargeFill } from 'react-icons/ri';
import Search from '../../Components/Search';
import { likee, logo, search_glass, user, notification } from '../../Constants';
import useModeStore from '../../Store/Store';
import useAuthStore from '../../Store/AuthStore';
import { NotifContext } from '../../Store/notifContex';
import { current } from '../../utils';
import { PropTypes } from 'prop-types';
import { MoveRight } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotifToast = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="p-2">
      <p className="font-bold">{data.title}</p>
      <p className="text-sm">{data.message}</p>
      <div className="text-[10px] mt-2 flex gap-3 justify-start items-center">
        <span
          onClick={() => {
            if (data.id === 'welcome-notification') {
              navigate('/Ongoing-Auction');
            } else {
              navigate('/notification');
            }
          }}
          className="underline hover:text-blue-400"
        >
          View All
        </span>
        {data?.links && (
          <span>
            <a
              className="relative group flex items-center gap-1 underline hover:text-blue-400"
              href={`${data?.links && data.links[0]}`}
            >
              <span>View Detail</span>
              <MoveRight
                size={12}
                className="group-hover:translate-x-2 transition-all duration-200 ease-linear"
              />
            </a>
          </span>
        )}
      </div>
    </div>
  );
};

NotifToast.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    links: PropTypes.Array,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const Nav = () => {
  const menuArr = [
    { _id: 1, label: 'Home', link: '/' },
    { _id: 2, label: 'Auctlist', link: '/Ongoing-Auction' },

    { _id: 3, label: 'Sell', link: '/Add-product' },
    { _id: 4, label: 'About Us', link: '/about-us' },
  ];

  const { notifTotal, setNotifTotal } = useContext(NotifContext);

  const { isMobile, setModeBasedOnScreenSize } = useModeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(70);
  const [shouldBlur, setShouldBlur] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutUser = useAuthStore((state) => state.logout);

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setIsScrolled(isScrolled);
      setShouldBlur(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setModeBasedOnScreenSize();
    };
    window.addEventListener('resize', handleResize);
    setModeBasedOnScreenSize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setModeBasedOnScreenSize]);

  useEffect(() => {
    const dailyVisit = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dailyVisit='));

    if (dailyVisit) {
      return;
    } else {
      setTimeout(() => {
        toast.info(<NotifToast />, {
          data: {
            title: 'Welcome to Biddius!',
            message: 'Explore and enjoy seamless auction experiences.',
            id: 'welcome-notification',
          },
          autoClose: 10000,
          position: 'bottom-right',
        });
      }, [3000]);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const es = new EventSource(`${current}users/notifications/subscribe`, {
        withCredentials: true,
        retry: true,
      });

      es.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setNotifTotal(notifTotal + 1);
        console.log('New notification received:', parsedData);
        toast.info(<NotifToast />, {
          data: parsedData,
          autoClose: 10000,
        });
      };

      es.addEventListener('count', (e) => {
        const parsedData = JSON.parse(e.data);
        setNotifTotal(parsedData.unread);
      });

      es.onerror = (error) => {
        console.error('EventSource failed:', error);
        setNotifTotal(0);
        es.close();
      };

      return () => {
        es.close();
      };
    }
  }, [isAuthenticated, logoutUser, setNotifTotal, notifTotal]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (!query) console.log(navHeight);
    console.log(`searching...${query}`);
  };

  const handleNotification = () => {
    navigate('/notification');
  };

  if (path.startsWith('/admin')) return null;

  return (
    <>
      <div
        ref={navRef}
        className={`fixed left-0 right-0 z-50 bg-white border-b shadow-sm transition-all duration-300 ${
          isScrolled ? 'top-0' : 'top-12'
        } ${shouldBlur ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}
      >
        {isMobile ? (
          <div className="flex justify-between items-center w-full px-3 py-3">
            <div className="flex items-center gap-3">
              {isMenuOpen ? (
                <RiCloseLargeFill
                  size={26}
                  onClick={toggleMenu}
                  className="cursor-pointer text-gray-700"
                />
              ) : (
                <LuAlignJustify
                  size={26}
                  onClick={toggleMenu}
                  className="cursor-pointer text-gray-700"
                />
              )}
              <Link to={`/`}>
                <img src={logo} alt="logo" className="w-20 h-10" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={search_glass}
                alt=""
                className="h-4 w-4 cursor-pointer"
              />
              <img
                src={notification}
                alt=""
                onClick={handleNotification}
                className="h-4 w-4 cursor-pointer"
              />
              <img
                src={user}
                alt=""
                onClick={() => navigate('/dashboard')}
                className="h-4 w-4 cursor-pointer"
              />
            </div>

            {isMenuOpen && (
              <nav className="absolute z-10 top-0 left-0 w-full h-screen bg-gradient-to-r from-[#7B2334] to-[#9F3247] text-white p-6">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                  <Link to={`/`} onClick={toggleMenu}>
                    <img src={logo} alt="logo" className="w-20 h-10" />
                  </Link>
                  <RiCloseLargeFill
                    size={26}
                    onClick={toggleMenu}
                    className="cursor-pointer text-gray-700"
                  />
                </div>

                <ul className="flex flex-col gap-8 mt-12 text-lg font-medium">
                  {menuArr.map((item) => (
                    <NavLink
                      key={item._id}
                      to={item.link}
                      onClick={toggleMenu}
                      className={({ isActive }) =>
                        `transition-colors duration-200 hover:text-yellow-200 ${
                          isActive ? 'text-yellow-300' : ''
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </ul>

                <div className="mt-8">
                  <Search
                    img={search_glass}
                    placeholder="Search products..."
                    onClick={handleSearch}
                    className="w-full"
                  />
                </div>
              </nav>
            )}
          </div>
        ) : (
          <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2 h-[70px]">
            <div className="flex items-center gap-4">
              <Link to={`/`}>
                <img src={logo} alt="logo" className="w-[120px] h-[40px]" />
              </Link>
            </div>

            <nav className="text-[15px]">
              <span className="flex gap-8 font-medium">
                {menuArr.map((item) => (
                  <NavLink
                    key={item._id}
                    to={item.link}
                    className={({ isActive }) =>
                      `hover:text-[#9F3247] transition-colors duration-200 ${
                        isActive
                          ? 'text-[#9F3247] font-semibold'
                          : 'text-gray-700'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </span>
            </nav>

            <div className="flex items-center gap-8">
              <Search
                className="w-[300px] md:w-[320px] lg:w-[380px]"
                img={search_glass}
                onClick={handleSearch}
                placeholder="Search for Products..."
              />

              {/* Notification Icon with Badge */}
              <div className="relative">
                <img
                  src={notification}
                  alt=""
                  className="h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-gray-100 rounded"
                  onClick={handleNotification}
                />
                {notifTotal > 0 && (
                  <span
                    className="absolute top-[-8px] right-[-8px] h-5 w-5 rounded-full bg-red-600 border-2 border-white 
                    flex items-center justify-center cursor-pointer"
                    onClick={handleNotification}
                    title="You have new notifications"
                  >
                    <span className="text-white text-[10px] font-bold">
                      {notifTotal > 9 ? '9+' : notifTotal}
                    </span>
                  </span>
                )}
              </div>

              <img
                src={likee}
                alt=""
                className="h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-gray-100 rounded"
                onClick={() => navigate('/dashboard')}
              />
              <img
                src={user}
                alt=""
                className="h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-gray-100 rounded"
                onClick={() => navigate('/dashboard')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Spacer */}
      <div
        style={{ height: `${isScrolled ? 0 : 60}px` }}
        className="w-full"
      ></div>
    </>
  );
};

export default Nav;


