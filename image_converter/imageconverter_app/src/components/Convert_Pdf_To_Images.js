import React, { useState, useRef } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ErrorAlert from './ErrorAlert';
import { faL } from '@fortawesome/free-solid-svg-icons';


const PdfToImageConverter = () => {
  
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(5);


  const clearStates = () => {
    setErrorMessage(null);
    setImages([]);
    setIsLoading(false);
    setPdfFile(null);
    setFirstPage(1);
    setLastPage(5);
    inputRef.current.value = null;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const fileType = file.type;
      const validFileType = "application/pdf";
  
      if (fileType === validFileType) {
        setErrorMessage(null);
        setImages([]);
        setPdfFile(file);
        setIsLoading(false);
        setFirstPage(1);
        setLastPage(5);
      } else {
        setPdfFile(null);
        setErrorMessage("Only PDF files are allowed.");
      }
    }
  };
  

  const convertPdfToImages = async (event) => {
    event.preventDefault();
    if (!pdfFile) {
      setErrorMessage('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    formData.append('first_page', firstPage);
    formData.append('last_page', lastPage);

    setIsLoading(true);


    axios.post('Convert_Pdf_To_Images/', formData)
  .then(response => {
    setIsLoading(false);
    setImages(response.data);
  })
  .catch(error => {
    if(error.response.data.error){
      setErrorMessage(error.response.data.error);
    }else{
      setErrorMessage('Invalid Input / Something Went Wrong / Tr Again');
    }
    setIsLoading(false);
  });
  event.preventDefault();

// Code here will continue executing immediately after the API call

    // try {
    //   const response = await axios.post('Convert_Pdf_To_Images/', formData);
    //   setIsLoading(false);
    //   setImages(response.data);
    // } catch (error) {
    //   setErrorMessage(error);
    //   setIsLoading(false);
    // }
  };

  const downloadAllImages = () => {
    const zip = new JSZip();

    images.forEach((imageInfo) => {
      const { image, page_number } = imageInfo;
      zip.file(`ImageConvertZone_Page_${page_number}.jpg`, image, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'ImageConvertZone.zip');
    });
  };

  const downloadImage = (imageInfo) => {
    const { image, page_number } = imageInfo;
    const blob = base64ToBlob(image, 'image/jpeg');
    saveAs(blob, `ImageConvertZone_Page_${page_number}.jpg`);
  };

  function handleAlertClose() {
    setErrorMessage(null);
  }
  
  const base64ToBlob = (base64, type) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type });
  };
  

  return (


    <div>
    <div className="image-converter">

       <div className="subsection">
      <div className="form" style={{padding:'1rem'}}>
<legend style={{fontSize: '20px',color: '#333',fontFamily: 'Arial, sans-serif',fontWeight: 'bold',textShadow: '1px 1px #ccc'}}>PDF To Image Converter</legend>
      <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
        
       <div className="form-group" style={{ flex: 1, margin: 5}}>
       
          <div className="file-input">
              <input id="file-input-button" type="file" accept=".pdf" onChange={handleFileChange}  ref={inputRef} className="file_input"/>
<p>Drag and drop PDF in grey area OR Select PDF</p>
          </div>
        </div>
       <div style={{ flex: 1, width: '100%' }}>
       <p className='hint_para'>Maximum 50 PDF Pages can be converted at a time.</p>
       <p className='hint_para'>If Your PDF Pages > 50 then try again by changing First Page & Last Page values.</p>
       <br/>
        <label htmlFor="first-page">First Page:</label>
        <input
          type="number"
          id="first-page"
          value={firstPage}
          onChange={(e) => setFirstPage(parseInt(e.target.value))}
          min="1"
        />
        &nbsp;&nbsp;
        <label htmlFor="last-page">Last Page:</label>
        <input
          type="number"
          id="last-page"
          value={lastPage}
          onChange={(e) => setLastPage(parseInt(e.target.value))}
          min={firstPage}
        />
        </div>
               </div>

 <div className="loading-container" style={{visibility:isLoading?'visible':'hidden'}}>
                  <div className="loading-bar">
                    <div className="progress"></div>
                  </div>
                  <div className="progress-label">Generating Images...</div>
</div>

{errorMessage && (
        <ErrorAlert text={errorMessage} onClose={handleAlertClose} autoDismissTime={5000} />
      )}
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>

        <div style={{ flex: 1, width:'100%'}}>
            <button disabled={isLoading} onClick={convertPdfToImages} style={{ flex: 1, margin: 5, width:'200px'}}>{isLoading ? 'Generating Images...' : 'Generate Images'}</button>

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
        
        {images.length > 0 &&
        <div>
          <button onClick={downloadAllImages}>Download All Images in Zip</button>
          <br/>
          <br/>
          <div className="Input_imgs_container">
            {images.map((imageInfo) => (
              <div key={imageInfo.page_number} className="Input_imgs_box">
              <img className='converted_photo' src={`data:image/jpeg;base64,${imageInfo.image}`} alt={`Page ${imageInfo.page_number}`} />
              <button onClick={() => downloadImage(imageInfo)}>Download Page {imageInfo.page_number}</button>
             </div>
        ))}
      </div></div>
    }
        </div>
      </div>

  </div>
</div>


<div style={{ flex: 1, textAlign: 'left', margin: '2.5rem', padding: '2rem' }}>
  <h2 style={{ textAlign: 'center' }}>How To Convert PDF to Images - All Steps</h2>
  <p>
    <b>Step 1:</b> Open the PDF to Image Converter web application by visiting  <a href='https://www.imageconvertzone.com/Convert_Pdf_To_Images'>Click Here</a>.
    <br /><br />
    <b>Step 2:</b> Click on the "Choose File" button or drag and drop a PDF file into the grey area.
    <br /><br />
    <b>Step 3:</b> The selected PDF file will be displayed below the button.
    <br /><br />
    <b>Step 4:</b> Click the "Convert" button to start the conversion process.
    <br /><br />
    <b>Step 5:</b> While the conversion is in progress, a loading animation or progress bar will be shown.
    <br /><br />
    <b>Step 6:</b> Once the conversion is complete, the converted images will be displayed below.
    <br /><br />
    <b>Step 7:</b> To download all images as a ZIP file, click on the "Download All as Zip" button.
    <br /><br />
    <b>Step 8:</b> To download a single image, click on the "Download" button below the respective image.
    <br /><br />
    <b>Step 9:</b> If any error occurs during the conversion process, an error message will be displayed.
  </p>
  <br /><br />
  <b>Congratulations! You have successfully converted your PDF to images.</b>
</div>




</div>
  );
};

export default PdfToImageConverter;
