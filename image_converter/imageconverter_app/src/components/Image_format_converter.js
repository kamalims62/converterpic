import React from 'react';
import { useState, useRef} from 'react';
import axios from 'axios';
import './styles.css';
import JSZip from 'jszip';
import ImageToPDFConverter from "./Image_to_pdf_converter";
import Tooltip from './Tooltip';

const allowedFormats = ['jpeg', 'png', 'gif', 'webp', 'tiff','jpg', 'bmp'];

function Image_format_converter() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [formatTo, setFormatTo] = useState('');
  const [convertedImgArr, setConvertedImgArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [outputImageSectionShow, setOutputImageSectionShow] = useState(false);

  const clearStates = () => {
      setConvertedImgArr([]);
      setFiles([]);
      setFormatTo('');
      setIsLoading(false);
      setOutputImageSectionShow(false);
      inputRef.current.value = null;
    };

  const handleFileInputChange = (event) => {
  if(files.length !=0){
    setConvertedImgArr([]);
      setFiles([]);
      setFormatTo('');
      setIsLoading(false);
  }
    const fileList = event.target.files;

    if (fileList.length > 9) {
        clearStates();
      alert('Maximum 9 files can be uploaded');
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
        toFormat: '',
      });
    }

    setFiles(fileArray);
  };

  const handleToFormatChange = (event, index) => {
  setOutputImageSectionShow(false);
    const newFiles = [...files];
    newFiles[index].toFormat = event.target.value;
    setFiles(newFiles);
    setFormatTo('');
  };

  const handleFormatToChange = (event) => {
  setOutputImageSectionShow(false);
    const newFiles = [...files];
    for (let i = 0; i < newFiles.length; i++) {
      newFiles[i].toFormat = event.target.value;
    }
    setFiles(newFiles);
    setFormatTo(event.target.value);
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

function getFileSizeFromBase64(base64String) {
  const binaryString = atob(base64String);
  const fileSizeInBytes = binaryString.length;
  return formatFileSize({'size': fileSizeInBytes});
}

function replaceFileExtension(filename, newExtension) {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) {
    // If the filename doesn't contain a dot, just add the new extension
    return `${filename}.${newExtension}`;
  } else {
    // Replace the existing extension with the new one
    return `${filename.substring(0, dotIndex)}.${newExtension}`;
  }
}


const handleSingleFileDownload = (base64String, index) => {
    const url = `data:${files[index][`toFormat`]};base64,${base64String}`;
    const link = document.createElement('a');
    link.href = url;
    const file_name = replaceFileExtension(files[index]['name'],files[index]['toFormat']);
    link.setAttribute('download', file_name);
    document.body.appendChild(link);
    link.click();
  };

