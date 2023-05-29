import React, { useState, useRef } from 'react';
import axios from 'axios';
import ErrorAlert from './ErrorAlert';

const ImageUploader = () => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resizedImageArr, setResizedImageArr] = useState(null);
  const [resizedWidth, setResizedWidth] = useState(null);
  const [resizedHeight, setResizedHeight] = useState(null);
  const [originalWidth, setOriginalWidth] = useState(null);
  const [originalHeight, setOriginalHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resizeTechniques, setResizeTechniques] = useState([]);

  const clearStates = () => {
    inputRef.current.value = null;
    setFile(null);
    setWidth('');
    setHeight('');
    setIsLoading(false);
    setResizedImageArr(null);
    setResizedWidth(null);
    setResizedHeight(null);
    setOriginalWidth(null);
    setOriginalHeight(null);
    setErrorMessage(null);
    setResizeTechniques([]);
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

  function handleAlertClose() {
    setErrorMessage(null);
  }

  const handleFileChange = (event) => {
    setWidth('');
    setHeight('');
    setIsLoading(false);
    setResizedImageArr(null);
    setResizedWidth(null);
    setResizedHeight(null);
    setOriginalWidth(null);
    setOriginalHeight(null);
    setErrorMessage(null);

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

  const handleResizeTechniquesChange = (event) => {
    const { value, checked } = event.target;
  
    if (checked) {
      setResizeTechniques((prevTechniques) => [...prevTechniques, value]);
    } else {
      setResizeTechniques((prevTechniques) => prevTechniques.filter((technique) => technique !== value));
    }
  };

  const handleImageUpload = (event) => {
    event.preventDefault();

    if (!file) {
      setErrorMessage('Please select an image');
      return;
    }
  
    if (!width || !height) {
      setErrorMessage('Please enter both width and height');
      return;
    }
  
    const isValidWidth = /^\d+$/.test(width);
    const isValidHeight = /^\d+$/.test(height);
  
    if (!isValidWidth || !isValidHeight) {
      setErrorMessage('Width and height must be positive integers');
      return;
    }
  
    if (resizeTechniques.length === 0) {
      setErrorMessage('Please select at least one resize technique');
      return;
    }

    const formData = new FormData();

    // Check that the selected file is a valid image format
    const allowedFormats = ['jpeg', 'png', 'gif', 'webp', 'tiff', 'jpg', 'bmp'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      setErrorMessage('Invalid image format. Allowed formats: ' + allowedFormats.join(', '));
      return;
    }
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('resize_techniques', resizeTechniques.join(','));
    for (const entry of formData) {
      console.log(entry);
    }

    setIsLoading(true);
    axios
      .post('resize/', formData)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data)
        console.log(typeof(response.data))
        const { resized_image, resized_width, resized_height } = response.data;
        setResizedImageArr(response.data);
        setErrorMessage(null);
      })
      .catch((error) => {
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

  const handleSingleFileDownload = (image) => {
    const url = `data:image/jpeg;base64,${image}`;
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
      fileSizeString = fileSizeInMB.toFixed(2) + ' MB';
    }
    return fileSizeString;
  }

  return (
    <div>
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
                    <b>Original Image Size & Dimension (Width x Height)</b>
                  </p>
                  <p>
                    {formatFileSize(file)} <b> & </b>{originalWidth} x {originalHeight} Pixels
                  </p>
                </div>
              )}
              <br />
              <br />
              <label>Desired Size(Dimension):(pixels)</label>
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
              <br />
              <br />
              <label>Resize Techniques:</label>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="rescale"
                    checked={resizeTechniques.includes('rescale')}
                    onChange={handleResizeTechniquesChange}
                  />
                  Rescale
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="squeeze"
                    checked={resizeTechniques.includes('squeeze')}
                    onChange={handleResizeTechniquesChange}
                  />
                  Squeeze
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="crop"
                    checked={resizeTechniques.includes('crop')}
                    onChange={handleResizeTechniquesChange}
                  />
                  Crop
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="letterbox"
                    checked={resizeTechniques.includes('letterbox')}
                    onChange={handleResizeTechniquesChange}
                  />
                  letterbox
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="All"
                    checked={resizeTechniques.includes('All')}
                    onChange={handleResizeTechniquesChange}
                  />
                  All
                </label>
                
              </div>

              <div className="loading-container" style={{visibility:isLoading?'visible':'hidden'}}>
                  <div className="loading-bar">
                    <div className="progress"></div>
                  </div>
                  <div className="progress-label">Converting...</div>
                </div>
              {errorMessage && (
        <ErrorAlert text={errorMessage} onClose={handleAlertClose} autoDismissTime={5000} />
      )}
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>      
              
              <div disabled={isLoading} style={{ flex: 1, width:'100%'}}>
              <button disabled={isLoading} onClick={clearStates} style={{ flex: 1, margin: 5}}>
                    Reset
                  </button>
              </div>        
              <div style={{ flex: 1, width:'100%'}}>
              <button
              style={{ flex: 1, margin: 5}}
                type="button"
                onClick={handleImageUpload}
                disabled={isLoading}
              >
                {isLoading ? 'Resizing...' : 'Resize'}
              </button>
              </div>
              
           
              </div>
              
              
            </div>
          </div>
        </div>
      </div>


      <div className="subsection">

