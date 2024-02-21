import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function App() {
  const [excelType, setExcelType] = useState(null);
  const [excelName, setExcelName] = useState(null);
  const [excelSize, setExcelSize] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [typeSuccess, setTypeSuccess] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [yoe, setYoe] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [password, setPassword] = useState(null);
  
  const [techs, setTech] = useState('');
  const [techStacks, setTechStacks] = useState(["Techs like"]);

  const handleNameChange = (event) => {
	  setName(event.target.value);// To fetch the input values
  }
  const handleEmailChange = (event) => {
	  setEmail(event.target.value);
  }
  const handleYoeChange = (event) => {
	  setYoe(event.target.value);
  }
  const handleCurrentCompanyChange = (event) => {
	  setCurrentCompany(event.target.value);
  }
  const handlePasswordChange = (event) => {
	  setPassword(event.target.value);
  }
  const handleTechStackChange = (e) => {
    setTech(e.target.value);
  }
  const handleAddTechStack = (e) => {
    setTechStacks([...techStacks, techs]); // Add a new empty tech stack input box
    setTech('');
  };
  const handleRemoveTechStack = (ind) => {
    const updatedTechStacks = [...techStacks];
    updatedTechStacks.splice(ind, 1);
    setTechStacks(updatedTechStacks);
  }
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
          const response = await axios.post("https://expressflash.onrender.com/uploadResume", formData);
          if (response.status) {
            setTypeSuccess('Resume file uploaded successfully!');
          } else {
            console.error('Failed to upload resume file.');
          }
        }
      }catch(error){
        setTypeError('Error during file upload:', error);
      }
    }
    
  const uploadExcel = async () => {
    return new Promise((resolve,reject) => {
      try {
      if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: 'buffer' });
        const workSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[workSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        if (data && data.length > 0) {
          const excelDataArray = data.map((individualExcelData) => {
            const { company_name, email_of_employees, role} = individualExcelData;
            if (company_name && email_of_employees && role) {
              return {
                company_name,
                email_of_employees,
                role,
              }
            }
            return null;// To Skip invalid/Incomplete data rows
          });
          resolve(excelDataArray);
        }
      } else {
        setTypeError('Null excelFile found');
        reject('Null excelFile found');
      }
    } catch (error) {
      setTypeError(`Error during file upload: ${error}`);
      reject("Error: " + error);
    }
  });
  };
  
  const uploadTechStack = async () => {
    const nonEmptyTechStacks = techStacks.filter((tech) => tech.trim() !== '');
    setTechStacks(nonEmptyTechStacks);
  }

  const uploadDetailsToServer = async (excelData) => {
    console.log(excelData);
    if (excelData) {
      // Send all Excel data to the server in a single request
      await axios.post('https://expressflash.onrender.com/excelUpload', {
        excelData,
        name:name,
        password: password,
        senderMail: email,
        yoe: yoe,
        currentCompany: currentCompany,
        techStack: techStacks,
      });
    setTypeSuccess('Data sent successfully');
    }
  }
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const promise = uploadResume();// then Excel makes call to server, and sends mail data.
    promise
    .then(() =>{
      return uploadTechStack()
    })
    .then((loadedData) =>{
      return uploadExcel(loadedData)
    })
    .then((loadedData) =>{
      return uploadDetailsToServer(loadedData)
    })
    .catch((error) => {
      // Handle errors, if any, across the entire chain
      console.error('Error:', error);
    });
  };
  return (
    <div className="wrapper">
      <h2 style={{color:"green",textAlign:"center"}}>Upload & View Excel Sheets</h2>
      <br></br>
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
      
      <div className="" htmlFor="password-upload">
        <label>App Password</label>
      </div>
      <div className="form-beautify">
          <input
            type="password"
            name="password"
            className="password-upload"
            placeholder="PASSWORD.."
            onChange={handlePasswordChange}
          />
      </div>
      <div className="" htmlFor="name-upload">
        <label>Name</label>
      </div>
      <div className="form-beautify">
          <input
            type="text"
            name="name"
            className="name-upload"
            placeholder="Your Name.."
            onChange={handleNameChange}
          />
      </div>
      <div className="" htmlFor="email-upload">
        <label>Email</label>
      </div>
      <div className="form-beautify">
          <input
            type="email"
            name="email"
            className="email-upload"
            placeholder="Your Email.."
            onChange={handleEmailChange}
          />
      </div>
      <div className="" htmlFor="yoe-upload">
        <label>Years Of Experience</label>
      </div>
      <div className="form-beautify">
          <input
            type="number"
            name="yoe"
            className="yoe-upload"
            placeholder="Years Of Experience.."
            onChange={handleYoeChange}
          />
      </div>
      <div className="" htmlFor="currentCompany-upload">
        <label>Current Company</label>
      </div>
      <div className="form-beautify">
        <input
          type="text"
          name="currentCompany"
          className="currentCompany-upload"
          placeholder="Current Company.."
          onChange={handleCurrentCompanyChange}
        />
      </div>

      <div className="" >
        <label htmlFor="techStack-upload">Tech Stacks</label>
      </div>
      <div className="techStack-beautify">
        <input 
        type="text" 
        id="techStack-upload" 
        value={techs} 
        placeholder='Add'
        onChange={handleTechStackChange}/>
        <div className="label-container" onClick={handleAddTechStack}>
        + Add Tech Stack
        </div>
      </div>
      
      <div className=".text-box">
        {techStacks.slice(1).map((tech, index) => (
            <TextBox
              key={index}
              index={index + 1}
              tech={tech}
              onChange={handleTechStackChange}
            />
        ))}
      </div>


      <div className="upload-container">
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
        </div>
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
        <input
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
            </p> 
        <button type="submit" className="btn btn-success btn-lg">
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
        {typeSuccess && (
          <div className="alert alert-success" role="alert">
            {typeSuccess}
          </div>
        )}
      </form>
      
    </div>
  );
  function TextBox({ index, tech }) {
    return (
      <div className={`text-box ${index % 2 === 0 ? 'even' : 'odd'}`}>
        <div className="textbox-container">{tech}
        <button onClick={() => handleRemoveTechStack(index)}>X</button>
        </div>
      </div>
    );
  }
}

export default App;