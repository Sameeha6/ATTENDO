import React, { useEffect, useState } from "react";
import {FaUserGraduate,FaUsers,FaUserFriends,} from "react-icons/fa";

const TutorDashboard = () => {
  const [counts, setCounts] = useState({
    tutor: "",
    branch: "",
    academic_year: "",
    faculty_count: 0,
    parent_count: 0,
    student_count: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const tutor_id = localStorage.getItem("tutor_id");
      if (!tutor_id) {
        console.error("Tutor ID not found in localStorage.");
        return;
      }
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tutor-user-counts/${tutor_id}/`);
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching tutor dashboard data:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Branch: {counts.branch} | Academic Year: {counts.academic_year}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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

export default TutorDashboard;
