
import { Link, useLocation } from "react-router-dom";
import Cta from "./Cta";
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
      {/* CTA Section (positioned absolutely above footer) */}
      <div className="absolute top-[-100px] left-0 w-full flex justify-center px-4">
        <Cta />
      </div>

      {/* Main Footer Content */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col text-[#9F3247] pt-[100px]">
        <div className="flex flex-col lg:flex-row gap-12 w-full">
          {/* Logo and Description Section */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <img 
              src={logo} 
              alt="Auctora Logo" 
              className="w-40 h-12 sm:w-52 sm:h-16 lg:w-56 lg:h-20" 
            />
            <p className="text-sm sm:text-base">
              Join online auctions and find unique items to buy and sell with excitement!
            </p>
            <div className="flex gap-4">
              <img src={facebook} alt="Facebook" className="w-6 h-6" />
              <img src={twitter} alt="Twitter" className="w-6 h-6" />
              <img src={instaggram} alt="Instagram" className="w-6 h-6" />
              <img src={github} alt="GitHub" className="w-6 h-6" />
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {footerArr.map((section, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-bold mb-4">{section.heading}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.url}
                        className="text-[#9f3247] hover:underline underline-offset-2 text-sm sm:text-base"
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

        {/* Copyright Section */}
        <div className="mt-12 mb-6 border-t border-[#9F3247] border-opacity-20 pt-6 text-center text-sm sm:text-base">
          Auctora © 2024, All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Footer;