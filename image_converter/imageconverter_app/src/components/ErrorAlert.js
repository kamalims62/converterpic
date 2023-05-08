import React, { useState, useEffect } from 'react';
import './ErrorAlert.css';

function ErrorAlert({ text, onClose, autoDismissTime = null }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let timeoutId;

    if (autoDismissTime) {
      timeoutId = setTimeout(() => {
        setShow(false);
        onClose();
      }, autoDismissTime);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [autoDismissTime, onClose]);

  function handleClose() {
    setShow(false);
    onClose();
  }

  return show ? (
    <div className="error-alert">
      <p>{text}</p>
      <button style={{ height: '20px', width: '40px', fontSize: '10px', padding: '5px' }} onClick={handleClose}>Close</button>
    </div>
  ) : null;
}

export default ErrorAlert;
