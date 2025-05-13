import { FaLinkedin, FaTwitter } from "react-icons/fa";

const TeamCard = ({ name, role, image, linkedin, twitter }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#EEE]">
      {/* Image Container */}
      <div className="relative pt-[100%] bg-gray-100">
        <img 
  src={image}
  alt={name}
  className="absolute top-0 left-0 w-full h-full object-cover object-center"
  onError={(e) => {
    e.target.src = placeholder; 
    e.target.onerror = null;
  }}
/>
      </div>
      
      {/* Text + Social Links */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-[#7B2334]">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{role}</p>
        
        {(linkedin || twitter) && (
          <div className="flex justify-center space-x-4 mt-3">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0077b5] hover:text-[#005582] hover:scale-110 transition-transform"
                aria-label={`${name}'s LinkedIn`}
              >
                <FaLinkedin className="text-xl" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black hover:scale-110 transition-transform"
                aria-label={`${name}'s Twitter`}
              >
                <FaTwitter className="text-xl" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;