import React from 'react';
import { useState, useRef} from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import './styles.css';
import JSZip from 'jszip';
import ImageToPDFConverter from "./Image_to_pdf_converter";

const allowedFormats = ['jpeg', 'png', 'gif', 'webp', 'tiff','jpg', 'bmp'];

function App() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [formatTo, setFormatTo] = useState('');
  const [convertedImgArr, setConvertedImgArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const clearStates = () => {
      setConvertedImgArr([]);
      setFiles([]);
      setFormatTo('');
      setIsLoading(false);
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
    const newFiles = [...files];
    newFiles[index].toFormat = event.target.value;
    setFiles(newFiles);
    setFormatTo('');
  };

  const handleFormatToChange = (event) => {
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
    <div className="OuterMost">
  <Navbar />

  <div className="image-converter_outer">
  <h2 style={{
      background: "linear-gradient(to right, #FFB6C1, #87CEFA)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
     }}>
      Image Format Converter
      <p className="note-paragraph">Allowed Formats - 'jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff','bmp'</p>
    </h2>

    <div className="image-converter">
       <div className="subsection">
      <div className="form">

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

        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

        <div style={{ flex: 1, width:'50%'}}>
            <h4 style={{margin:0}}>Select format to convert all files to</h4>
        </div>

        <div style={{ flex: 1, width:'50%'}}>
            <select value={formatTo} onChange={handleFormatToChange} style={{fontSize:'0.7rem'}}>
              <option value="">Select Format</option>
              {allowedFormats.map((format, index) => (
                <option key={index} value={format}>{format.toUpperCase()}</option>
              ))}
            </select>
        </div>

        <div style={{ flex: 1, width:'50%'}}>
            <button disabled={isLoading} onClick={handleSubmit} style={{ flex: 1, margin: 5}}>{isLoading ? 'Converting...' : 'Convert'}</button>

        </div>

        <div style={{ flex: 1, width:'50%'}}>
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
        {convertedImgArr.length > 0 &&
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

<p className="note-paragraph">Maximum 9 files are allowed.<br/>You can select a common Format To Convert for all files.<br/>OR<br/>You can select a Format To Convert individually for any file after file upload!</p>
</div>
</div>
);
}

export default App;
