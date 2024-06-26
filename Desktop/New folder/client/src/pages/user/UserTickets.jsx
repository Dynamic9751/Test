import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserTickets = () => {
  const { user_id } = useParams();
  const [userTickets, setUserTickets] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const getRole = () => {
		if (role === "9087-t1-vaek-123-riop") {
		  return "admin";
		} else if (role === "2069-t2-prlo-456-fiok") {
		  return "engineer";
		} else if (role === "4032-t3-raek-789-chop") {
		  return "user";
		}
	  };
  
  
  
  
  
  const getDisplayName = () => {
    switch (selectedFilter) {
      case "all":
        return "All Stock";
      case "Closed":
        return "Thane Stock";
      case "accepted":
        return "Vashi Stock";
      case "notAccepted":
        return "Ghansoli Stock";
      case "highprior":
        return "Airoli Stock";
      default:
        return "Unknown Stock"; // Default case if none of the above
    }
  };
  
  
  const calculateTimeDifference = (createdAt) => {
  const currentDate = new Date();
  const ticketDate = new Date(createdAt);
  const timeDifference = currentDate.getTime() - ticketDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Calculate difference in days
  return daysDifference;
};
  
  
  
  // console.log(userRole);
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`/api/${getRole()}/${user_id}/tickets`, {
          headers: {
            // Authorization: `Bearer ${cookies.token}`, // Include the token in the request headers
            "Content-Type": "application/json",
          },
          //   withCredentials: true,
        });

        const data = await res.data;
        if (data.status === 200) {
          setUserTickets(data.tickets);
        } else if (data.status === 403) {
          navigate("/unauthorized");
        } else {
          navigate("/unauthorized");
        }
      } catch (error) {
        navigate("/unauthorized");
      }
    };

    fetchTickets();
  }, [user_id, navigate]);

  const handleTicketClick = (ticketId) => {
    navigate(`/user/${user_id}/ticket_details/${ticketId}`);
  };

  const sortedTickets = userTickets.sort((a, b) => {
    if (a.resolved === b.resolved) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return a.resolved ? 1 : -1;
  });

  return (
    <div>
      <div className="p-4">
        {role === "9087-t1-vaek-123-riop" && (
          <div className="max-w-full mx-4 sm:mx-auto sm:px-6 lg:px-8">
            <div className="sm:flex sm:space-x-4">
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                <div className="bg-blue-100 p-5">
                  <div className="sm:flex sm:items-start">
                    <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                      <h3 className="text-base leading-6 font-medium text-black-400">
                        Total Stock.
                      </h3>
                      <p className="text-3xl font-bold text-black">
                        {userTickets.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              
			  
			  
			  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                <div className="bg-slate-100 p-5">
                  <div className="sm:flex sm:items-start">
                    <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                      <h3 className="text-base leading-6 font-medium text-black-400">
                        {getDisplayName()} {/* Dynamic display name based on selected filter */}
                      </h3>
                      <p className="text-3xl font-bold text-black">
                        {
                          userTickets.filter((ticket) => ticket.accepted === 0)
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
			  
			  
              
              
            </div>
          </div>
        )}
        <div className="grid grid-cols-12 justify-center items-center">
          <h2
            className={`text-3xl font-bold text-center mb-4 col-span-12 ${
              role !== "2069-t2-prlo-456-fiok" && "md:col-span-10"
            }`}
          >
            {role === "9087-t1-vaek-123-riop" ? (
              <span>Inventory</span>
            ) : (
              <span>My Tickets</span>
            )}
          </h2>
          {role !== "2069-t2-prlo-456-fiok" && (
            <select
              className="px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-12 md:col-span-2"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Stock</option>
			  <option value="Closed">Thane Stock.</option>
              <option value="accepted">Vashi Stock.</option>
              <option value="notAccepted">Ghansoli Stock.</option>
              <option value="highprior">AIROLI Stock.</option>
            </select>
          )}
        </div>

        {userTickets.length === 0 ? (
          <p className="text-lg text-center">
            {role === "9087-t1-vaek-123-riop"
              ? "No one has created any tickets, what a surprise! Either the systems are working really well, or not at all!"
              : role === "2069-t2-prlo-456-fiok"
              ? "You have not been assigned any tickets yet"
              : "You have not created any tickets yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-blue-500 text-white">
                  
                    <th className="py-2 px-4">
                      <h3 className="text-lg font-bold">MODEL</h3>
                    </th>
                  
                  <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">COLOUR</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">CHASSIS NO</h3>
                  </th>
				  
				 
                  
                  <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">ENGINE NO</h3>
                  </th>
                  
                    <>
                      <th className="py-2 px-4">
                        <h3 className="text-lg font-bold">DEALER</h3>
                      </th>
                      
                    </>
                  
                  
                  
                    <th className="py-2 px-4">
                      <h3 className="text-lg font-bold">SALE DATE</h3>
                    </th>
					 
				  
				   <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">Delivery Date
</h3>
                  </th>
				  
				  
				   <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">Customer Name
</h3>
                  </th>
				  
				  
				  <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">Final Status
</h3>
                  </th>
                  
				  <th className="py-2 px-4">
                    <h3 className="text-lg font-bold">Date of allotment
</h3>
                  </th>
				  
				  
				  
                </tr>
              </thead>
              <tbody>
                {sortedTickets
                  .filter((ticket) => {
                    if (selectedFilter === "accepted") {
                      return ticket.accepted === 1;
                    }  else if (selectedFilter === "notAccepted") {
                      return ticket.accepted === 0;
                    } else if (selectedFilter === "resolved") {
                      return ticket.resolved === "No";
                    } else if (selectedFilter === "highprior") {
                      return ticket.priority === "high";
                    } else if (selectedFilter === "unassigned") {
                      return ticket.assignedEngineer === "";
                    }
                    return true;
                  })
                  .map((ticket) => (
                    
					<tr
                     key={ticket.id}
                     onClick={() => handleTicketClick(ticket.id)}
                       className={
                           ticket.resolved
                              ? "bg-green-200 cursor-pointer border-b-2 border-slate-400 border-dashed font-semibold "
                              : (ticket.createdAt && calculateTimeDifference(ticket.createdAt) === 0)
                              ? "bg-white cursor-pointer border-b-2 border-gray-400 border-dashed font-bold"
                              : (ticket.createdAt && calculateTimeDifference(ticket.createdAt) <= 2)
                              ? "bg-red-400 cursor-pointer border-b-2 border-gray-400 border-dashed font-bold"
                              : "bg-red-800 cursor-pointer border-b-2 border-gray-400 border-dashed font-bold text-white"
                                  }
                    >
                      
                        <td className="py-2 px-4 text-center">{ticket.model}</td>
                    
                      <td className="py-2 px-4 text-center">{ticket.colour}</td>
                      <td className="py-2 px-4 text-center">
                        {ticket.chassisNo}
                      </td>
					  <td className="py-2 px-4 text-center">
                        {ticket.engineNo}
                      </td>
                      
                      <td className="py-2 px-4 text-center">
                        {ticket.ChassisNO1}
                      </td>
                     <td className="py-2 px-4 text-center">
                        {ticket.landlineNumber}
                      </td>
					  <td className="py-2 px-4 text-center">
                        {ticket.SaleDate}
                      </td>
					  <td className="py-2 px-4 text-center">
                        {ticket.SaleDate}
                      </td>
					  <td className="py-2 px-4 text-center">
                        {ticket.SaleDate}
                      </td>
					  <td className="py-2 px-4 text-center">
                        {ticket.SaleDate}
                      </td>
                      
						
                      
					  
					  
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTickets;
