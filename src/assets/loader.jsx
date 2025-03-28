// import React from 'react';
import style from "./css/loader.module.css";
import PropTypes from "prop-types";

const Loader = ({ extraClass }) => {
  return (
    <>
      <div className={`${style.loader} ${extraClass}`} />
    </>
  );
}

Loader.propTypes = {
  extraClass: PropTypes.string,
};


export default Loader;
