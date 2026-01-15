import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';


const Avatar = ({ imageUrl, username, otherStyles }) => {
  return (
    <>
      <div>
        {imageUrl ? (
          <img
            className="flex h-[150px] w-[150px] rounded-full"
            src={imageUrl}
            alt="avatar"
          />
        ) : (
          <div
            className={`flex items-center justify-center h-[150px] w-[150px] bg-[#9F3247] text-white font-bold text-[3rem] rounded-full ${otherStyles}`}
          >
            {username && username[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="absolute cursor-pointer flex items-center justify-center top-0 left-0 w-full h-full bg-gray-50 opacity-0 transition-opacity rounded-full group-hover:opacity-50">
        <Plus size={40} />
      </div>
    </>
  );
};

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  username: PropTypes.string,
  otherStyles: PropTypes.string,
};

export default Avatar;