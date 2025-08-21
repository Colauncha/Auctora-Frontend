import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { current } from '../utils';
import Loader from '../assets/loader2';
import { PlaceHolderImage } from '../Constants';

const Search = ({ className, onClick, img, placeholder, setParent }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      onClick(searchValue);
      setLoading(true);
      try {
        const response = await fetch(
          `${current}landing/search?q=${encodeURIComponent(searchValue)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.data || []);
          setIsDropdownVisible(true);
        } else {
          console.error('Error fetching search results:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    } else if (event.key === 'Escape') {
      clearSearch();
    }
  };

  const onclick_ = () => {
    onClick(searchValue);
  };

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearchResults([]);
    setIsDropdownVisible(false);
  };

  const handleResultClick = (result) => {
    navigate(`/product-details/${result.id}`); // Adjust the navigation path as needed
    clearSearch();
  };

  return (
    <div className="relative">
      <div
        className={`border-[1px] rounded-2xl w-[700px] h-[36px] flex items-center gap-4 p-2 bg-[#F0F0F0] ${className}`}
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
          onChange={(e) => {
            setSearchValue(e.target.value);
            setParent(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="w-full h-[20px] rounded-md bg-[#F0F0F0] outline-none"
        />
        <button
          onClick={clearSearch}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
      {loading && (
        <div className="absolute top-full mt-1 w-[700px] bg-white border-[1px] rounded-md shadow-lg flex justify-center items-center p-4">
          <Loader />
        </div>
      )}
      {isDropdownVisible && !loading && (
        <div className="absolute top-full mt-1 w-[700px] bg-white border-[1px] rounded-md shadow-lg">
          <ul className="list-none p-2">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
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
  setParent: PropTypes.func,
};

export default Search;
