import React, { useState } from "react";
import arrowright from "../../../assets/svg/arrow-right.svg";
import x from "../../../assets/svg/x.svg";

const Categories = ({ handleStepChange, activeStep }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (item) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(item)) {
        // Uncheck the checkbox
        setCheckedItems((prev) => ({ ...prev, [item]: false }));
        return prevSelected.filter((category) => category !== item);
      } else {
        if (prevSelected.length >= 3) {
          alert("You can only select up to 3 categories.");
          return prevSelected;
        }
        // Check the checkbox
        setCheckedItems((prev) => ({ ...prev, [item]: true }));
        return [...prevSelected, item];
      }
    });
  };

  const handleRemoveCategory = (item) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((category) => category !== item)
    );
    // Uncheck the checkbox when removing the category
    setCheckedItems((prev) => ({ ...prev, [item]: false }));
  };

  const categoriesPhone = [
    {
      title: "Phones and Accessories",
      items: [
        "Smartphones",
        "Smartwatches",
        "Tablet",
        "Accessories GSM",
        "Cases and covers",
      ],
    },
    {
      title: "Minor Appliances",
      items: [
        "Kitchen, Cooking",
        "Hygiene and care",
        "For Home",
        "Vacuum cleaners",
      ],
    },
  ];

  const categoriesComputer = [
    {
      title: "Computers",
      items: [
        "Laptops",
        "Laptop components",
        "Desktop computers",
        "Computer component",
        "Printers and scanners",
      ],
    },
    {
      title: "Appliances",
      items: [
        "Fridge",
        "Washing Machine",
        "Cloth dryers",
        "Free-standing kitchens",
      ],
    },
  ];

  const categoriesTV = [
    {
      title: "TVs and Accessories",
      items: [
        "TVs",
        "Projectors",
        "Headphones",
        "Audio for Home",
        "Home cinema",
      ],
    },
    {
      title: "Built-in Appliances",
      items: ["HotPlates", "Built-in ovens", "Built-in dishwashers", "Hoods"],
    },
  ];

  const categoriesConsoles = [
    {
      title: "Consoles and Slot machines",
      items: [
        "Consoles PlayStation 5",
        "Consoles Xbox Series X/S",
        "Consoles PlayStation 4",
        "Consoles Xbox One",
        "Consoles Nintendo Switch",
      ],
    },
    {
      title: "Photography",
      items: [
        "Digital cameras",
        "Lenses",
        "Photo Accessories",
        "Instant cameras (Instax, Polaroid)",
      ],
    },
  ];

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter format">
        <div className="bg-white rounded-lg py-6 px-10 mb-20 mt-4">
          {/* Header */}
          <h2 className="w-full font-bold mb-6">
            Select the category your goods belong to (max. 3)
          </h2>

          {/* Categories Section */}
          <section className="flex flex-nowrap justify-between items-start content-start w-full h-[80vh] overflow-y-hidden overflow-x-auto gap-3 format">
            {/* First Column */}
            <div className="w-[750px] h-[460px] bg-white py-7 px-6">
              {[
                "Electronics",
                "Fashion",
                "Home and Garden",
                "Supermarket",
                "Beauty",
                "Culture",
                "Sports and tourism",
                "Automotive",
                "Properties",
              ].map((category, index) => (
                <div key={index} className="flex flex-row items-center mb-5">
                  <p className="text-[16px] text-black w-[190px]">{category}</p>
                  <img src={arrowright} alt="" className="w-3 h-3" />
                </div>
              ))}
            </div>

            {/* Second Column */}
            <div className="w-[750px] h-[460px] bg-white p-5">
              {categoriesPhone.map((category, index) => (
                <div key={index} className="mb-4">
                  <p
                    className={`text-[16px] text-black ${
                      index > 0 ? "mt-8" : ""
                    } mb-2 font-bold`}
                  >
                    {category.title}
                  </p>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-row gap-4 py-1 items-center"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 border rounded-full border-gray-200 accent-maroon"
                        checked={checkedItems[item] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Third Column */}
            <div className="w-[800px] h-[460px] bg-white p-5">
              {categoriesComputer.map((category, index) => (
                <div key={index} className="mb-4">
                  <p
                    className={`text-[16px] text-black ${
                      index > 0 ? "mt-8" : ""
                    } mb-2 font-bold`}
                  >
                    {category.title}
                  </p>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-row gap-4 py-1 items-center"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 border rounded-full border-gray-200 accent-maroon"
                        checked={checkedItems[item] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Fourth Column */}
            <div className="w-[800px] h-[460px] bg-white p-5">
              {categoriesTV.map((category, index) => (
                <div key={index} className="mb-4">
                  <p
                    className={`text-[16px] text-black ${
                      index > 0 ? "mt-8" : ""
                    } mb-2 font-bold`}
                  >
                    {category.title}
                  </p>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-row gap-4 py-1 items-center"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 border rounded-full border-gray-200 accent-maroon"
                        checked={checkedItems[item] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Fifth Column */}
            <div className="w-[950px] h-[460px] bg-white p-5">
              {categoriesConsoles.map((category, index) => (
                <div key={index} className="mb-4">
                  <p
                    className={`text-[16px] text-black ${
                      index > 0 ? "mt-8" : ""
                    } mb-2 font-bold`}
                  >
                    {category.title}
                  </p>
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-row gap-4 py-1 items-center"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 border rounded-full border-gray-200 accent-maroon"
                        checked={checkedItems[item] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          
          <p className="font-bold mb-6 mt-[-10px]">
            Selected categories:{" "}
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 m-1"
              >
                {category}
                <img
                  src={x}
                  alt="Remove"
                  className="w-3 h-3 ml-2 cursor-pointer"
                  onClick={() => handleRemoveCategory(category)}
                />
              </span>
            ))}
          </p>

          
          <button
            onClick={() => handleStepChange(activeStep + 1)}
            type="button"
            className="mt-6 w-40 py-4 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white transition rounded-full focus:outline-none hover:from-maroon hover:to-maroon mx-auto block"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;