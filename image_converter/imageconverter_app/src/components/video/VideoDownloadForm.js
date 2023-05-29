import React, { useState } from 'react';
import axios from 'axios';
import ErrorAlert from '../ErrorAlert';

const VideoDownloadForm = () => {
  const [url, setUrl] = useState('');
  const [mediaOptions, setMediaOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (url === '') {
      setErrorMessage('Please enter URL')
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get('YouTubeDownload/', {
        params: {
          url: url
        }
      });

      setMediaOptions(response.data);
      setLoading(false);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while fetching media options.');
      setLoading(false);
    }
  };

  // const handleDownload = (url, filename) => {
  //   const anchorElement = document.createElement('a');
  //   anchorElement.href = url;
  //   anchorElement.download = filename;
  //   anchorElement.click();
  // };

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };
  
  

  
  function handleAlertClose() {
    setErrorMessage(null);
  }

  return (

<div>
    <div className="image-converter">
       <div className="subsection">
      <div className="form" style={{padding:'1rem'}}>
<legend style={{fontSize: '20px',color: '#333',fontFamily: 'Arial, sans-serif',fontWeight: 'bold',textShadow: '1px 1px #ccc'}}>Download Video/Audio from Youtube</legend>
      <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
       <div className="form-group" style={{ flex: 1, margin: 5}}>
          <div className="file-input">
          <label htmlFor="url">YouTube URL</label>
          <input type="text" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
          </div>

        </div>
               </div>
               {errorMessage && (
        <ErrorAlert text={errorMessage} onClose={handleAlertClose} autoDismissTime={5000} />
      )}

 <div className="loading-container" style={{visibility:loading?'visible':'hidden'}}>
                  <div className="loading-bar">
                    <div className="progress"></div>
                  </div>
                  <div className="progress-label">Fetching...</div>
                </div>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap"}}>

        <div style={{ flex: 1, width:'100%'}}>
            <button disabled={loading} onClick={handleSubmit} style={{ flex: 1, margin: 5}}>{loading ? 'Loading...' : 'Get Video/Audio'}</button>

        </div>

               </div>

<br/>
<legend style={{fontSize: '20px',color: '#333',fontFamily: 'Arial, sans-serif',fontWeight: 'bold',textShadow: '1px 1px #ccc'}}>Check This Video For How To Download</legend>
<br/>
<div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <video controls style={{ width: '80%', height: '30%' }}>
        <source src="static/video/youtubeDownloadDemo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

      </div>
      
      </div>


      <div className="subsection">

      <div className="form" style={{boxShadow: 'none'}}>
        <div className="form-group" style={{ flex: 1, margin: 5}}>
        {mediaOptions.length > 0 &&
        <div>
        <legend>Media Options:</legend>
          <div className="Input_imgs_container">
          {mediaOptions.map((option, index) => (
              <div className="media-option" key={index}>
                <p className="type">Type: <b>{option.type}</b></p>
                <p className="quality">Quality: {option.quality}</p>
                <button className="download-btn" onClick={() => handleDownload(option.url, option.default_filename)}>Download</button>
              </div>
            ))}
      </div></div>
    }
        </div>
      </div>
  </div>
</div>


<div style={{ flex: 1, textAlign:'left', margin:'2.5rem', padding:'2rem'}}>
  
<h2 style={{ textAlign: 'center' }}>How To Download Video From Link (Youtube Videos) - All Steps</h2>
<p>
  <b>Step 1:</b> Enter the URL of the YouTube video or any other link in the "YouTube URL" field.
  <br /><br />
  <b>Step 2:</b> Click on the "Get Video/Audio" button.
  <br /><br />
  <b>Step 3:</b> Wait for the system to fetch the available media options for the provided URL.
  <br /><br />
  <b>Step 4:</b> Once the media options appear, you can see the type and quality of each option.
  <br /><br />
  <b>Step 5:</b> Click on the "Download" button next to the desired media option.
  <br /><br />
  <b>Step 6:</b> The video or audio file will start downloading. If it doesn't start automatically, a new tab or window will open with the file.
  <br /><br />
  <b>Step 7:</b> Enjoy your downloaded video or audio!
</p>
<br /><br />
<b>Congratulations! You have successfully downloaded your video or audio</b>


        </div>
        </div>
  );
};

export default VideoDownloadForm;
