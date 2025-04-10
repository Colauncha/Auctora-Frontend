
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react"; // Added useRef import
import { LuAlignJustify } from "react-icons/lu";
import { RiCloseLargeFill } from "react-icons/ri";
import Search from "../../Components/Search";
import { likee, logo, search_glass, user, notification } from "../../Constants";
import useModeStore from "../../Store/Store";

const Nav = () => {
  const menuArr = [
    { _id: 1, label: "Home", link: "/" },
    { _id: 2, label: "Auctlist", link: "/Ongoing-Auction" },
    { _id: 3, label: "Sell", link: "/Add-product" },
    { _id: 4, label: "About Us", link: "/about-us" },
  ];
  
  const { isMobile, setModeBasedOnScreenSize } = useModeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(70); // Adjusted height
  const [shouldBlur, setShouldBlur] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setIsScrolled(isScrolled);
      setShouldBlur(isScrolled); // Enable blur only when scrolled
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update height on scroll/resize
  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight); // Dynamically set height
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Existing resize handler
  useEffect(() => {
    const handleResize = () => {
      setModeBasedOnScreenSize();
    };
    window.addEventListener("resize", handleResize);
    setModeBasedOnScreenSize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setModeBasedOnScreenSize]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  const handleSearch = () => {
    console.log("searching...");
  };

  const handleNotification = () => {
    navigate("/notification");
  };

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
                  className="cursor-pointer"
                />
              ) : (
                <LuAlignJustify
                  size={26}
                  onClick={toggleMenu}
                  className="cursor-pointer"
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
                    placeholder={`Search for Products`}
                    onClick={handleSearch}
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
              <ul className="flex gap-8 font-medium">
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
              </ul>
            </nav>

            <div className="flex items-center gap-8">
              <Search
                className="w-[300px] md:w-[320px] lg:w-[380px]"
                img={search_glass}
                onClick={handleSearch}
                placeholder="Search for Products..."
              />
              <img
                src={notification}
                alt=""
                className="h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-gray-100 rounded"
                onClick={handleNotification}
              />
              <img
                src={likee}
                alt=""
                className="h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110 hover:bg-gray-100 rounded"
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