<div className="form" style={{boxShadow: 'none'}}>
  <div className="form-group" style={{ flex: 1, margin: 5}}>


  {resizedImageArr && <div><h2 style={{
              fontSize: '20px',
              color: '#333',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              textShadow: '1px 1px #ccc',
            }}
          >
            Resized Images
          </h2> <div className="Input_imgs_container">
  
  {Object.keys(resizedImageArr).map((key, index) => {
  const resizedImage = resizedImageArr[key];

  return (
    <div>
    <div key={index}>
      <p>Resize Technique: <b>{key}</b></p>
      <img
              src={`data:image/jpeg;base64,${resizedImage.resized_image}`}
              alt="Resized"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
      <p>Dimension: (Width x Height) {resizedImage.resized_width} x {resizedImage.resized_height}</p>
      <button style={{ flex: 1, margin: 5 }} onClick={() =>handleSingleFileDownload(resizedImage.resized_image)}>Download</button>
    </div>
    </div>
  );
 
})}
</div>
</div>
}

  </div>
</div>

</div>




    </div>

    <div style={{ flex: 1, textAlign:'left', margin:'2.5rem', padding:'2rem'}}>
  <h2 style={{textAlign:'center'}}>How To Resize Image - All Steps</h2>
  <p>          
    <b>Step 1: </b> Open the web application for resizing images <a href='https://www.imageconvertzone.com/resize_image'>Click Here</a>.
    <br/><br/>
    <b>Step 2: </b> Click on the "Choose File" button to select an image file. The supported image formats are JPEG, PNG, GIF, WEBP, TIFF, JPG, and BMP.
    <br/><br/>
    <b>Step 3: </b> Once the file is selected, the application will display the file name and its size below the button.
    <br/><br/>
    <b>Step 4: </b> Enter the desired width and height values in pixels for resizing the image.
    <br/><br/>
    <b>Step 5: </b> Optionally, select one or more resize techniques by checking the corresponding checkboxes. The available options are: Rescale, Squeeze, Crop, Letterbox, and All.
    <br/><br/>
    <b>Step 6: </b> If you want to reset the form, click the "Reset" button.
    <br/><br/>
    <b>Step 7: </b> Click the "Resize" button to start the resizing process.
    <br/><br/>
    <b>Step 8: </b> While the image is being resized, a loading animation or progress bar may be displayed.
    <br/><br/>
    <b>Step 9: </b> Once the resizing is complete, the application will show the resized images with their respective dimensions and the chosen resize technique(s).
    <br/><br/>
    <b>Step 10: </b> For each resized image, you can click the "Download" button to save the image file to your device.
    <br/><br/>
    <b>Step 11: </b> If any errors occur during the process, an error message will be displayed.
  </p>
  <br/><br/>
  <b>Congratulations! You have successfully resized the image.</b>
</div>



    </div>
  );
};

export default ImageUploader;
