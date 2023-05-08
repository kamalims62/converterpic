import React from 'react';
import './styles.css';
function Footer_main() {

    return(
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", padding:'4rem'}}>

        <div style={{ flex: 1, width:'100%', textAlign:'center'}}>
        <img style={{height:'10rem', width:'20rem'}}src='static/images/logo.svg' alt="ImageConverterZone" />
        <p>&copy; 2023 imageconvertzone.com. All rights reserved.</p>
        </div>

        <div style={{ flex: 2, width:'100%', textAlign:'left'}}>
          <p className='pFooter'>
          We at ImageConvertZone.com offer a comprehensive range of services to meet your image processing needs. Our fast and secure image format conversion services allow you to easily convert your images from one format to another without compromising on quality.
In addition to image format conversion, we also provide image compression, resizing, image to PDF conversion, background removal, background transformation, and image text extraction services. With our cutting-edge technology and advanced algorithms, we ensure that your images are processed quickly and efficiently.

          </p>
          <p className='pFooter'>
          At ImageConvertZone.com, we are committed to data security and reliability. Our app is designed to ensure that your images are always secure, and we do not store your images on our servers. This means that your data is safe and only you have access to it.
         </p>
          <p className='pFooter'>
          Thank you for choosing ImageConvertZone.com for your image processing needs. If you have any questions or feedback, please feel free to contact us at kamalims62@gmail.com.
          </p>
        </div>

</div>

    )
}

export default Footer_main;