import React, { useState } from 'react';
import './styles.css';

function Tooltip({ instructions }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <span className="tooltip-container">
      <span className="tooltip-label" onClick={handleClick}>
        <span className="tooltip-label-text">Instructions</span>
        <span className="tooltip-arrow"></span>
      </span>
      {isVisible && (
        <div className="tooltip-text">
          {instructions.split('\\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}
    </span>
  );
}

export default Tooltip;
