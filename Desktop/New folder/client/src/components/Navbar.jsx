import axios from "axios";
import React from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import scrollTopImage from './Vihaan-Honda.png';

const Navbar = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  const getTicketExport = async (duration) => {
    const res = await axios.get(`/api/admin/${user_id}/export_tickets`, {
      params: { duration: duration },
      responseType: "blob",
      headers: {
        // Authorization: `Bearer ${cookies.token}`, // Include the token in the request headers
        "Content-Type": "application/json",
      },
    });
    const contentDisposition = res.headers["content-disposition"];
    const filename = contentDisposition.split("=")[1].trim();

    const csvData = new Blob([res.data], { type: "text/csv" });
    const downloadUrl = URL.createObjectURL(csvData);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${filename}`; // Get the formatted date as the filename
    link.click();

    // Cleanup
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <header className="text-gray-600 body-font shadow-lg rounded-xl bg-slate-50">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
        <Link to="/">
          <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img
              src={scrollTopImage}
              fill="none"
              stroke="currentColor"
			  alt="Scroll Top"
              strokeLinecap="round"
              strokeWidth="2"
              strokeLinejoin="round"
              className="w-10 h-10 rounded-full"
              viewBox="0 0 0 0"
            />	

            <span className="ml-2 text-xl">Vihaan Enterprise</span>
          </div>
        </Link>
        {location.pathname === "/" ? (
          <>
            <div>
              {localStorage.getItem("li") ? (
                // If user is logged in
                <>
                  <nav className="flex gap-5">
                    <button
                      onClick={() => {
                        navigate(
                          `/user/${localStorage.getItem("uid")}/tickets`
                        );
                      }}
                      className="inline-flex items-end bg-blue-200 border-0 py-1 px-3 focus:outline-none hover:bg-slate-100 rounded text-base mt-4 md:mt-0"
                    >
                      Show Tickets
                      <svg
                        className="svg-icon w-4 h-4 ml-1 flex-shrink-0"
                        viewBox="0 0 20 20"
                      >
                        <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5ZM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5h-13Z" />{" "}
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        fetch("/api/auth/logout");
                        localStorage.removeItem("role");
                        localStorage.removeItem("li");
                        localStorage.removeItem("uid");
                        navigate("/login");
                      }}
                      className="inline-flex items-center bg-red-100 border-0 py-1 px-3 focus:outline-none hover:bg-slate-100 rounded text-base mt-4 md:mt-0"
                    >
                      Logout
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4 ml-1"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </nav>
                </>
              ) : (
                // If user is logged out
                <>
                  <nav className="flex gap-5">
                    <button
                      onClick={() => {
                        navigate(`/login`);
                      }}
                      className="inline-flex items-center bg-green-300 border-0 py-1 px-3 focus:outline-none hover:bg-slate-100 rounded text-base mt-4 md:mt-0"
                    >
                      Login
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="svg-icon w-4 h-4 ml-1 flex-shrink-0"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        navigate(`/register`);
                      }}
                      className="inline-flex items-center bg-cyan-100 border-0 py-1 px-3 focus:outline-none hover:bg-slate-100 rounded text-base mt-4 md:mt-0"
                    >
                      Sign Up
                      <svg
                        className="svg-icon w-4 h-4 ml-1 flex-shrink-0"
                        viewBox="0 0 20 20"
                      >
                        <path d="M15.573,11.624c0.568-0.478,0.947-1.219,0.947-2.019c0-1.37-1.108-2.569-2.371-2.569s-2.371,1.2-2.371,2.569c0,0.8,0.379,1.542,0.946,2.019c-0.253,0.089-0.496,0.2-0.728,0.332c-0.743-0.898-1.745-1.573-2.891-1.911c0.877-0.61,1.486-1.666,1.486-2.812c0-1.79-1.479-3.359-3.162-3.359S4.269,5.443,4.269,7.233c0,1.146,0.608,2.202,1.486,2.812c-2.454,0.725-4.252,2.998-4.252,5.685c0,0.218,0.178,0.396,0.395,0.396h16.203c0.218,0,0.396-0.178,0.396-0.396C18.497,13.831,17.273,12.216,15.573,11.624 M12.568,9.605c0-0.822,0.689-1.779,1.581-1.779s1.58,0.957,1.58,1.779s-0.688,1.779-1.58,1.779S12.568,10.427,12.568,9.605 M5.06,7.233c0-1.213,1.014-2.569,2.371-2.569c1.358,0,2.371,1.355,2.371,2.569S8.789,9.802,7.431,9.802C6.073,9.802,5.06,8.447,5.06,7.233 M2.309,15.335c0.202-2.649,2.423-4.742,5.122-4.742s4.921,2.093,5.122,4.742H2.309z M13.346,15.335c-0.067-0.997-0.382-1.928-0.882-2.732c0.502-0.271,1.075-0.429,1.686-0.429c1.828,0,3.338,1.385,3.535,3.161H13.346z"></path>
                      </svg>
                    </button>
                  </nav>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
              {userRole != "2069-t2-prlo-456-fiok" && (
                <Link to={`/user/${user_id}/create_ticket`}>
                  <span className="mr-5 hover:text-gray-900 text-blue-500 ">
                    Add Items
                  </span>
                </Link>
              )}
              <Link to={`/user/${user_id}/tickets`}>
                <span className="mr-5 hover:text-gray-900 text-green-500">
                  View Stocks
                </span>
              </Link>
              {localStorage.getItem("role") === "9087-t1-vaek-123-riop" && (
                <>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      getTicketExport("month");
                    }}
                  >
                    <span className="mr-5 hover:text-gray-900 text-yellow-600">
                      Export Month Tickets
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      getTicketExport("day");
                    }}
                  >
                    <span className="mr-5 hover:text-gray-900 text-amber-600">
                      Export Day Tickets
                    </span>
                  </button>
                </>
              )}
            </nav>
            <button
              onClick={() => {
                fetch("/api/auth/logout");
                localStorage.removeItem("role");
                localStorage.removeItem("li");
                localStorage.removeItem("uid");
                navigate("/login");
              }}
              className="inline-flex items-center bg-red-100 border-0 py-1 px-3 focus:outline-none hover:bg-slate-100 rounded text-base mt-4 md:mt-0"
            >
              Logout
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
