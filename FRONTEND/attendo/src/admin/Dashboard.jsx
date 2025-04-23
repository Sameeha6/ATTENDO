import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaUserTie, FaUserFriends } from "react-icons/fa";
import { MdSchool } from "react-icons/md";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    branch_count: 0,
    hod_count: 0,
    tutor_count: 0,
    faculty_count: 0,
    student_count: 0,
    parent_count: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/branch-count');
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <MdSchool className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Branches</h3>
          <p className="text-gray-600 mt-2">Total: {counts.branch_count}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUserTie className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">HOD</h3>
          <p className="text-gray-600 mt-2">Total: {counts.hod_count}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaChalkboardTeacher className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Tutors</h3>
          <p className="text-gray-600 mt-2">Total: {counts.tutor_count}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUsers className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Faculties</h3>
          <p className="text-gray-600 mt-2">Total: {counts.faculty_count}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUserFriends className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Parents</h3>
          <p className="text-gray-600 mt-2">Total: {counts.parent_count}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex flex-col items-center text-center">
          <FaUserGraduate className="text-blue-900 text-5xl mb-2" />
          <h3 className="text-2xl font-bold text-gray-800">Students</h3>
          <p className="text-gray-600 mt-2">Total: {counts.student_count}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
