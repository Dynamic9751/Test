import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const CreateUserTicket = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();

  // States for form fields
  
 
  
  const [colour, setcolour] = useState("");
  const [model, setmodel] = useState("");
  const [engineNo, setengineNo] = useState("");
  const [chassisNo, setchassisNo] = useState("");
  

  // State for file upload
  const [file, setFile] = useState(null);

  // State for submission status
  // const [status, setStatus] = useState(null);

  
  const [inputType, setInputType] = useState('single'); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      console.log(json);
      toast.success('File successfully processed. Data logged to console.');
    } catch (error) {
      toast.error('Error processing the file.');
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  // Base URL of your API
  const baseURL = `/api/user/${user_id}`;

  if (inputType === 'bulk') {
    // Handle file upload for bulk entries
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${baseURL}/bulkcreateticket`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Bulk tickets have been successfully created.');
        navigate(`/user/${user_id}/tickets`);
      } else {
        toast.error('An error occurred.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while uploading the file.');
    }
  } else {
    
    const newComplaint = {
      colour: colour || "",
     // createdAt: currentDate.toISOString(),
      priority: "low",
	  Problem: "None.",
	  ServiceType: "",
      assignedEngineer: "",
	  model: model || "",
	  chassisNo: chassisNo || "",
	  engineNo: engineNo || "",
    };

    try {
      const response = await axios.post(`${baseURL}/createticket`, newComplaint, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Your ticket has been successfully created.');
        navigate(`/user/${user_id}/tickets`);
      } else {
        toast.error('An error occurred.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating your ticket.');
    }
  }
  
  
  

  // Reset form fields and file state
   
    setcolour("");
	setmodel("");
	setchassisNo("");
	setengineNo("");
};

  return (
    <>
      <div className="flex flex-col items-center pt-10 lg:pt-20 min-h-screen">
        {status === "error" ? (
          <div className="text-red-500">
            You are not authorized to access this page.
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-8">
              Add Details of Bikes.
            </h2>
            <div className="mb-4">
              <label htmlFor="inputType">Add Details:</label>
              <select
                id="inputType"
                className="ml-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputType}
                onChange={(e) => setInputType(e.target.value)}
              >
                <option value="single">Single</option>
                <option value="bulk">Bulk</option>
              </select>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {inputType === 'single' && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     
     <input
                  required
                  type="text"
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Colour"
                  value={colour}
                  onChange={(e) => setcolour(e.target.value)}
                />
				<input
                  required
                  type="text"
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Model"
                  value={model}
                  onChange={(e) => setmodel(e.target.value)}
                />
				<input
                  required
                  type="text"
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CHASSIS NO"
                  value={chassisNo}
                  onChange={(e) => setchassisNo(e.target.value)}
                />
				<input
                  required
                  type="text"
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ENGINE NO"
                  value={engineNo}
                  onChange={(e) => setengineNo(e.target.value)}
                />
	  
	  
	 
	  
    </div>
    
    
    
  </>
)}





              {inputType === 'bulk' && (
                <div>
                  <input
                    type="file"
					accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					onChange={handleFileChange}
					
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-40"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateUserTicket;