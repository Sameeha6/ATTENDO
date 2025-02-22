import React from "react";
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaUserTie, FaUserFriends } from "react-icons/fa";
import { MdSchool, MdOutlineClass } from "react-icons/md";

const AdminDashboard = () => {
  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

      <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
        <FaChalkboardTeacher className="text-blue-900 text-4xl" />
        <div>
          <h3 className="text-xl font-bold">Tutors</h3>
          <p className="text-gray-700">Total: 10</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
        <FaUsers className="text-blue-900 text-4xl" />
        <div>
          <h3 className="text-xl font-bold">Faculties</h3>
          <p className="text-gray-700">Total: 50</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
        <FaUserFriends className="text-blue-900 text-4xl" />
        <div>
          <h3 className="text-xl font-bold">Parents</h3>
          <p className="text-gray-700">Total: 1000</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-lg flex items-center gap-4">
        <FaUserGraduate className="text-blue-900 text-4xl" />
        <div>
          <h3 className="text-xl font-bold">Students</h3>
          <p className="text-gray-700">Total: 500</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
