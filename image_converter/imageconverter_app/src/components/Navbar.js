import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar_style.css';

function App() {
  const [showNav, setShowNav] = useState(false);

  const handleNavToggle = () => {
    setShowNav(!showNav);
  };

  return (
    <div className="App">
      <nav className="navbar" style={{ background: 'linear-gradient(to right, #0072ff, #00c6ff)' }}>
        <div className="navbar-container container">
          <a href="#" className="navbar-brand">
            Converter
          </a>
          <button className={`navbar-toggle ${showNav ? 'active' : ''}`} onClick={handleNavToggle}>
            {showNav ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
          <ul className={`navbar-links ${showNav ? 'active' : ''}`}>
            <li><a href="#">Image Format Converter</a></li>
            <li><a href="#">Remove Background</a></li>
            <li><a href="#">Change Background</a></li>
            <li><a href="#">Add Effects</a></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default App;
