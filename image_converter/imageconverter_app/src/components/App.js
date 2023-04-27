import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import './styles.css';
import JSZip from 'jszip';
import ImageToPDFConverter from "./Image_to_pdf_converter";

const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'psd', 'raw', 'bmp', 'heif', 'indd'];

function App() {
  const [files, setFiles] = useState([]);
  const [formatTo, setFormatTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileInputChange = (event) => {
    const fileList = event.target.files;

    if (fileList.length > 10) {
      alert('Maximum 10 files can be uploaded');
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

  const handleSubmit = () => {
    let isError = false;

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
    </h2>
    <div className="image-converter">
       <div className="subsection">
      <div className="form">

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

      <div className="form-group" style={{ flex: 1, margin: 5}}>
          <h3>Select format to convert all files</h3>
    <select value={formatTo} onChange={handleFormatToChange}>
      <option value=""></option>
      {allowedFormats.map((format, index) => (
        <option key={index} value={format}>{format.toUpperCase()}</option>
      ))}
    </select>
        </div>

       <div className="form-group" style={{ flex: 1, margin: 5}}>
          <label htmlFor="file">Image File</label>
          <input type="file" accept="image/*" multiple onChange={handleFileInputChange} />
        {files.length > 0 &&
        <div>
            <h3>Select format to convert each file</h3>
          <div className="Input_imgs_container">
            {files.map((file, index) => (
              <div key={index} className="Input_imgs_box">
                <p>{file.name}</p>
                <select value={file.toFormat} onChange={(event) => handleToFormatChange(event, index)}>
                  <option value="">Select Format</option>
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

        <button disabled={isLoading} onClick={handleSubmit} style={{ flex: 1, margin: 5}}>{isLoading ? 'Converting...' : 'Convert'}</button>


               </div>
      </div>
      </div>

      <div className="subsection">

      <div className="form" style={{boxShadow: 'none'}}>
        <div className="form-group">
        </div>
      </div>

  </div>
</div>
</div>
</div>
);
}

export default App;
