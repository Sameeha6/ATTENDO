import React, { useState,useEffect } from "react";
import { FaUsers, FaChartBar, FaBars } from "react-icons/fa";
import { MdAdminPanelSettings, MdExpandMore } from "react-icons/md";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

function Hodbar() {
  const [openUsers, setOpenUsers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

    const navigate = useNavigate();
    
      const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
      };

      useEffect(() => {
        fetchRequestCount();
      }, []);
    
      const fetchRequestCount = async () => {
        try {
          const hod_id = localStorage.getItem("hod_id");
          const [hourRes, editRes] = await Promise.all([
            axios.get("http://127.0.0.1:8000/api/request-hour-change/"),
            axios.get(`http://127.0.0.1:8000/api/notifications/${hod_id}/`)
          ]);
          const count = hourRes.data.length + editRes.data.notifications.length;
          setRequestCount(count);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-blue-950 text-white p-4 px-6 flex justify-between items-center shadow-md w-full fixed top-0 z-50">
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
            alt="LOGO"
            className="w-10 h-10"
          />
          <div className="text-2xl font-sans font-bold">AttenDo</div>
        </div>
        <button
          className="lg:hidden bg-white p-2 rounded-md text-black hover:bg-gray-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars className="text-xl" />
        </button>

        {/* Logout Button (Hidden in Small Screens) */}
        <button className="hidden lg:block border-2 border-white px-4 py-2 hover:border-orange-200 rounded-md hover:text-orange-200 font-semibold"
          onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      <div className="flex flex-1 mt-16">
        <div
          className={`fixed top-16 left-0 bg-blue-950 text-white w-64 h-screen px-4 z-50 flex flex-col transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64`}
        >
          <nav className="mt-6">
            <Link to="/hod/hodDash" className="flex items-center py-3 px-4 hover:bg-gray-400 hover:text-black rounded">
              <FaChartBar className="mr-3" /> Dashboard
            </Link>

            <Link to="/hod/manage-tutor" className=" flex items-center py-2 px-4 hover:bg-gray-400 hover:text-black rounded">
              <MdAdminPanelSettings className="mr-3" />Manage Tutor
            </Link>
            <div>
              <button
                onClick={() => setOpenUsers(!openUsers)}
                className="flex items-center py-3 px-4 w-full hover:bg-gray-400 hover:text-black rounded"
              >
                <FaUsers className="mr-3" /> Manage Users
                <MdExpandMore className={`ml-auto transform ${openUsers ? "rotate-180" : "rotate-0"}`} />
              </button>
              {openUsers && (
                <div className="ml-6">
                  <Link to="/hod/manage-faculties" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Faculties</Link>
                  <Link to="/hod/manage-parents" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Parents</Link>
                  <Link to="/hod/manage-students" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Students</Link>
                </div>
              )}
            </div>
            <Link to="/hod/manage-requests" className="flex items-center py-3 px-4 hover:bg-gray-400 hover:text-black rounded relative">
              <FaChartBar className="mr-3" /> Manage Request
              {requestCount > 0 && (
                <span className="ml-2 bg-orange-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {requestCount}
                </span>
              )}
            </Link>

            <button className="lg:hidden bg-white text-black w-full py-2 mt-4 rounded-md hover:bg-gray-200"
              onClick={handleLogout}>
              Log Out
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Hodbar;