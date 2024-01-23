import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function App() {
  const [excelType, setExcelType] = useState(null);
  const [excelName, setExcelName] = useState(null);
  const [excelSize, setExcelSize] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const handleExcelChange = (e) => {
    const fileTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];

    const selectedExcel = e.target.files[0];

    setExcelName(selectedExcel.name);
    setExcelType(selectedExcel.type);
    setExcelSize(selectedExcel.size);

    if (selectedExcel) {
      if (fileTypes.includes(selectedExcel.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedExcel);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    } else {
      console.log('Please select your file');
    }
  };

const handleResumeChange = (e) => {

  if (e.target.files && e.target.files.length > 0) {
    setResumeFile(e.target.files[0]);
  } else {
    console.log("No file selected");
  }
  };

  const uploadResume = async () => {
      try {
        if (resumeFile) {
          const formData = new FormData();
          formData.append('resume', resumeFile);
          const response = await axios.post("http://localhost:3001/uploadResume", formData);
          if (response.ok) {
            console.log('Resume file uploaded successfully!');
          } else {
            console.error('Failed to upload resume file.');
          }
        }
      }catch(error){
        setTypeError('Error during file upload:', error);
      }
    }

  const uploadExcel = async () => {
    try {
      if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: 'buffer' });
        const workSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[workSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(data.slice(0, 10));

        if (data && data.length > 0) {
          data.forEach((individualExcelData) => {
            const { company_name, email_of_employees, role } = individualExcelData;
            if (company_name && email_of_employees && role) {
              mailParams(company_name, email_of_employees, role);
            }
          });
        }
      } else {
        setTypeError('Null excelFile found');
      }
    } catch (error) {
      setTypeError(`Error during file upload: ${error}`);
    }
  };

  const mailParams = async (company_name, email_of_employees, role) => {
    try {
      const response = await axios.post('http://localhost:3001', {
        company_name,
        email_of_employees,
        role,
      });
      console.log(response.status);
    } catch (error) {
      setTypeError(`Error sending data to backend: ${error}`);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    await uploadResume();
    await uploadExcel();
  };

  return (
    <div className="wrapper">
      <h3>Upload & View Excel Sheets</h3>
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <label htmlFor="excel-upload" className="upload-btn">
          <span>Select Excel</span>
        </label>
        <input
          type="file"
          id="excel-upload"
          className="hidden"
          required
          onChange={handleExcelChange}
        />
        <div className="alert alert-info">
          <div>
            <h3>Excel Details</h3>
          </div>
          <div>
            <li>{excelType}</li>
          </div>
          <div>
            <li>{excelName}</li>
          </div>
          <div>
            <li>{excelSize}</li>
          </div>
        </div>
        <input
              type="file"
              id="resume-upload"
              // className="hidden"
              accept=".pdf, .doc, .docx"
              required
              onChange = {handleResumeChange}
            />
            <p className="file-name">
              {resumeFile
                ? `Selected file: ${resumeFile.name}`
                : 'No file selected'}
            </p> 
        <button type="submit" className="btn btn-success btn-lg">
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>
      <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[1]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </div>
    </div>
  );
}

export default App;