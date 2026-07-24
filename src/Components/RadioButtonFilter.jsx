import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaEraser, FaAngleUp, FaAngleDown } from 'react-icons/fa';

const RadioButtonFilter = ({ label, options, func, clear }) => {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (clear) {
      setSelected(null);
      func && func(null);
    }
  }, [clear, func]);

  return (
    <div className="flex flex-col p-3 mb-3 border-b border-[#9f324877] w-full">
      <div
        className={`flex justify-between items-center ${open && !selected && 'mb-3'}`}
      >
        <h3 className="font-semibold text-[#9f3248] text-lg">{label}</h3>

        <div className="flex gap-2 items-center">
          {/* Clear Button */}
          <div
            onClick={() => {
              setSelected(null);
              func && func(null);
            }}
            className="cursor-pointer relative group"
          >
            <FaEraser size={16} className="text-[#9f3248]" />
            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block z-50">
              Clear Filter
            </span>
          </div>

          {/* Toggle Button */}
          <div onClick={toggle} className="cursor-pointer relative group">
            {open ? (
              <FaAngleUp size={18} className="text-[#9f3248]" />
            ) : (
              <FaAngleDown size={18} className="text-[#9f3248]" />
            )}
            <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block z-50">
              {open ? 'Hide Selections' : 'View Selections'}
            </span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="mb-1 text-[#9f3248]">
          <span className="font-medium text-[10px] mr-2">SELECTED:</span>
          <span className="text-[10px] font-medium">{String(selected)}</span>
        </div>
      )}
      {open && (
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="inline-flex text-[#9f3248] items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={selected === option.value}
                className="hidden peer"
                onChange={() => {
                  setSelected(option.value);
                  func && func(option.value);
                }}
              />
              <div className="w-3 h-3 rounded-full border border-[#9f3248] peer-checked:[#9f3248] peer-checked:ring-2 peer-checked:ring-[#9f3248]"></div>
              <span className="text-xs">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

RadioButtonFilter.propTypes = {
  label: PropTypes.string.isRequired,
  func: PropTypes.func,
  clear: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ).isRequired,
};

export default RadioButtonFilter;
