import React, { useState } from "react";
import { FaUsers, FaChartBar, FaBars } from "react-icons/fa";
import { MdAdminPanelSettings, MdExpandMore } from "react-icons/md";
import { Link } from "react-router-dom";

function Hodbar() {
  const [openUsers, setOpenUsers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-950 text-white p-4 px-6 flex justify-between items-center shadow-md w-full fixed top-0 z-50">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
            alt="LOGO"
            className="w-10 h-10"
          />
          <div className="text-2xl font-sans font-bold">AttenDo</div>
        </div>

        {/* Hamburger Menu */}
        <button
          className="lg:hidden bg-white p-2 rounded-md text-black hover:bg-gray-200"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars className="text-xl" />
        </button>

        {/* Logout Button (Hidden in Small Screens) */}
        <button className="hidden lg:block bg-white px-4 py-2 text-black rounded-md hover:bg-gray-200 hover:text-sky-600 font-semibold">
          Log Out
        </button>
      </nav>

      {/* Sidebar and Content Wrapper */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <div
          className={`fixed top-16 left-0 bg-blue-950 text-white w-64 h-screen px-4 z-50 flex flex-col transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64`}
        >
          <nav className="mt-6">
            {/* Dashboard */}
            <Link to="/hod/hodDash" className="flex items-center py-3 px-4 hover:bg-gray-400 hover:text-black rounded">
              <FaChartBar className="mr-3" /> Dashboard
            </Link>

            <Link to="/hod/manage-tutor" className=" flex items-center py-2 px-4 hover:bg-gray-400 hover:text-black rounded">
              <MdAdminPanelSettings className="mr-3" />Manage Tutor
            </Link>

            {/* Manage Users */}
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

            {/* Reports & Analytics */}
            <Link to="/hod/manage-requests" className="flex items-center py-3 px-4  hover:bg-gray-400 hover:text-black rounded">
              <FaChartBar className="mr-3" /> Manage Request
            </Link>

            {/* Logout Button (Visible in Small Screens) */}
            <button className="lg:hidden bg-white text-black w-full py-2 mt-4 rounded-md hover:bg-gray-200">
              Log Out
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Hodbar;