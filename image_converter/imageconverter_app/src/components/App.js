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
import ImageUploader from "./resize";
import About_us from './about_us'
import Tooltip from './Tooltip';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VideoDownloadForm from './video//VideoDownloadForm';
import Convert_Pdf_To_Images from "./Convert_Pdf_To_Images";

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
        <div className='all_feature_button_inner_div'>
            <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
            <span>Image Format Converter</span>
        </div>
        </Link>
        <Link to="/compress_image" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
          <span>Image Compress</span>
        </div>
        </Link>
        <Link to="/resize_image" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
          <span>Image Resize</span>
        </div>
        </Link>
        <Link to="/Image_to_pdf" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
          <span>Image To PDF Converter</span>
        </div>
        </Link>
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "#f7b731"}} className="feature_status_button">Soon</span>
          <span>Image Background Removal</span>
        </div>
        </Link>
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "#f7b731"}} className="feature_status_button">Soon</span>
          <span>Image Background Transform</span>
        </div>
        </Link>
        <Link to="/" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "#f7b731"}} className="feature_status_button">Soon</span>
          <span>Image Text Extraction</span>
        </div>
        </Link>
        <Link to="/YouTubeDownload" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
          <span>Download YouTube Video</span>
        </div>
        </Link>

        <Link to="/Convert_Pdf_To_Images" className="all_feature_button" onClick={handleClick}>
        <div className='all_feature_button_inner_div'>
          <span style={{background: "limegreen"}} className="feature_status_button">Available</span>
          <span>PDF To Image Converter</span>
        </div>
        </Link>

  </div>

</div>

<div ref={sectionRef} id="main_transformation_section">
  <Routes>
    <Route exact path="/" element={<Image_format_converter />} />
    <Route path="/compress_image" element={<Compress_image />} />
    <Route path="/Image_to_pdf" element={<Image_to_pdf />} />
    <Route path="/resize_image" element={<ImageUploader />} />
    <Route path="/about_us" element={<About_us />} />
    <Route path="/YouTubeDownload" element={<VideoDownloadForm />} />
    <Route path="/Convert_Pdf_To_Images" element={<Convert_Pdf_To_Images/>} />
  </Routes>
</div>
<Footer_main handleClick/>

</div>
</Router>
);
}

export default App;
