import React, { useState, useRef } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resizedImage, setResizedImage] = useState('');
  const [resizedWidth, setResizedWidth] = useState(null);
  const [resizedHeight, setResizedHeight] = useState(null);
  const [originalWidth, setOriginalWidth] = useState(null);
  const [originalHeight, setOriginalHeight] = useState(null);

  const clearStates = () => {
    inputRef.current.value = null;
    setFile(null);
    setWidth('');
    setHeight('');
    setIsLoading(false);
    setResizedImage('');
    setResizedWidth(null);
    setResizedHeight(null);
    setOriginalWidth(null);
    setOriginalHeight(null);
  };

  const getImageDimensions = (imageFile) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        setOriginalWidth(width);
        setOriginalHeight(height);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(imageFile);
  };

  const handleFileChange = (event) => {

    setWidth('');
    setHeight('');
    setIsLoading(false);
    setResizedImage('');
    setResizedWidth(null);
    setResizedHeight(null);
    setOriginalWidth(null);
    setOriginalHeight(null);

    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    getImageDimensions(selectedFile);
  };

  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };

  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);

    setIsLoading(true);
    axios
      .post('resize/', formData)
      .then((response) => {
        setIsLoading(false);
        const { resized_image, resized_width, resized_height } = response.data;
        setResizedImage(resized_image);
        setResizedWidth(resized_width);
        setResizedHeight(resized_height);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleSingleFileDownload = () => {
    const url = `data:image/jpeg;base64,${resizedImage}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ImageCovertZone');
    document.body.appendChild(link);
    link.click();
  };

  function formatFileSize(file) {
    const fileSize = file.size;

    let fileSizeString;

    if (fileSize < 1024) {
      fileSizeString = fileSize + ' bytes';
    } else if (fileSize < 1024 * 1024) {
      const fileSizeInKB = fileSize / 1024;
      fileSizeString = fileSizeInKB.toFixed(2) + ' KB';
    } else {
      const fileSizeInMB = fileSize / (1024 * 1024);
      fileSizeString = fileSizeInMB.toFixed(2) +' MB';
    }
    return fileSizeString;
}

return (
<div className="image-converter">
<div className="subsection">
<div className="form" style={{ padding: '1rem' }}>
<legend
style={{
fontSize: '20px',
color: '#333',
fontFamily: 'Arial, sans-serif',
fontWeight: 'bold',
textShadow: '1px 1px #ccc',
}}
>
Resize Image
</legend>
<div
style={{
display: 'flex',
flexDirection: 'column',
flexWrap: 'wrap',
}}
>
<div className="form-group" style={{ flex: 1, margin: 5 }}>
<div className="file-input">
<input
               id="image-input"
               type="file"
               accept="image/*"
               onChange={handleFileChange}
               ref={inputRef}
               className="file_input"
             />
</div>
{file && (
<div>
<p>
<b>Original Image Size & Dimension</b>
</p>
<p>
{formatFileSize(file)} {originalWidth}x{originalHeight} Pixels
</p>
</div>
)}
<br />
<label>Desired Size:(pixels)</label>
<div>
<input
               type="text"
               placeholder="Width"
               value={width}
               onChange={handleWidthChange}
             />
<input
               type="text"
               placeholder="Height"
               value={height}
               onChange={handleHeightChange}
             />
</div>
</div>
</div>
<div
        className="loading-container"
        style={{ visibility: isLoading ? 'visible' : 'hidden' }}
      >
        <div className="loading-bar">
          <div className="progress"></div>
        </div>
        <div className="progress-label">Resizing In Process...</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, width: '100%' }}>
          <button disabled={isLoading} onClick={handleImageUpload} style={{ flex: 1, margin: 5 }}>
            {isLoading ? 'Resizing...' : 'Resize'}
          </button>
        </div>

        <div disabled={isLoading} style={{ flex: 1, width: '100%' }}>
          <button onClick={clearStates} style={{ flex: 1, margin: 5 }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="subsection">
    <div className="form" style={{ boxShadow: 'none' }}>
      <div className="form-group" style={{ flex: 1, margin: 5 }}>
        {resizedImage && (
          <div>
            <div className="Input_imgs_container">
            <img className='converted_photo' src={'data:${imageFile["type"];base64,' + resizedImage} alt="Resized image" />
              <p>Resized Width: {resizedWidth}</p>
              <p>Resized Height: {resizedHeight}</p>
              <button style={{ flex: 1, margin: 5 }} onClick={handleSingleFileDownload}>
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
);
};

export default ImageUploader;
