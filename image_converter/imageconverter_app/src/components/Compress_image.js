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




  );
}

export default Compress_image;