const handleZipDownload = () => {
    const zip = new JSZip();
    convertedImgArr.forEach((image, index) => {
      const imageData = image;
      const file_name = replaceFileExtension(files[index]['name'],files[index]['toFormat']);
      zip.file(file_name, imageData, { base64: true });
    });
    zip.generateAsync({ type: "base64" })
      .then(base64 => {
        const link = document.createElement("a");
        link.href = "data:application/zip;base64," + base64;
        link.download = "images.zip";
        link.click();
      })
      .catch(error => console.log(error));
  };


  const handleSubmit = () => {
  event.preventDefault();
    let isError = false;

    if (files.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (files.length > 9) {
      alert('You can only upload up to 9 files.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].toFormat === '') {
        alert(`Please select a format to convert file ${files[i].name}`);
        isError = true;
        break;
      }
    }


    if (!isError) {
      setIsLoading(true);

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(`file${i}`, files[i].file);
        formData.append(`name${i}`, files[i].name);
        formData.append(`format${i}`, files[i].format);
        formData.append(`toFormat${i}`, files[i].toFormat);
      }

      console.log(formData)
      console.log(files)
      console.log(formatTo)

      axios.post('convert_image/', formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          console.log(response.data);
          setOutputImageSectionShow(true);
          setConvertedImgArr(response.data.converted_image);
          setIsLoading(false);
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
<legend style={{fontSize: '20px',color: '#333',fontFamily: 'Arial, sans-serif',fontWeight: 'bold',textShadow: '1px 1px #ccc'}}>Image Format Converter</legend>

<Tooltip instructions="Maximum 9 files are allowed.\nYou can select a common Format To Convert for all files.\nOR\nYou can select a Format To Convert individually for any file after file upload!" />
      <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>


       <div className="form-group" style={{ flex: 1, margin: 5}}>
          <div className="file-input">

              <input id="file-input-button" type="file" accept="image/*" multiple  ref={inputRef} onChange={handleFileInputChange} className="file_input"/>
<p>Drag and drop images in grey area OR Select files</p>
<p>(Allowed Maximum 9 Images)</p>
          </div>

        {files.length > 0 &&
        <div>
            <p className="note-paragraph">You can select format to convert each file separately!</p>
          <div className="Input_imgs_container">
            {files.map((file, index) => (
              <div key={index} className="Input_imgs_box">
                <p>{formatFileSize(file['file'])} {file.name}</p>
                <select style={{fontSize: '.6rem'}} value={file.toFormat} onChange={(event) => handleToFormatChange(event, index)}>
                  <option value="">Select To Format</option>
                  {allowedFormats.map((format, index) => (<option key={index} value={format}>{format.toUpperCase()}</option>
              ))}
            </select>
          </div>
        ))}
      </div></div>
    }
        </div>
               </div>


<div style={{ }}>
            <h4 style={{margin:0}}>(Optional) If multiple images uploaded- Select single format to convert all files to</h4>
</div>

<div style={{ }}>
            <select value={formatTo} onChange={handleFormatToChange} style={{fontSize:'0.7rem'}} disabled={files.length>0 ?false:true} title="Select at least one image">
              <option value="">Select Format</option>
              {allowedFormats.map((format, index) => (
                <option key={index} value={format}>{format.toUpperCase()}</option>
              ))}
            </select>
 </div>

 <div className="loading-container" style={{visibility:isLoading?'visible':'hidden'}}>
                  <div className="loading-bar">
                    <div className="progress"></div>
                  </div>
                  <div className="progress-label">Converting...</div>
                </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>

        <div style={{ flex: 1, width:'100%'}}>
            <button disabled={isLoading} onClick={handleSubmit} style={{ flex: 1, margin: 5}}>{isLoading ? 'Converting...' : 'Convert'}</button>

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
        {convertedImgArr.length > 0 && outputImageSectionShow &&
        <div>
        <button onClick={handleZipDownload}>Download All in Zip</button>
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
    }
        </div>
      </div>
  </div>
</div>


<div style={{ flex: 1, textAlign:'left', margin:'2.5rem', padding:'2rem'}}>
      <h2 style={{textAlign:'center'}}>How To Convert Image Format - All Steps</h2>
      <p>          
         <b>Step 1: </b> Open the Image Format Converter web application <a href='https://www.imageconvertzone.com/'>Click Here</a>.
          <br/><br/>
          <b>Step 2: </b>Drag and drop up to 9 images onto the gray area or click on the "Select files" button to choose the images you want to convert. You can only upload image files with formats such as JPEG, PNG, GIF, WEBP, TIFF, JPG, or BMP. If you select more than 9 files, you will be prompted with an alert.
          <br/><br/>
          <b>Step 3: </b>After selecting the files, you will see a list of the uploaded images with their file sizes. If you want to convert each file to a different format, select the desired format from the dropdown list next to each image. If you want to convert all the files to the same format, select the desired format from the "Select Format" dropdown list below the uploaded images. Note that the "Select Format" dropdown list will only be enabled if at least one image is uploaded.
          <br/><br/>
          <b>Step 4: </b>Once you have selected the format(s) for conversion, click on the "Convert" button. If the conversion process takes some time, a loading bar will be displayed. After the conversion is complete, the converted images will be shown below.
          <br/><br/>
          <b>Step 5: </b>If multiple images were converted and you want to download them all, click on the "Download All in Zip" button. This will generate a ZIP file containing all the converted images, which you can then download.
          <br/><br/>
          <b>Step 6: </b>If you want to download a single converted image, click on the "Download" button below the respective image. This will initiate the download of that specific image.
          <br/><br/>
          <b>Step 7: </b>If you want to start over and clear all the uploaded images and converted results, click on the "Reset" button.
         </p>
         <br/><br/>
         <b>Congratulation !! On Successfully Converting Image Format ( jpeg | png | gif | webp | tiff | jpg | bmp )</b>
        </div>
        </div>
);
}

export default Image_format_converter;
