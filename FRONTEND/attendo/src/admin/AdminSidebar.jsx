import React, { useState } from "react";
import { FaUsers, FaChartBar, FaSchool, FaBars, FaBook } from "react-icons/fa";
import { MdAdminPanelSettings, MdClass, MdExpandMore } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

function NavbarAndSidebar() {
  const [openSubAdmin, setOpenSubAdmin] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); //  localStorage.removeItem('key') for specific items
    navigate("/login");
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
          className="lg:hidden bg-white p-2 rounded-md text-black hover:bg-gray-200 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars className="text-xl" />
        </button>

        {/* Logout Button (Hidden in Small Screens) */}
        <button
          className="hidden lg:block border-2 border-white px-4 py-2 hover:border-orange-200 rounded-md hover:text-orange-200 font-semibold"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </nav>
      <div className="flex flex-1 mt-16">
        <div
          className={`fixed top-16 left-0 bg-blue-950 text-white h-screen px-4 w-64 z-50 flex flex-col transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64`}
        >
          <nav className="mt-6">
            <Link to="/admin/admin" className="flex items-center py-3 px-4 hover:bg-gray-400 hover:text-black rounded">
              <FaChartBar className="mr-3" /> Dashboard
            </Link>
            <Link to="/admin/manage-branch" className="flex items-center py-3 px-4 hover:bg-gray-400 hover:text-black rounded">
              <FaSchool className="mr-3" /> Manage Branch
            </Link>
            <Link to="/admin/manage-subject" className="flex items-center py-3 px-4 hover:bg-gray-400 hover:text-black rounded">
              <FaBook className="mr-3" /> Manage Subject
            </Link>
            <div>
              <button
                onClick={() => setOpenSubAdmin(!openSubAdmin)}
                className="flex items-center py-3 px-4 w-full hover:bg-gray-400 hover:text-black rounded"
              >
                <MdAdminPanelSettings className="mr-3" /> Manage Subadmins
                <MdExpandMore className={`ml-auto transform ${openSubAdmin ? "rotate-180" : "rotate-0"}`} />
              </button>
              {openSubAdmin && (
                <div className="ml-6">
                  <Link to="/admin/manage-hod" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">HOD</Link>
                  <Link to="/admin/manage-tutor" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Tutor</Link>
                </div>
              )}
            </div>
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
                  <Link to="/admin/manage-faculties" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Faculties</Link>
                  <Link to="/admin/manage-parents" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Parents</Link>
                  <Link to="/admin/manage-students" className="block py-2 px-4 hover:bg-gray-400 hover:text-black rounded">Students</Link>
                </div>
              )}
            </div>

            {/* Logout Button (Visible in Small Screens) */}
            <button className="lg:hidden bg-white text-black w-full py-2 mt-4 rounded-md hover:bg-gray-200"
              onClick={handleLogout}>
              Log Out
            </button>
          </nav>
        </div>

        {/* Main Content Area  */}
        {/* <div className="flex-1 lg:ml-64 p-6 bg-gray-100 min-h-screen"> */}
          {/* Your page content goes here */}
          {/* <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        </div> */}
      </div>
    </div>
  );
}

export default NavbarAndSidebar;