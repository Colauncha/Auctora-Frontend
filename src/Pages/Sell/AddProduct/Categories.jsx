import { useState, useEffect } from "react";
import { PropTypes } from 'prop-types';
import arrowright from "../../../assets/svg/arrow-right.svg";
import x from "../../../assets/svg/x.svg";
import { current } from "../../../utils";

const Categories = ({ handleStepChange, activeStep }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let endpoint = `${current}categories`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data)
      })
      .catch((error) => console.error("Error fetching categories: ", error));
  }, []);


  const handleCheckboxChange = (item) => {
    console.log(item);
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(item)) {
        // Uncheck the checkbox
        setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
        return prevSelected.filter((category) => category.name !== item.name);
      } else {
        if (prevSelected.length >= 1) {
          alert("You can only select up to 1 categories.");
          return prevSelected;
        }
        // Check the checkbox
        setCheckedItems((prev) => ({ ...prev, [item.name]: true }));
        return [...prevSelected, item];
      }
    });
  };

  const handleRemoveCategory = (item) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.filter((category) => category.name !== item.name)
    );
    // Uncheck the checkbox when removing the category
    setCheckedItems((prev) => ({ ...prev, [item.name]: false }));
  };

  const submit = async () => {
    const endpoint = `${current}auctions/`;
    let data = JSON.parse(sessionStorage.getItem("product"));
    data.item.category_id = selectedCategories[0].category_id;
    data.item.sub_category_id = selectedCategories[0].id;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Product submitted successfully: ", data);
        sessionStorage.setItem("product", JSON.stringify(data));
        return true;
      } else {
        const errorData = await response.json();
        console.error("Error submitting product: ", errorData);
        return false;
      }
    } catch (error) {
      console.error("Error submitting product: ", error);
    }
  };

  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="formatter format">
        <div className="bg-white rounded-lg py-6 px-10 mb-20 mt-4">
          {/* Header */}
          <h2 className="w-full font-bold mb-6">
            Select the category your goods belong to
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
              {categories.map((category, index) => (
                <div key={index} className="mb-4">
                  <p
                    className={`text-[16px] text-black ${
                      index > 0 ? "mt-8" : ""
                    } mb-2 font-bold`}
                  >
                    {category.name}
                  </p>
                  {category.subcategories.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-row gap-4 py-1 items-center"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 border rounded-full border-gray-200 accent-maroon"
                        checked={checkedItems[item.name] || false}
                        onChange={() => handleCheckboxChange({...item, category_id: category.id})}
                      />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Third Column */}
            {/* <div className="w-[800px] h-[460px] bg-white p-5">
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
                        checked={checkedItems[item.name] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div> */}

            {/* Fourth Column */}
            {/* <div className="w-[800px] h-[460px] bg-white p-5">
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
                        checked={checkedItems[item.name] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div> */}

            {/* Fifth Column */}
            {/* <div className="w-[950px] h-[460px] bg-white p-5">
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
                        checked={checkedItems[item.name] || false}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div> */}
          </section>

          
          <p className="font-bold mb-6 mt-[-10px]">
            Selected categories:{" "}
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 m-1"
              >
                {category.name}
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
            onClick={async () => {
              await submit() ? 
              handleStepChange(activeStep + 1) : () => {};
            }}
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

Categories.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default Categories;