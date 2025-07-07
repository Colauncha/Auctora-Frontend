import style from './css/loaderWhite.module.css';
import PropTypes from 'prop-types';

const Loader = ({ otherStyles }) => {
  return <div className={`${style.loader} ${otherStyles}`} />;
};

Loader.propTypes = {
  otherStyles: PropTypes.string,
};

export default Loader;
