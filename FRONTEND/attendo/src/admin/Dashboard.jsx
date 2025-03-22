import React from "react";
import {FaUserGraduate,FaUsers,FaChalkboardTeacher,FaUserTie,FaUserFriends} from "react-icons/fa";
import { MdSchool, MdOutlineClass } from "react-icons/md";

const AdminDashboard = () => {
  return (

    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Branches */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <MdSchool className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Branches</h3>
          <p className="text-gray-600 mt-2">Total: 5</p>
        </div>

        {/* Card 2: Classes */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <MdOutlineClass className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Classes</h3>
          <p className="text-gray-600 mt-2">Total: 20</p>
        </div>

        {/* Card 3: HOD */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUserTie className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">HOD</h3>
          <p className="text-gray-600 mt-2">Total: 10</p>
        </div>

        {/* Card 4: Tutors */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaChalkboardTeacher className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Tutors</h3>
          <p className="text-gray-600 mt-2">Total: 10</p>
        </div>

        {/* Card 5: Faculties */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUsers className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Faculties</h3>
          <p className="text-gray-600 mt-2">Total: 50</p>
        </div>

        {/* Card 6: Parents */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUserFriends className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Parents</h3>
          <p className="text-gray-600 mt-2">Total: 1000</p>
        </div>

        {/* Card 7: Students */}
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUserGraduate className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Students</h3>
          <p className="text-gray-600 mt-2">Total: 500</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;