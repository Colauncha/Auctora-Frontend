import { Link, useLocation } from "react-router-dom";
import Cta from "./Cta"; // Import the Cta component
import { facebook, github, instaggram, logo, twitter } from "../../Constants";
import { useEffect } from "react";

const footerArr = [
  {
    heading: "Company",
    links: [
      { name: "About", url: "/about" },
      { name: "Features", url: "/features" },
      { name: "Works", url: "/works" },
      { name: "Career", url: "/career" },
    ],
  },
  {
    heading: "Help",
    links: [
      { name: "Customer Support", url: "/customer-support" },
      { name: "Delivery Details", url: "/delivery-details" },
      { name: "Terms & Conditions", url: "/terms" },
      { name: "Privacy Policy", url: "/privacy" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { name: "Account", url: "/account" },
      { name: "Manage Deliveries", url: "/delivery" },
      { name: "Orders", url: "/orders" },
      { name: "Payments", url: "/payments" },
    ],
  },
];

const Footer = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-[#F0F0F0] w-full pt-20 relative">
      <div className="absolute top-[-100px] left-0 w-full flex justify-center">
        <Cta />
      </div>
      <footer className="formatter flex flex-col text-[#9F3247] pt-[100px]"> {/* Adjust padding-top */}
        <div className="flex flex-col mt-16 gap-12 md:flex-row">
          <div className="flex flex-col w-full gap-10 md:w-[800px] mb-6 md:mb-0">
            <img src={logo} alt="Auctora Logo" className="w-52 h-16 lg:w-56 lg:h-20" />
            <p>
              Join online auctions and find unique items to buy and sell with excitement!
            </p>
            <div className="flex gap-3 mt-4">
              <img src={facebook} alt="Facebook" />
              <img src={twitter} alt="Twitter" />
              <img src={instaggram} alt="Instagram" />
              <img src={github} alt="GitHub" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:w-full flex-1 mt-4 md:mt-0">
            <div className="flex flex-col lg:flex-row justify-around flex-1">
              {footerArr.map((section, index) => (
                <div key={index} className="mb-2 md:mb-0">
                  <h4 className="text-lg font-bold mb-3">{section.heading}</h4>
                  <ul className="flex flex-1 flex-col gap-1">
                    {section.links.map((link, idx) => (
                      <li key={idx}>
                        <Link
                          to={link.url}
                          className="text-[#9f3247] hover:underline underline-offset-2"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 mb-6 border-t-[1px] pt-4 text-center md:text-center">
          Auctora © 2024, All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Footer;
