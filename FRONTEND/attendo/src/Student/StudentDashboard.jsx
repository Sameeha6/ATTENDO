import React, { useEffect, useState } from "react";
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure axios is installed and imported

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = localStorage.getItem("student_id");
        if (studentId) {
          const response = await axios.get(`http://127.0.0.1:8000/api/students/${studentId}/`);
          setStudentName(response.data.username); 
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const handleHistory = () => {
    navigate('/student/student/student/attendance-history/hour');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-center text-center p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        {/* Icon with Motion */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaUserCircle className="text-8xl text-gray-600 mx-auto mb-6" />
        </motion.div>

        {/* Hello, [Student Name] with Motion */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2"
        >
          Hello, <span className="text-blue-950">{studentName || "Student"}..</span>!
        </motion.h2>

        {/* Welcome Text with Motion */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome to <span className="text-blue-950">AttenDo</span>
        </motion.h1>

        {/* Description Text with Motion */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg text-gray-600 mb-6"
        >
          Track your attendance, stay updated, and ensure regularity for a successful academic journey.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-950 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-950 transition duration-300"
          onClick={handleHistory}
        >
          View Attendance
        </motion.button>
      </motion.div>
    </div>
  );
}
