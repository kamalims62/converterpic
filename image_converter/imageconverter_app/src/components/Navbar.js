import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar_style.css';
import {Link } from 'react-router-dom';

function App(handleClick) {
  const [showNav, setShowNav] = useState(false);

  const handleNavToggle = () => {
    setShowNav(!showNav);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
            <img className="navbar-brand-image" src='static/images/logo.svg' alt="ImageConverterZone" />
          </Link>
          <Link className='navbar-buttons' to="/" onClick={handleClick}>
          Home
            </Link>
          <Link className='navbar-buttons' to="/about_us" onClick={handleClick}>
          About Us
            </Link>
          {/* <button className={`navbar-toggle ${showNav ? 'active' : ''}`} onClick={handleNavToggle}>
            {showNav ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
          <ul className={`navbar-links ${showNav ? 'active' : ''}`}>
            <li><a href="#">About Us</a></li>
          </ul> */}
        </div>
      </nav>
    </div>
  );
}

export default App;
