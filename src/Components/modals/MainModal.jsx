import PropTypes from 'prop-types';
import style from './css/MainModal.module.css';
import { FaTimes } from 'react-icons/fa';

const MainModal = ({ header, close, children }) => {
  const closeModal = () => {
    close();
  };
  return (
    <div className={style.bg}>
      <div className={style.container}>
        <div className={style.header}>
          <h2>{header}</h2>
          <span onClick={closeModal}>
            <FaTimes size={15} color={'#7d2435'} />
          </span>
        </div>
        {children}
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
