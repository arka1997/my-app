import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
// handleExcel Method Steps:
// 1) Declaring different types of Extensions and storing them in a Array
// 2) Then the file is fetched using 'e.target.files[0]'.
// 3) Then'type' of file is searched in above 'type' ArrayList, that is being uploaded by me
// 4) If found, then declaring a FileReader, and reading the data of Excel and convert into ArrayBuffer(a raw binary data buffer) by calling readAsArrayBuffer() method of FileReader
// 5) When we have read the file completely, then we load them using onload
// Mailer Video: https://www.youtube.com/watch?v=tDjTun-_ZTU

function App() {
  const [excelType, setExcelType] = useState(null);
  const [excelName, setExcelName] = useState(null);
  const [excelSize, setExcelSize] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  // const [resumeFile, setResumeFile] = useState(null);

  const handleExcelChange = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedExcel = e.target.files[0];

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
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };


  // const handleResumeChange = (e) => {
    
  // if (e.target.files && e.target.files.length > 0) {
  //   setResumeFile(e.target.files[0]);
  // } else {
  //   console.log("No file selected");
  // }
  // };

  // const uploadResume = async (e) => {
  //   console.log(e);
  // }

  const uploadExcel = async (e) => {
    
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" }); // Reading the arrayBuffer to get the excel info from Binary to some format

      const workSheetName = workbook.SheetNames[0]; // Here an Excel contains sub-sheets inside it, so picking the first one

      const worksheet = workbook.Sheets[workSheetName]; //Fetching only the sheet with name that is passed in param

      const data = XLSX.utils.sheet_to_json(worksheet); // Converting it to JSON readable format

      setExcelData(data.slice(0, 10)); // Slicing basically means cutting a small portion from the big shunk, and showing in UI
      Object.keys(excelData[1]).forEach((key) => console.log(key)); // To print the keys or Header of an Excel. Click upload twice, as first, null is returned that shows error, so in the second render, the values are thrown

      excelData.map((individualExcelData, index) => {
        mailParams(
          individualExcelData.company_name,
          individualExcelData.email_of_employees
        );
      });
    }
  }
  // submit event
  const handleFileSubmit = async () => {
    try{
      if(excelFile){
        await uploadExcel(excelFile);
        console.log('Both files uploaded successfully:', excelFile.name);
      }
      // const [uploadedExcel, uploadedResume] = await Promise.all([
      //   excelFile && uploadExcel(excelFile),
      //   resumeFile && uploadResume(resumeFile),
      // ])
      // console.log('Both files uploaded successfully:', uploadedExcel, uploadedResume);
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };
  const mailParams = async (e, e2) => {
    try {
      // send data to backend
      const arr = [];
      arr.push(e);
      arr.push(e2);
      const response = await axios.post("http://localhost:3001", arr);
      console.log(response);
    } catch (error) {
      console.error(" Error sending data to backend", error);
    }
  };
  

  return (
    <div className="wrapper">
      <h3>Upload & View Excel Sheets</h3>
      
      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
          <label htmlFor="excel-upload" className="upload-btn">
            <span>Select Excel</span>
          </label>
          <input
            type="file"
            id="excel-upload"
            className="hidden"
            required
            onChange = {handleExcelChange}
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
            <label htmlFor="resume-upload" className="upload-btn">
              <span>Select Resume</span>
            </label>
            {/* <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf, .doc, .docx"
              required
              onChange = {handleResumeChange}
            />
            <p className="file-name">
              {resumeFile
                ? `Selected file: ${resumeFile.name}`
                : 'No file selected'}
            </p> */}
          
        <button type="submit" className="btn btn-success btn-lg">
          UPLOAD
        </button>
        
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>

      {/* view data */}
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
