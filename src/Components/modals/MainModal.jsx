// import PropTypes from 'prop-types';
// import style from './css/MainModal.module.css';
// import { FaTimes } from 'react-icons/fa';

// const MainModal = ({ header, close, children }) => {
//   const closeModal = () => {
//     close();
//   };
//   return (
//     <div className={style.bg}>
//       <div className={style.container}>
//         <div className={style.header}>
//           <h2>{header}</h2>
//           <span onClick={closeModal}>
//             <FaTimes size={15} color={'#7d2435'} />
//           </span>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// MainModal.propTypes = {
//   header: PropTypes.string.isRequired,
//   close: PropTypes.func.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default MainModal;

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './css/MainModal.module.css';
import { X } from 'lucide-react';

const MainModal = ({ header, close, children }) => {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      className={style.overlay}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={style.modal}>
        {/* Header */}
        <div className={style.header}>
          <h2 className={style.title}>{header}</h2>

          <button
            onClick={close}
            aria-label="Close modal"
            className={style.closeBtn}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className={style.content}>{children}</div>
      </div>
    </div>
  );
};

MainModal.propTypes = {
  header: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default MainModal;
