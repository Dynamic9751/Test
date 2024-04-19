import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextModal from "../../components/TextModal";
// import CreateUpdateTicket from "../../components/CreateUpdateTicket";

const ViewTicketDetails = () => {
  const { user_id } = useParams();
  const { ticket_id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({}); //the ticket whose info is printed
  const [status, setStatus] = useState(ticket.resolved);
  const [showModal, setShowModal] = React.useState(false); //to hide or show assign engineer modal
  const [engineerId, setEngineerId] = useState(""); //id passed to backend
  const [engineerName, setEngineerName] = useState(""); //used for frontend
  const [engineerInfo, setEngineerInfo] = useState([]); //passed to autocomplete
  const [nameForAE, setNameForAE] = useState(""); //to show name of assigned engineer on page load
  const [selectedPriority, setSelectedPriority] = useState("set priority"); //to set the priority of the ticket in the backend
  const [selectedProblem, setSelectedProblem] = useState("set Problem");
  const [selectedServiceType, setSelectedServiceType] =
    useState("set ServiceType");
  const [selectedAMC, setSelectedAMC] = useState("set AMC");
  const [showLogs, setShowLogs] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [updateTicket, setUpdateTicket] = useState(false);
  const [partName, setPartName] = useState("");
  const [department, setDepartment] = useState("");

  const userRole = localStorage.getItem("role");
  const getRole = () => {
  switch (userRole) {
    case "9087-t1-vaek-123-riop":
      return "admin";
    case "2069-t2-prlo-456-fiok":
      return "engineer";
    case "4032-t3-raek-789-chop":
      return "user";
    case "5001-t4-maek-101-znop":
      return "manager";
    case "6002-t5-saek-202-kiop":
      return "supervisor";
    case "7003-t6-laek-303-jiop":
      return "analyst";
    }
  };
  
  
    const handlePartNameChange = (e) => {
    setPartName(e.target.value);
  };
  

  //initial useEffect to fetch all the tickets
  useEffect(() => {
    let isMounted = true;

    const fetchTicketDetails = async () => {
      try {
        const res = await axios.get(`/api/user/${user_id}/ticket/${ticket_id}`);
        const ticket = await res.data.ticket;

        if (isMounted) {
          //remove this unnecessary line of code
          setTicket(ticket);
          setStatus(ticket.resolved);
        }
      } catch (error) {
        // Handle error
        console.log(error);
      }
    };

    fetchTicketDetails();

    return () => {
      isMounted = false;
    };
  }, [user_id, ticket_id]);

  //for loading the engineer name on page load, so that it can be used to show engineer name in assignedEngineer field.
  useMemo(() => {
    const fetchEngineers = async () => {
      try {
        const res = await axios.get(
          `/api/admin/${user_id}/engineers`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        const data = await res.data;
        if (data.status === 200) {
          const engineerList = data.engineers;
          const engineerInfoScope = engineerList.map((engineer) => [
            engineer.name,
            engineer.userId,
          ]);
          setEngineerInfo(engineerInfoScope);
          const assignedEngineerToSet = engineerInfo.find(
            (engineer) => engineer[1] === ticket.assignedEngineer
          );

          const assignedEngineerName = assignedEngineerToSet
            ? assignedEngineerToSet[0]
            : null;
          // console.log("engineers fetched");
          setNameForAE(assignedEngineerName);
          // console.log("fetchEngineersFirst was run!");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchEngineers();
  }, [ticket]);

  useEffect(() => {
    const updateResolvedStatus = async () => {
      try {
        await axios.put(
          `/api/user/${user_id}/ticket/${ticket_id}/update`,
          {
            resolved: status,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        // console.log("update status run!");
      } catch (error) {
        console.error(error);
      }
    };

    updateResolvedStatus();
  }, [status, user_id, ticket_id]);

  const handleAssignEngineer = async () => {
    setShowModal(true);
    try {
      const res = await axios.get(
        `/api/admin/${user_id}/engineers`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await res.data;
      if (data.status === 200) {
        const engineerList = data.engineers;
        const engineerInfoScope = engineerList.map((engineer) => [
          engineer.name,
          engineer.userId,
        ]);
        setEngineerInfo(engineerInfoScope);
        // console.log(JSON.parse(localStorage.getItem("engineers")));
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  
  const handleSubmitPartName = async () => {
  try {
    const res = await axios.put(
      `/api/admin/${user_id}/ticket/${ticket_id}/update_partName`, // Update the endpoint
      {
        partName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${cookies.token}`,
        },
      }
    );
    const data = await res.data;
    if (data.status === 200) {
      toast.success(`The part name has been set to ${partName}. Refresh page to see changes.`);
      // Optionally, clear the partName state after successful submission
      setPartName("");
    }
  } catch (err) {
    console.log(err);
  }
};

  
  
  

  const handleInputChange = (value) => {
    setEngineerId(value[1]);
    setEngineerName(value[0]);
  };

  const setEngineer = async () => {
    setShowModal(false);
    try {
      const res = await axios.put(
        `/api/admin/${user_id}/ticket/${ticket_id}/set_engineer`,
        {
          engineerId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await res.data;
      if (data.status === 200) {
        toast.success(
          `The ticket has been assigned to ${engineerName}. Refresh page to see changes.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const acceptTicket = async () => {
    try {
      const res = await axios.put(
        `/api/admin/${user_id}/ticket/${ticket_id}/accept_ticket`
      );
      const data = await res.data;
      if (data.status === 200) {
        toast.success(
          `The ticket has been accepted. Refresh page to see changes.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const priorityFunc = async (e) => {
    setSelectedPriority(e.target.value);
    try {
      const res = await axios.put(
        `/api/admin/${user_id}/ticket/${ticket_id}/set_priority`,
        {
          priority: e.target.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await res.data;
      if (data.status === 200) {
        toast.success(
          `The priority has been set to ${e.target.value}. Refresh page to see changes.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ProblemFunc = async (e) => {
    setSelectedProblem(e.target.value);
    try {
      const res = await axios.put(
        `/api/admin/${user_id}/ticket/${ticket_id}/set_Problem`,
        {
          Problem: e.target.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await res.data;
      if (data.status === 200) {
        toast.success(
          `The Problem has been set to ${e.target.value}. Refresh page to see changes.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ServiceTypeFunc = async (e) => {
    setSelectedServiceType(e.target.value);
    try {
      const res = await axios.put(
        `/api/admin/${user_id}/ticket/${ticket_id}/set_ServiceType`,
        {
          ServiceType: e.target.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await res.data;
      if (data.status === 200) {
        toast.success(
          `The ServiceType has been set to ${e.target.value}. Refresh page to see changes.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const AMCFunc = async (e) => {
    setSelectedAMC(e.target.value);
    try {
      const res = await axios.put(
        `/api/admin/${user_id}/ticket/${ticket_id}/set_AMC`,
        {
          AMC: e.target.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await res.data;
      if (data.status === 200) {
        toast.success(
          `The AMC has been set to ${e.target.value}. Refresh page to see changes.`
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendTextMessage = async () => {
    setShowLogs(false);
    if (textMessage !== "") {
      try {
        const res = await axios.put(
          `/api/${getRole()}/${user_id}/ticket/${ticket_id}/add_message`,
          {
            userRole,
            textMessage,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${cookies.token}`,
            },
          }
        );
        const data = await res.data;
        if (data.status === 200) {
          toast.success("Your comment has been added. Refresh to see changes.");
        }
      } catch (err) {
        toast.error(err);
      }
    }
  };

  const deleteFunc = async () => {
    try {
      const res = await axios.delete(
        `/api/admin/${user_id}/ticket/${ticket_id}/delete_ticket`
      );
      const data = await res.data;
      if (data.status === 200) {
        navigate(`/user/${user_id}/tickets`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-200">
        <div className="w-full max-w-md mx-4 my-8 border-2 border-blue-500 border-dotted rounded-lg shadow-lg bg-slate-100">
          <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">
              Ticket Details
            </h2>
            <div className="space-y-4">
			{(userRole === "9087-t1-vaek-123-riop" || role === "5001-t4-maek-101-znop") && (
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Company Name: </span>
                <span className="ml-2 text-gray-700">{ticket.colour}</span>
              </div>
			  )}
			  {(userRole === "9087-t1-vaek-123-riop" || role === "4032-t3-raek-789-chop") && (
              <div className="flex items-center">
                <span className="font-bold text-blue-800">
                  Created / Reported By:{" "}
                </span>
                <span className="ml-2 text-gray-700">{ticket.name}</span>
              </div>
			  )}
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Phone: </span>
                <span className="ml-2 text-gray-700">{ticket.phoneNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">
                  Location:{" "}
                </span>
                <span className="ml-2 text-gray-700">
                  {ticket.landlineNumber}
                </span>
              </div>
			   <div className="flex items-center">
                <span className="font-bold text-blue-800">
                  Department:{" "}
                </span>
                <span className="ml-2 text-gray-700">
                  {ticket.department}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Issue: </span>
                <span className="ml-2 text-gray-700">{ticket.issue}</span>
              </div>
			  
			  
			  <div className="flex items-center">
                <span className="font-bold text-blue-800">Loaction: </span>
                <span className="ml-2 text-gray-700">{ticket.location}</span>
              </div>

              <div className="flex items-center">
                <span className="font-bold text-blue-800">Channel: </span>
                <span className="ml-2 text-gray-700">{ticket.channel}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Created At: </span>
                <span className="ml-2 text-gray-700">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Ticket Status: </span>
                <span
                  className={`ml-2 text-gray-700 ${
                    status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status ? "Resolved" : "Unresolved"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Priority: </span>
                <span className="ml-2 text-gray-700">{ticket.priority}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Call status: </span>
                <span className="ml-2 text-gray-700">{ticket.Problem}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Service Type: </span>
                <span className="ml-2 text-gray-700">{ticket.ServiceType}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">AMC: </span>
                <span className="ml-2 text-gray-700">{ticket.AMC}</span>
              </div>
			  <div className="flex items-center">
                <span className="font-bold text-blue-800">Part Name: </span>
                <span className="ml-2 text-gray-700">{ticket.partName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-800">Accepted?: </span>
                <span className="ml-2 text-gray-700">
                  {ticket.accepted === 1 ? "Yes" : "No"}
                </span>
              </div>
              {userRole !== "2069-t2-prlo-456-fiok" && (
                <div className="flex items-center">
                  <span className="font-bold text-blue-800">Assigned To: </span>
                  <span className="ml-2 text-gray-700">
                    {ticket.assignedEngineer ? nameForAE : "Not Assigned"}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span className="font-bold text-blue-800">User Remarks: </span>
                <span className="ml-2 text-gray-700">{ticket.remarks}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 py-4 border-t border-gray-300">
            <button
              className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => setStatus(!status)}
            >
              {status ? "Mark Unresolved" : "Mark Resolved"}
            </button>
            {userRole === "9087-t1-vaek-123-riop" && (
              <button
                onClick={handleAssignEngineer}
                className="px-6 py-2 text-white bg-teal-500 rounded hover:bg-teal-600"
              >
                Assign Engineer
              </button>
            )}
          </div>
          {userRole === "9087-t1-vaek-123-riop" && (
            <div className="flex justify-center gap-3 pb-4">
              {ticket.accepted === 0 && (
                <button
                  onClick={acceptTicket}
                  className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                  Accept Ticket
                </button>
              )}
              <select
                className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                value={selectedPriority}
                onChange={priorityFunc}
              >
                <option value="set priority" disabled>
                  Set Priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                value={selectedProblem}
                onChange={ProblemFunc}
              >
                <option value="Call status.">Call Status.</option>
                <option value="Closed.">Closed.</option>
                <option value="Assigned.">Assigned.</option>
                <option value="Open.">Open.</option>
                <option value="Customer pending.">Customer pending.</option>
                <option value="Part Pending.">Part Pending.</option>
                <option value="Repair Pending.">Repair Pending.</option>
                <option value="Dispatch Pending.">Dispatch Pending.</option>
                <option value="Vendor Pending.">Vendor Pending.</option>
                <option value="Under Testing.">Under Testing.</option>
                <option value="Under Observation.">Under Observation.</option>
              </select>
            </div>
          )}

          {userRole === "9087-t1-vaek-123-riop" && (
            <div className="flex justify-center gap-2 mb-4">
              <select
                className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                value={selectedServiceType}
                onChange={ServiceTypeFunc}
              >
                <option value="ServiceType.">ServiceType.</option>
                <option value="Visit.">Visit.</option>
                <option value="Online.">Online.</option>
              </select>

              <select
                className="col-span-12 px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                value={selectedAMC}
                onChange={AMCFunc}
              >
                <option value="AMC">ServiceType.</option>
                <option value="In AMC.">In AMC</option>
                <option value="Not in AMC.">Not in AMC</option>
              </select>
            </div>
          )}

          <div className="flex justify-center gap-2 mb-4">
             {userRole === "9087-t1-vaek-123-riop" && (
        <div className="flex justify-center gap-2 mb-4">
          <input
            required
            type="text"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Part Name."
            value={partName}
            onChange={handlePartNameChange} // Attach event handler for input change
            autoComplete="username"
          />

          <button
            type="button" // Ensure it's a button type, not submit
            className="w-40 px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={handleSubmitPartName} // Attach function for handling submission
          >
            Submit
          </button>
        </div>
      )}
	  
	  
	  
          </div>

          <div className="flex-col mb-4">
            {userRole === "9087-t1-vaek-123-riop" && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={deleteFunc}
                  className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete Ticket
                </button>
                <button
                  className="px-6 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-800"
                  onClick={() => setUpdateTicket(true)}
                >
                  Update Ticket
                </button>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowLogs(true)}
                className="px-6 py-2 text-white bg-teal-500 rounded hover:bg-emerald-600"
              >
                Show Logs
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[50vh] max-h-[50vh]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                  <h3 className="text-3xl font-semibold">Type Engineer Name</h3>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-4 overflow-y-auto">
                  <Autocomplete
                    suggestions={engineerInfo}
                    setEngineerId={handleInputChange}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                  <button
                    className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={setEngineer}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
      {showLogs ? (
        <>
          <TextModal
            ticket={ticket}
            onClose={() => setShowLogs(false)}
            onAddMessage={sendTextMessage}
            textMessage={textMessage}
            setTextMessage={setTextMessage}
          />
        </>
      ) : null}
      {updateTicket ? (
        <CreateUpdateTicket setUpdateTicket={setUpdateTicket} ticket={ticket} />
      ) : null}
    </>
  );
};

export default ViewTicketDetails;
