import React from 'react';
import { useState, useRef} from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import './styles.css';
import JSZip from 'jszip';
import Image_to_pdf from "./Image_to_pdf_converter";
import Image_format_converter from "./Image_format_converter";
import Compress_image from "./Compress_image";
import Footer_main from "./Footer_main";
import Tooltip from './Tooltip';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const sectionRef = useRef(null);
  function handleClick() {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Router>
    <div className="OuterMost">
      <Navbar />

  <div className="image-converter_outer">

  <div className="all_feature_button_container">
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
        Image Format Converter
        </Link>
        <Link to="/compress_image" className="all_feature_button" onClick={handleClick}>
        <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
        Image Resize/Compress
        </Link>
        <Link to="/Image_to_pdf" className="all_feature_button" onClick={handleClick}>
        <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
        Image To PDF Converter
        </Link>
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <span style={{background: "#f7b731"}} className="feature_status_button">Coming Soon</span>
        Image Background Removal
        </Link>
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <span style={{background: "#f7b731"}} className="feature_status_button">Coming Soon</span>
        Image Background Transform
        </Link>
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <span style={{background: "#f7b731"}} className="feature_status_button">Coming Soon</span>
        Image Text Extraction
        </Link>
  </div>

</div>

<div ref={sectionRef} id="main_transformation_section">
  <Routes>
    <Route exact path="/" element={<Image_format_converter />} />
    <Route path="/compress_image" element={<Compress_image />} />
    <Route path="/Image_to_pdf" element={<Image_to_pdf />} />
  </Routes>
</div>
<Footer_main/>

</div>
</Router>
);
}

export default App;
