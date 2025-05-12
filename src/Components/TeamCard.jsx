import { FaLinkedin, FaTwitter } from "react-icons/fa";

const TeamCard = ({ name, role, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-[#EEE]">
      {/* Team Member Photo */}
      <div className="h-48 md:h-56 bg-gray-100 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top
 rounded-t-lg"
          onError={(e) => {
            e.target.src = "/team/placeholder.jpg"; // Fallback image
          }}
        />
      </div>

      {/* Team Member Info */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-[#7B2334]">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{role}</p>

        {/* Social Links (optional) */}
        <div className="flex justify-center space-x-3">
          <a href="#" className="text-[#9F3247] hover:text-[#7B2334] transition">
            <FaLinkedin className="text-lg" />
          </a>
          <a href="#" className="text-[#9F3247] hover:text-[#7B2334] transition">
            <FaTwitter className="text-lg" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
