import React, { useEffect, useState } from "react";
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState(""); 
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleChangePassword = async () => {
      if (newPass !== confirm) {
        toast.error("New passwords do not match.");
        return;
      }
  
      try {
        const student_id = localStorage.getItem("student_id");
        const response = await axios.put(`http://127.0.0.1:8000/api/student/change-password/${student_id}/`, {
          current_password: current,
          new_password: newPass,
        });
        toast.success("Password changed successfully.");
        setShowPasswordModal(false);
      } catch (err) {
        toast.error("Error: " + (err.response?.data || "Try again"));
      }
    };

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
      <div className="absolute top-4 mt-20 right-4">
        <span className="text-black font-normal">Wanna change password? </span>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="text-cyan-800 hover:text-cyan-900 font-semibold transition"
        >
          Click me
        </button>
      </div>
      {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Change Password</h3>
              
              <input
                type="password"
                placeholder="Current Password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="mb-2 border p-2 w-full rounded"required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="mb-2 border p-2 w-full rounded"required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mb-4 border p-2 w-full rounded"required
              />
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-cyan-800 hover:bg-cyan-700 text-white rounded"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
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
          View Attendance Report
        </motion.button>
      </motion.div>
      <ToastContainer/>
    </div>
  );
}
