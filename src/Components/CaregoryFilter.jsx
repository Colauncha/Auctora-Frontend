import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEraser, FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { current } from '../utils';

const CategoryFilter = ({ label, func, clear }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [categories, setCategories] = useState([]);

  const toggle = () => setOpen((prev) => !prev);

  // Fetch categories on mount
  useEffect(() => {
    fetch(`${current}categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Clear selected values when 'clear' is true
  useEffect(() => {
    if (clear) {
      setSelected({});
      func && func({});
    }
  }, [clear, func]);

  // Toggle checkbox selection
  const handleToggle = (catId, subId = null) => {
    setSelected(() => {
      const newSelected = {};

      if (subId) {
        // Select only this subcategory
        newSelected[catId] = new Set([subId]);
      } else {
        // Select only this category
        newSelected[catId] = new Set(); // Empty set = entire category
      }

      // Call parent function
      func && func(newSelected);
      console.log(newSelected);
      return newSelected;
    });
  };

  return (
    <div className="flex flex-col p-4 mb-5 bg-gray-50 rounded-md shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-[#9f3248] text-lg">{label}</h3>

        {/* Clear Button */}
        <div
          onClick={() => {
            setSelected({});
            func && func({});
          }}
          className="cursor-pointer relative group"
        >
          <FaEraser size={16} className="text-[#9f3248]" />
          <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
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
          <span className="absolute left-0 bottom-full mb-1 hidden w-max bg-gray-700 text-white text-xs rounded py-1 px-2 group-hover:block">
            {open ? 'Hide Selections' : 'View Selections'}
          </span>
        </div>
      </div>

      {/* Selected Tags */}
      {Object.keys(selected).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(selected).map(([catId, subSet]) => {
            const category = categories.find((cat) => cat.id === catId);
            const categoryName = category?.name || 'Unknown';

            if (!subSet || subSet.size === 0) {
              return (
                <span
                  key={catId}
                  className="flex items-center bg-[#9f3248] text-white text-sm px-3 py-1 rounded-full cursor-pointer"
                  onClick={() => {
                    setSelected({});
                    func && func({});
                  }}
                >
                  {categoryName} ✕
                </span>
              );
            }

            return Array.from(subSet).map((subId) => {
              const sub = category?.subcategories?.find((s) => s.id === subId);
              const subName = sub?.name || 'Sub';

              return (
                <span
                  key={`${catId}-${subId}`}
                  className="flex items-center bg-[#9f3248] text-white text-sm px-3 py-1 rounded-full cursor-pointer"
                  onClick={() => handleToggle(catId, subId)}
                >
                  {subName} ✕
                </span>
              );
            });
          })}
        </div>
      )}

      {/* View and Selections */}
      {open && (
        <div className="overflow-y-auto max-h-[400px] pr-2">
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories available.</p>
          ) : (
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat.id} className="border-b pb-2">
                  <label className="flex items-center gap-2 font-medium text-sm">
                    <input
                      type="checkbox"
                      checked={selected[cat.id] !== undefined}
                      onChange={() => handleToggle(cat.id)}
                      className="accent-[#9f3248]"
                    />
                    {cat.name}
                  </label>

                  {/* Subcategories */}
                  {/* {cat.subcategories?.length > 0 && (
                    <ul className="pl-5 mt-1 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <label className="flex items-center gap-2 text-xs text-gray-700">
                            <input
                              type="checkbox"
                              checked={selected[cat.id]?.has(sub.id)}
                              onChange={() => handleToggle(cat.id, sub.id)}
                              className="accent-[#9f3248]"
                            />
                            {sub.name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )} */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

CategoryFilter.propTypes = {
  label: PropTypes.string.isRequired,
  func: PropTypes.func,
  clear: PropTypes.bool,
};

export default CategoryFilter;
