import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setExcelFile(file);
      uploadFile(file.name);
    }
  };

  const uploadFile = async (name) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', excelFile);

      const response = await axios.post('http://localhost:3001/php/upload.php', formData, {
        onUploadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.total;

          const fileLoaded = Math.floor((loaded / total) * 100);

          // Update UI with progress information
          console.log(`File Upload Progress: ${fileLoaded}%`);
        },
      });

      console.log('File Upload Response:', response.data);

      setUploading(false);
    } catch (error) {
      setTypeError(`Error during file upload: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="wrapper">
      <header>File Uploader React</header>
      <form>
        <input
          type="file"
          name="file"
          className="file-input"
          onChange={handleFileChange}
        />
        <i className="fas fa-cloud-upload-alt"></i>
        <p>Browse File to Upload</p>
      </form>
      <section className="progress-area"></section>
      <section className={`uploaded-area ${uploading ? 'onprogress' : ''}`}></section>
    </div>
  );
};

export default FileUploader;
