import { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleRight, FaAngleUp, FaEraser } from 'react-icons/fa';
import { currencyFormat } from '../utils';
import PropTypes from 'prop-types';

const MAX = 500000;
const MIN = 0;

// PriceRange component
const PriceRange = ({ label, func, clear }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([MIN, MAX]);

  // Toggles the visibility of the price range slider
  const toggle = () => {
    setOpen((prev) => !prev);
  };

  // Clears the values when the clear prop is true
  useEffect(() => {
    if (clear) {
      setValues([MIN, MAX]);
      func && func([]);
    }
  }, [clear, func]);

  return (
    <div
      className={`flex flex-col p-4 mb-5 bg-gray-50 rounded-md shadow-md lg:w-full`}
    >
      {/* Header with toggle */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-[#9f3248]">{label}</h3>
        <div
          className="cursor-pointer relative group"
          onClick={() => {
            setValues([MIN, MAX]);
            func && func([]);
          }}
        >
          <FaEraser size={14} color="#9f3248" />
          <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
            Clear Filter
          </span>
        </div>
        <div className="cursor-pointer relative group" onClick={toggle}>
          {open ? (
            <FaAngleUp size={16} color="#9f3248" />
          ) : (
            <FaAngleDown size={16} color="#9f3248" />
          )}
          <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
            Select Range
          </span>
        </div>
      </div>

      {/* Slider Section */}
      {open && (
        <>
          {/* Display selected range */}
          <small className="text-[#9f3248] flex items-center justify-center mb-2">
            <FaAngleRight className="mr-2" />
            <input
              type="number"
              value={values[0]}
              onChange={(e) => {
                setValues([Number(e.target.value), values[1]]);
                if (func) {
                  func([Number(e.target.value), values[1]]);
                }
              }}
              className="hidden"
            />
            <input
              type="number"
              value={values[1]}
              onChange={(e) => {
                setValues([values[0], Number(e.target.value)]);
                if (func) {
                  func([values[0], Number(e.target.value)]);
                }
              }}
              className="hidden"
            />
            {currencyFormat(values[0])} - {currencyFormat(values[1])}
          </small>

          {/* Slider component */}
          <div className="mt-4">
            <input
              type="range"
              min={MIN}
              max={values[1]}
              step={50}
              value={values[0]}
              onChange={(e) => {
                setValues([Number(e.target.value), values[1]]);
                if (func) {
                  func([Number(e.target.value), values[1]]);
                }
              }}
              className="w-full h-2 bg-[#9f3248] rounded-lg cursor-pointer accent-[#9f3248]"
            />
            <input
              type="range"
              min={values[0]}
              max={MAX}
              step={50}
              value={values[1]}
              onChange={(e) => {
                setValues([values[0], Number(e.target.value)]);
                if (func) {
                  func([values[0], Number(e.target.value)]);
                }
              }}
              className="w-full h-2 bg-[#9f3248] rounded-lg cursor-pointer accent-[#9f3248]"
            />
          </div>
        </>
      )}
    </div>
  );
};

PriceRange.propTypes = {
  label: PropTypes.string,
  func: PropTypes.func,
  clear: PropTypes.bool,
};
PriceRange.defaultProps = {
  label: 'Price',
};
export default PriceRange;
