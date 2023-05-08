import React, { useState } from 'react';
import './Range_slider.css';

const RangeSlider = ({ name, value, onChildClick }) => {

  const handleChange = (event) => {
    let newValue = event.target.value;
    newValue=parseInt(newValue);
    if (newValue > 100) {
      newValue = 100;
    } else if (newValue < 0) {
      newValue = 0;
    }
    onChildClick(name, newValue);
  };

  const handleIncrease = () => {
    const prevValue = value;
    const newValue = prevValue >= 100 ? 100 : prevValue + 1;
    onChildClick(name,newValue);
  };

  const handleDecrease = () => {
    const prevValue = value;
    const newValue = prevValue <= 0 ? 0 : prevValue - 1;
    onChildClick(name,newValue);
  };

  const handleBlur = (event) => {
    const newValue = parseInt(event.target.value);
    onChildClick(name, isNaN(newValue) ? 0 : newValue);
  };

  return (
    <div className="range-slider">
      <div className="range-slider-value">
        <input
          name="compression_quality" 
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        %
      </div>
      <div className="range-slider-bar">
        <div className="range-slider-fill" style={{ width: `${value}%` }} />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="range-slider-buttons">
        <button onClick={handleDecrease}>-</button>
        <button onClick={handleIncrease}>+</button>
      </div>
    </div>
  );
}

export default RangeSlider;

