import React from 'react';
import './Loader.css';

const Loader = ({ fullPage = false }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="dot-fading">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loader;
