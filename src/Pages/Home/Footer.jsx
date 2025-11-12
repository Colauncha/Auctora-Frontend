import { Link, useLocation } from 'react-router-dom';
import Cta from './Cta';
import { ctaContext } from '../../Store/ContextStore';
import { facebook, linkedin, instaggram, logo, twitter } from '../../Constants';
import { Phone, Mail } from 'lucide-react';

const footerArr = [
  {
    heading: 'Company',
    links: [
      { name: 'About', url: '/about-us' },
      { name: 'Features', url: '/features' },
      { name: 'Works', url: '/construction/works' },
      { name: 'Career', url: '/construction/career' },
      { name: 'Blog', url: '/blog' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { name: 'Customer Support', url: '/contact-us' },
      { name: 'Delivery Details', url: '/construction/delivery-details' },
      { name: 'Terms & Conditions', url: '/terms-conditions' },
      { name: 'Privacy Policy', url: '/privacy-policy' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { name: 'Account', url: '/construction/account' },
      { name: 'Manage Deliveries', url: '/construction/delivery' },
      { name: 'Orders', url: '/construction/orders' },
      { name: 'Payments', url: '/construction/payments' },
      
    ],
  },
];

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;
  const useCta = ctaContext((state) => state.useCta);

  if (path.startsWith('/admin')) return null;

  return (
    <div
      className={`bg-gradient-to-b from-gray-50 to-gray-100 w-full ${
        useCta ? 'pt-32' : 'pt-6 border-t-2'
      } pb-8 relative`}
    >
      {/* CTA Section */}
      <div className="absolute top-[-40px] left-0 w-full flex justify-center px-6 z-100">
        <div className="container mx-auto">
          <Cta className="shadow-xl rounded-xl" />
        </div>
      </div>

      {/* Footer code */}
      <footer
        className={`container mx-auto px-6 sm:px-8 lg:px-12 mt-20 lg:${
          useCta ? 'mt-10' : 'mt-4'
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between gap-16 w-full">
          {/* Left Section  */}
          <div className="flex flex-col gap-6 max-w-md">
            <img src={logo} alt="Biddius Logo" className="w-48 h-auto" />
            <div className="space-y-3">
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Join online auctions and find unique items to buy and sell with
                excitement! Discover amazing deals and rare collectibles in our
                vibrant marketplace.
              </p>

              <div className="text-gray-600 text-xs md:text-sm leading-relaxed">
                <div className="flex">
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 whitespace-nowrap">
                      Connect with us:
                    </span>
                  </div>
                  <div className="flex flex-col ml-2 space-y-4">
                    <span>
                      <a
                        href="tel:+2347084274918"
                        className="underline text-maroon hover:text-red transition-colors ml-2"
                      >
                        <Phone className="inline-block mr-2" size={14} />
                        +234 708 427 8194
                      </a>
                    </span>
                    <span>
                      <a
                        href="mailto:Info@biddius.com"
                        className="underline text-maroon hover:text-red transition-colors ml-2"
                      >
                        <Mail className="inline-block mr-2" size={14} />
                        Info@biddius.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://web.facebook.com/profile.php?id=61575947565346"
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <img src={facebook} alt="Facebook" className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/biddius"
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <img src={twitter} alt="Twitter" className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/biddius_/"
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <img src={instaggram} alt="Instagram" className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/biddius"
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
              >
                <img src={linkedin} alt="GitHub" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 flex-1 lg:pl-16">
            {footerArr.map((section, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-bold mb-6 text-gray-800 relative after:absolute after:left-0 after:bottom-[-8px] after:w-10 after:h-[2px] after:bg-[#9F3247]">
                  {section.heading}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.url}
                        className="text-gray-600 hover:text-[#9F3247] transition-colors text-sm sm:text-base flex items-center group"
                      >
                        <span className="w-1 h-1 bg-[#9F3247] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-center text-xs md:text-sm">
              © {new Date().getFullYear()} Biddius (A Part of Colauncha). All
              rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/terms-conditions"
                className="text-gray-500 hover:text-[#9F3247] text-xs md:text-sm transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-500 hover:text-[#9F3247] text-xs md:text-sm transition-colors"
              >
                Privacy Policy
              </Link>

              {/* <Link to="/cookies" className="text-gray-500 hover:text-[#9F3247] text-xs md:text-sm transition-colors">
                Cookie Policy
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
