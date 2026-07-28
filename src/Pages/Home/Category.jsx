// import { NavLink } from "react-router-dom";
import CategoryCard from '../../Components/CategoryCard';
import useModeStore from '../../Store/Store';
import {
  headphone,
  smartwatch,
  cellphone,
  computer,
  gamepad,
  camera,
  dcamera,
  dcomputer,
  dgaming,
  dheadphone,
  dphone,
  dsmartwatch,
} from '../../Constants';

const Category = () => {
  const { isMobile } = useModeStore();
  const CategoryItemArr = [
    {
      _id: 1,
      icon: isMobile ? headphone : dheadphone,
      title: 'headPhones',
      to: '/Ongoing-Auction',
      catId: 'CAT001',
      subCatId: 'SUBCAT0004',
    },
    {
      _id: 2,
      icon: isMobile ? gamepad : dgaming,
      title: 'gaming',
      to: '/Ongoing-Auction',
      catId: 'CAT004',
      subCatId: null,
    },
    {
      _id: 3,
      icon: isMobile ? computer : dcomputer,
      title: 'computers',
      to: '/Ongoing-Auction',
      catId: 'CAT002',
      subCatId: null,
    },
    {
      _id: 4,
      icon: isMobile ? cellphone : dphone,
      title: 'phones',
      to: '/Ongoing-Auction',
      catId: 'CAT001',
      subCatId: 'SUBCAT0001',
    },
    {
      _id: 5,
      icon: isMobile ? camera : dcamera,
      title: 'cameras',
      to: '/Ongoing-Auction',
      catId: 'CAT008',
      subCatId: null,
    },
    {
      _id: 6,
      icon: isMobile ? smartwatch : dsmartwatch, //
      title: 'appliances',
      to: '/Ongoing-Auction',
      catId: 'CAT001',
      subCatId: 'SUBCAT0004',
    },
  ];

  const forgeQuery = (item) => {
    let query = [];
    if (item.catId) {
      query.push(`?category_id=${item.catId}`);
    }
    if (item.subCatId) {
      query.push(`sub_category_id=${item.subCatId}`);
    }
    return query.join('&');
  };

  return (
    <div className="formatter">
      <div className="border-t-[1px] py-6 flex flex-col justify-center items-center mb-32">
        {/* Heading */}
        <h2 className="uppercase text-[24px] md:text-[32px] text-[#9f3247] font-[800]">
          Browse by Categories
        </h2>

        {/* Grid Layout for Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 lg:gap-10 mt-10 px-4">
          {CategoryItemArr.map((item) => (
            <CategoryCard
              key={item._id}
              icon={item.icon}
              title={item.title}
              className="cursor-pointer hover:border-[1px] hover:bg-[#9f324826]"
              to={item.to}
              params={{
                cat: item.catId,
                subCat: item.subCatId,
                query: forgeQuery(item),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
