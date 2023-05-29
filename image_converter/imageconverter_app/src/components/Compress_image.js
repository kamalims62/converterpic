import React, { useState, useRef } from 'react';
import axios from 'axios';
import Range_slider from './Range_slider';
import ErrorAlert from './ErrorAlert';

function Compress_image() {
  const inputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [metadata, setMetadata] = useState({compression_quality: 90});
  const [compressionQuality, setCompressionQuality] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearStates = () => {
      inputRef.current.value = null;
      setImageFile(null);
      setMetadata({compression_quality: 90});
      setCompressionQuality(null);
      setCompressedImage(null);
      setErrorMessage(null);
      setIsLoading(false);
    };

  const handleImageChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleMetadataChange = (name, value) => {
    setMetadata(prevMetadata => ({
      ...prevMetadata,
      [name]: parseInt(value)
    }));
  };

  function handleAlertClose() {
    setErrorMessage(null);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check that an image file has been selected
    if (!imageFile) {
      setErrorMessage('Please select an image file');
      return;
    }

    // Check that the selected file is a valid image format
    const allowedFormats = ['jpeg', 'png', 'gif', 'webp', 'tiff', 'jpg', 'bmp'];
    const fileExtension = imageFile.name.split('.').pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      setErrorMessage('Invalid image format. Allowed formats: ' + allowedFormats.join(', '));
      return;
    }
    
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('metadata', JSON.stringify(metadata));

    setIsLoading(true);

    axios.post('/compress_image/', formData)
      .then(response => {
        setCompressedImage(response.data.compressed_image_data);
        setCompressionQuality(response.data.compression_quality);
        setErrorMessage(null);
        setIsLoading(false);
      })
      .catch(error => {
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else if (error.request) {
          setErrorMessage('Failed to send request to server');
        } else {
          setErrorMessage('Unknown error occurred');
        }
        setIsLoading(false);
      });
  };

  function formatFileSize(file) {
  const fileSize = file.size; // file size in bytes

  let fileSizeString;

  if (fileSize < 1024) {
    // file size is less than 1KB
    fileSizeString = fileSize + ' bytes';
  } else if (fileSize < 1024 * 1024) {
    // file size is less than 1MB
    const fileSizeInKB = fileSize / 1024;
    fileSizeString = fileSizeInKB.toFixed(2) + ' KB';
  } else {
    // file size is 1MB or larger
    const fileSizeInMB = fileSize / (1024 * 1024);
    fileSizeString = fileSizeInMB.toFixed(2) + ' MB';
  }

  return fileSizeString;
}

  function getFileSizeFromBase64() {
      const binaryString = atob(compressedImage);
      const fileSizeInBytes = binaryString.length;
      return formatFileSize({'size': fileSizeInBytes});
    }

    const handleSingleFileDownload = () => {
    const url = `data:${imageFile[`type`]};base64,${compressedImage}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', imageFile['name']);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
    <div className="image-converter">

       <div className="subsection">
      <div className="form" style={{padding:'1rem'}}>
<legend style={{fontSize: '20px',color: '#333',fontFamily: 'Arial, sans-serif',fontWeight: 'bold',textShadow: '1px 1px #ccc'}}>Image Compression(Resize)</legend>
     <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
       <div className="form-group" style={{ flex: 1, margin: 5}}>
          <div className="file-input">
            <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} ref={inputRef} className="file_input" />
           </div>
           {imageFile && <p>{formatFileSize(imageFile)} {imageFile.name}</p>}
           <br/>
           <label htmlFor="compression-quality-input">Compression quality:</label>
           <div>              
            <Range_slider name="compression_quality" value={metadata.compression_quality} onChildClick={handleMetadataChange}/>
            </div>
        </div>
       </div>

 <div className="loading-container" style={{visibility:isLoading?'visible':'hidden'}}>
                  <div className="loading-bar">
                    <div className="progress"></div>
                  </div>
                  <div className="progress-label">Compress In Process...</div>
                </div>

                {errorMessage && (
        <ErrorAlert text={errorMessage} onClose={handleAlertClose} autoDismissTime={5000} />
      )}
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
        <div style={{ flex: 1, width:'100%'}}>
        <button disabled={isLoading} onClick={handleSubmit} style={{ flex: 1, margin: 5}}>{isLoading ? 'Compressing...' : 'Compress'}</button>
        </div>

        <div disabled={isLoading} style={{ flex: 1, width:'100%'}}>
           <button onClick={clearStates} style={{ flex: 1, margin: 5}}>
                    Reset
                  </button>
        </div>

               </div>

      </div>
      </div>

      <div className="subsection">

      <div className="form" style={{boxShadow: 'none'}}>
        <div className="form-group" style={{ flex: 1, margin: 5}}>
        {compressedImage &&
        <div>
          <div className="Input_imgs_container">

          <p>Compression Quality: {compressionQuality}</p>
          <img className='converted_photo' src={'data:${imageFile["type"];base64,' + compressedImage} alt="Compressed" />
          <p>{getFileSizeFromBase64(compressedImage)}</p>
          <button style={{ flex: 1, margin: 5 }} onClick={() =>handleSingleFileDownload()}>Download</button>

      </div></div>
    }
        </div>
      </div>

  </div>
</div>

<div style={{ flex: 1, textAlign:'left', margin:'2.5rem', padding:'2rem'}}>
  <h2 style={{textAlign:'center'}}>How To Compress Images - All Steps</h2>
  <p>          
    <b>Step 1: </b> Open the Image Compression application <a href='https://www.imageconvertzone.com/compress_image'>Click Here</a>.
    <br/><br/>
    <b>Step 2: </b> Click on the "Choose File" button to select an image file you want to compress. Only image files (JPEG, PNG, GIF, WEBP, TIFF, JPG, BMP) are allowed.
    <br/><br/>
    <b>Step 3: </b> Once the file is selected, you will see the file name and its size displayed below the button.
    <br/><br/>
    <b>Step 4: </b> Adjust the compression quality using the range slider labeled "Compression quality." Slide the knob to the left for higher compression and lower image quality, or slide it to the right for lower compression and higher image quality.
    <br/><br/>
    <b>Step 5: </b> After adjusting the compression quality, click on the "Compress" button. If the compression process takes some time, a loading bar will be displayed to indicate the progress. The button text will change to "Compressing..." during this process.
    <br/><br/>
    <b>Step 6: </b> If there is an error during compression, an error message will be shown. The message will automatically disappear after 5 seconds. You can also manually close the error message by clicking the "X" button.
    <br/><br/>
    <b>Step 7: </b> Once the compression is complete, the compressed image will be displayed along with the compression quality and file size below it.
    <br/><br/>
    <b>Step 8: </b> If you want to download the compressed image, click on the "Download" button below the image. This will initiate the download of the compressed image file.
    <br/><br/>
    <b>Step 9: </b> If you want to compress another image, click on the "Reset" button. This will clear the selected image, compression quality, and the compressed image from the display.
  </p>
  <br/><br/>
  <b>Congratulations! You have successfully compressed the image.</b>
</div>


</div>
  );
}

export default Compress_image;
