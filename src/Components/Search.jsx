import { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { current } from '../utils';
import Loader from '../assets/loader2';
import { PlaceHolderImage } from '../Constants';

const Search = ({ className, onClick, img, placeholder }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const wrapperRef = useRef();


    useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
  try {
    const response = await fetch(
      `${current}landing/search?q=${encodeURIComponent(searchValue)}`
    );
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data.data || []);
      setIsDropdownVisible(true);
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
  } finally {
    setLoading(false); 
  }
}, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue]);




  const [activeIndex, setActiveIndex] = useState(-1);

const handleKeyDown = async (event) => {
  if (event.key === 'Enter') {
    if (activeIndex >= 0 && searchResults.length > 0) {
      handleResultClick(searchResults[activeIndex]);
    } else {
      onClick(searchValue);
      setIsDropdownVisible(false);
    }
  } else if (event.key === 'Escape') {
    clearSearch();
  } else if (event.key === 'ArrowDown') {
    setActiveIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
  } else if (event.key === 'ArrowUp') {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }
}; 

  const onclick_ = () => {
    onClick(searchValue);
  };

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
    setIsDropdownVisible(false);
  };

  const handleResultClick = (result) => {
    navigate(`/product-details/${result.id}`);
    clearSearch();
  };

  return (
      <div className="relative" ref={wrapperRef}>

      <div
        className={`border rounded-2xl w-full max-w-xl h-[36px] flex items-center gap-4 p-2 bg-[#F0F0F0] ${className}`}
      >
        <img
          src={img}
          alt="search_btn"
          className="w-5 h-5 cursor-pointer"
          onClick={() => {
            onclick_();
            handleDropdownToggle();
          }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-[20px] rounded-md bg-[#F0F0F0] outline-none"
        />
        <button
          onClick={clearSearch}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          x
        </button>
      </div>
      {loading && (
        <div className="absolute top-full mt-1 w-full max-w-xl bg-white border rounded-md shadow-lg flex justify-center items-center p-4">
          <Loader />
        </div>
      )}
      {isDropdownVisible && !loading && (
        <div className="absolute top-full mt-1 w-full max-w-xl bg-white border rounded-md shadow-lg">

          <ul className="list-none p-2">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <li
  key={index}
  className={`p-2 hover:bg-gray-200 cursor-pointer ${
    index === activeIndex ? 'bg-gray-200' : ''
  }`}
  onClick={() => handleResultClick(result)}
>

                  <div className="flex items-center gap-2">
                    <img
                      src={
                        result.item[0]?.image_link?.link
                          ? result.item[0].image_link.link
                          : PlaceHolderImage
                      }
                      alt="search_result"
                      className="w-10 h-10 rounded-md"
                    />
                    {result.item[0].name}
                    <span className="text-sm text-gray-500">
                      {result.item.current_price}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  img: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Search;
