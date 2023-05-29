import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
function Footer_main(handleClick) {

    return(
        <div className='footer_outer'>

        <div style={{ flex: 1, width:'100%', textAlign:'left'}}>
          <p className='pFooter'>
          Important Links :
          </p>
          
          <Link to="/"  onClick={handleClick}>
            <span className="feature_status_button">Available</span>
            <span>Image Format Converter</span>
        </Link>
        <br/><br/>
        <Link to="/compress_image"  onClick={handleClick}>
          <span className="feature_status_button">Available</span>
          <span>Image Compress</span>
        </Link>
        <br/><br/>
        <Link to="/resize_image"  onClick={handleClick}>
          <span className="feature_status_button">Available</span>
          <span>Image Resize</span>
        </Link>
        <br/><br/>
        <Link to="/Image_to_pdf"  onClick={handleClick}>
          <span className="feature_status_button">Available</span>
          <span>Image To PDF Converter</span>
        </Link>
        <br/><br/>
        <Link to="/"  onClick={handleClick}>
          <span className="feature_status_button">Soon</span>
          <span>Image Background Removal</span>
        </Link>
        <br/><br/>
        <Link to="/"  onClick={handleClick}>
          <span className="feature_status_button">Soon</span>
          <span>Image Background Transform</span>
        </Link>
        <br/><br/>
        <Link to="/"  onClick={handleClick}>
          <span className="feature_status_button">Soon</span>
          <span>Image Text Extraction</span>
        </Link>
        <br/><br/>
        </div>


        <div style={{ flex: 1, width:'100%', textAlign:'left'}}>
        <img style={{height:'5rem', width:'50%'}} src='static/images/logo.svg' alt="ImageConverterZone" />
        <p>&copy; 2023 imageconvertzone.com. All rights reserved.</p>
        
        </div>

        <div style={{ flex: 1, width:'100%', textAlign:'left'}}>
        <p className='pFooter'>
          Contact Details :
          </p>

          Email - kamalims62@gmail.com
          <br/><br/>
          <Link className='navbar-buttons' to="/about_us" onClick={handleClick}>
          About Us
            </Link>
            <Link className='navbar-buttons' to="/" onClick={handleClick}>
          Home
            </Link>

        </div>

</div>

    )
}

export default Footer_main;