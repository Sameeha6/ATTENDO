import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaUserFriends } from "react-icons/fa";

const HodDashboard = () => {
  const [counts, setCounts] = useState({
    branch: "",
    tutor_count: 0,
    faculty_count: 0,
    parent_count: 0,
    student_count: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const hod_id = localStorage.getItem("hod_id");
      if (!hod_id) {
        console.error("HOD ID not found in localStorage.");
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/hod-user-counts/${hod_id}/`);
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching HOD data: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Branch: {counts.branch}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

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

export default HodDashboard;
