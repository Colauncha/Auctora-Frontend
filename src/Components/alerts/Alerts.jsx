import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './css/Alerts.module.css';
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import { charLimit } from '../../utils';

const TIME = 10000;

const iconMap = {
  success: <FaCheckCircle size={20} color="#ffffff" />,
  fail: <FaTimesCircle size={20} color="#ffffff" />,
  warn: <FaExclamationTriangle size={20} color="#ffffff" />,
};

function Alerts({ message, detail, type }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), TIME);
    return () => clearTimeout(timeout);
  }, []);

  const alertClass =
    {
      success: style.alertSuccess,
      fail: style.alertFail,
      warn: style.alertWarn,
    }[type] || style.alertWarn;

  const barClass =
    {
      success: style.alertSuccessBar,
      fail: style.alertFailBar,
      warn: style.alertWarnBar,
    }[type] || style.alertWarnBar;

  return (
    <div className={`${style.container} ${!visible ? style.hide : ''}`}>
      <div className={`${alertClass} ${style.main}`}>
        <div className={style.iconTitle}>
          {iconMap[type] || iconMap.warn}
          {message}
        </div>
        <p>{detail?.length === 0 ? '' : charLimit(detail, 80)}</p>
        <span className={`${style.bar} ${barClass}`} />
      </div>
    </div>
  );
}

Alerts.propTypes = {
  message: PropTypes.string.isRequired,
  detail: PropTypes.string,
  type: PropTypes.oneOf(['success', 'fail', 'warn']).isRequired,
};

export default Alerts;
