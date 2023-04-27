import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Navbar from "./Navbar";
import './styles.css';
import JSZip from 'jszip';
import ImageToPDFConverter from "./Image_to_pdf_converter";

const ImageConverter = () => {
  const [fromFormat, setFromFormat] = useState('');
  const [toFormat, setToFormat] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [errorConvertedSection, setErrorConvertedSection] = useState('');
  const [convertedImg, setConvertedImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ConvertedFileName,setConvertedFileName] = useState('')

  const clearStates = () => {
      setFromFormat("");
      setToFormat('');
      setFile(null);
      setError("");
      setErrorConvertedSection("");
      setConvertedImg(null);
      setLoading(false);
      setConvertedFileName('');
      document.getElementById("input_file").value = "";
    };



  const handleFromFormatChange = (event) => {
    setFromFormat(event.target.value);
    setError('');
  };

  const handleToFormatChange = (event) => {
    setToFormat(event.target.value);
    setError('');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError('');
  };

  const getFileNameFromBase64 = (base64Data) => {
    const base64Header = 'data:image/';
    const base64Index = base64Data.indexOf(base64Header);
    if (base64Index === -1) {
      throw new Error('Invalid base64 format');
    }
    const extensionStartIndex = base64Index + base64Header.length;
    const extensionEndIndex = base64Data.indexOf(';', extensionStartIndex);
    if (extensionEndIndex === -1) {
      throw new Error('Invalid base64 format');
    }
    const extension = base64Data.substring(extensionStartIndex, extensionEndIndex);
    const fileName = `image.${extension}`;
    return fileName;
  };


  const validatePreDownload = async () => {
    if (!convertedImg) {
      setErrorConvertedSection('Please convert image first ');
      return;
    }
    }

  const handleConvert = async () => {
    if (!fromFormat || !toFormat || !file) {
      setError('Please fill all fields');
      return;
    }

    const fileFormat = file.type.split('/').pop();
    if (fromFormat !== fileFormat) {
      setError('File format does not match with selected "From" format');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('source_format', fromFormat);
      formData.append('target_format', toFormat);
      formData.append('file', file);

      const response = await axios.post('convert_image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setConvertedImg(response.data.converted_image);
        try {
          let base64Data = response.data.converted_image;
          base64Data = `data:${toFormat === 'jpeg' ? 'image/jpeg' : `image/${toFormat}`};base64,${base64Data}`;
          const fileName = getFileNameFromBase64(base64Data);
          setConvertedFileName(fileName);
        } catch (error) {
          console.error(error);
          setConvertedFileName('');
        }

    } catch (error) {
      console.error(error);
      setError('An error occurred during conversion');
    }

    setLoading(false);
  };

  const handleDownload = () => {
    const url = `data:${toFormat === 'jpeg' ? 'image/jpeg' : `image/${toFormat}`};base64,${convertedImg}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `converted.${toFormat}`);
    document.body.appendChild(link);
    link.click();
  };

  const handleZipDownload = () => {
    const zip = new JSZip();
    let imgData = `data:${toFormat === 'jpeg' ? 'image/jpeg' : `image/${toFormat}`};base64,${convertedImg}`;
    imgData = imgData.split(',')[1]; // get the base64 encoded image data
    zip.file(ConvertedFileName, imgData, { base64: true }); // add the image data to the zip file
    zip.generateAsync({ type: "base64" }) // generate the zip file as base64
      .then(base64 => {
        const link = document.createElement("a");
        link.href = "data:application/zip;base64," + base64;
        link.download = ConvertedFileName+".zip"; // set the file name
        link.click(); // trigger the download
      })
      .catch(error => console.log(error));
  };

  const getBase64ImgData = () => {
            data = `data:${toFormat === 'jpeg' ? 'image/jpeg' : `image/${toFormat}`};base64,${convertedImg}`;
            return data
  }

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
          <label htmlFor="from-format">From Format</label>
          <select id="from-format" value={fromFormat} onChange={handleFromFormatChange}>
            <option value="">-- Select --</option>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="gif">GIF</option>
            <option value="webp">WEBP</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1, margin: 5}}>
          <label htmlFor="to-format">To Format</label>
          <select id="to-format" value={toFormat} onChange={handleToFormatChange}>
            <option value="">-- Select --</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="gif">GIF</option>
            <option value="jpg">JPG</option>
            <option value="webp">WEBP</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>
               </div>




        <div className="form-group">
          <label htmlFor="file">Image File</label>
          <input type="file" id="input_file" onChange={handleFileChange} />
        </div>
        {error && <div className="error">{error}</div>}

        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                  <button onClick={handleConvert} disabled={loading} style={{ flex: 1, margin: 5}}>
                    {loading ? 'Converting...' : 'Convert'}
                  </button>
                  <button onClick={clearStates} style={{flex: 1, margin: 5}}>
                    Reset
                  </button>
               </div>
      </div>
      </div>

      <div className="subsection">

      <div className="form" style={{boxShadow: 'none'}}>
        <div className="form-group">
          {convertedImg !=null ?
                <div className="converted-image">
                <h2>Converted Image</h2>
                  <p>{ConvertedFileName}</p>
              <img className='converted_photo' src={`data:${toFormat === 'jpeg' ? 'image/jpeg' : `image/${toFormat}`};base64,${convertedImg}`} alt="Converted" />

              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                  <button style={{ flex: 1, margin: 5 }} onClick={handleZipDownload}>Zip</button>
                  <button style={{ flex: 1, margin: 5 }} onClick={handleDownload}>Download</button>
                  <div style={{ flex: 1, margin: 5 }}>
                      <ImageToPDFConverter images={images} />
                    </div>
               </div>
            </div>
          :<div className="converted-image">
          <h2>Converted Image</h2>
                  <p></p>
              <img className='converted_photo default-img' />
              {errorConvertedSection && <div className="error">{errorConvertedSection}</div>}
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                  <button style={{ flex: 1, margin: 5}} onClick={validatePreDownload}>Zip</button>
                  <button style={{flex: 1, margin: 5}} onClick={validatePreDownload}>
                    Download
                  </button>
               </div>
            </div>
          }
        </div>
      </div>

  </div>
</div>
</div>
</div>
);
};

export default ImageConverter;