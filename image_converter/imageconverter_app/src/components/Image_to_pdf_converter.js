import React from 'react';
import { useState, useRef} from 'react';
import axios from 'axios';
import './styles.css';
import Tooltip from './Tooltip';

const allowedFormats = ['jpeg', 'png', 'gif', 'webp', 'tiff','jpg', 'bmp'];

function Image_to_pdf() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const clearStates = () => {
      setFiles([]);
      setIsLoading(false);
      setPdfUrl(null);
      inputRef.current.value = null;
    };

  const handleFileInputChange = (event) => {
  if(files.length !=0){
      setFiles([]);
      setPdfUrl(null);
      setIsLoading(false);
  }
    const fileList = event.target.files;

    if (fileList.length > 300) {
        clearStates();
      alert('Maximum 300 files can be uploaded');
      return;
    }

    const fileArray = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (allowedFormats.indexOf(file.name.split('.').pop().toLowerCase()) === -1) {
        alert(`File ${file.name} is not a valid image format`);
        continue;
      }

      fileArray.push({
        file: file,
        name: file.name,
        format: file.name.split('.').pop().toLowerCase(),
      });
    }

    setFiles(fileArray);
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

  const handleSubmit = () => {
  event.preventDefault();
    let isError = false;

    if (files.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (files.length > 300) {
      alert('You can only upload up to 300 files.');
      return;
    }


    if (!isError) {
      setIsLoading(true);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(`file`, files[i].file);
        formData.append(`name${i}`, files[i].name);
        formData.append(`format${i}`, files[i].format);
      }


      axios.post('Image_to_pdf/', formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          },responseType: 'blob'
        }).then(response => {
          console.log(response);
          console.log(typeof(response.data));
          setIsLoading(false);
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
        });
    }
  };

  return (

    <div>
    <div className="image-converter">

       <div className="subsection">
      <div className="form" style={{padding:'1rem'}}>
<legend style={{fontSize: '20px',color: '#333',fontFamily: 'Arial, sans-serif',fontWeight: 'bold',textShadow: '1px 1px #ccc'}}>Image To PDF Converter</legend>
      <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
       <div className="form-group" style={{ flex: 1, margin: 5}}>
          <div className="file-input">
              <input id="file-input-button" type="file" accept="image/*" multiple  ref={inputRef} onChange={handleFileInputChange} className="file_input"/>
<p>Drag and drop images in grey area OR Select files</p>
<p>(Allowed Maximum 300 Images)</p>
          </div>

        {files.length > 0 &&
        <div>
          <div className="Input_imgs_container">
            {files.map((file, index) => (
              <div key={index} className="Input_imgs_box">
                <p>{formatFileSize(file['file'])} {file.name}</p>
              </div>
        ))}
      </div></div>
    }
        </div>
               </div>

 <div className="loading-container" style={{visibility:isLoading?'visible':'hidden'}}>
                  <div className="loading-bar">
                    <div className="progress"></div>
                  </div>
                  <div className="progress-label">Generating PDF...</div>
</div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>

        <div style={{ flex: 1, width:'100%'}}>
            <button disabled={isLoading} onClick={handleSubmit} style={{ flex: 1, margin: 5, width:'160px'}}>{isLoading ? 'Generating PDF...' : 'Generate PDF'}</button>

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
        
        {pdfUrl && (
        <div>
          <a href={pdfUrl} download="converted.pdf">
            <button style={{ flex: 1, margin: 5, width:'160px'}}>Download PDF</button>
            </a>
          <iframe src={pdfUrl} width="100%" height="500px" />
        </div>
      )}
        
        {/* {convertedImgArr.length > 0 && outputImageSectionShow &&
        <div>
          <div className="Input_imgs_container">
            {convertedImgArr.map((fileBase64, index) => (
              <div key={index} className="Input_imgs_box">
              <img className='converted_photo' src={`data:${files[index][`toFormat`]};base64,${fileBase64}`} alt="Converted" />
              <p>{replaceFileExtension(files[index][`name`],files[index][`toFormat`])}</p>
              <p>{getFileSizeFromBase64(fileBase64)}</p>
                    <button style={{ flex: 1, margin: 5 }} onClick={() =>handleSingleFileDownload(fileBase64, index)}>Download</button>
          </div>
        ))}
      </div></div>
    } */}
        </div>
      </div>

  </div>
</div>


<div style={{ flex: 1, textAlign: 'left', margin: '2.5rem', padding: '2rem' }}>
  <h2 style={{ textAlign: 'center' }}>How To Use Image to PDF Converter - All Steps</h2>
  <p>
    <b>Step 1:</b> Open the Image to PDF Converter web application <a href='https://www.imageconvertzone.com/Image_to_pdf'>Click Here</a>.
    <br /><br />
    <b>Step 2:</b> Drag and drop images into the grey area or click on the "Select files" button to choose image files. You can select multiple images at once.
    <br /><br />
    <b>Step 3:</b> The selected images will be displayed below the button, showing their file names and sizes.
    <br /><br />
    <b>Step 4:</b> If needed, you can remove the selected images by clicking the "Reset" button.
    <br /><br />
    <b>Step 5:</b> Click the "Generate PDF" button to start the conversion process.
    <br /><br />
    <b>Step 6:</b> While the PDF is being generated, a loading animation or progress bar may be displayed.
    <br /><br />
    <b>Step 7:</b> Once the PDF is generated, a download button will appear. Click on the "Download PDF" button to save the converted PDF file to your device.
    <br /><br />
    <b>Step 8:</b> You can also view the generated PDF within the web application using the embedded iframe.
    <br /><br />
    <b>Step 9:</b> If any errors occur during the conversion process, an error message will be displayed.
  </p>
  <br /><br />
  <b>Congratulations! You have successfully converted your images to a PDF.</b>
</div>



</div>
);
}

export default Image_to_pdf;
