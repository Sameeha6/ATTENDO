import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaUserFriends } from "react-icons/fa";
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


const HodDashboard = () => {
  const [counts, setCounts] = useState({
    branch: "",
    tutor_count: 0,
    faculty_count: 0,
    parent_count: 0,
    student_count: 0,
  });
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
      const hod_id = localStorage.getItem("hod_id");
      await axios.put(`http://127.0.0.1:8000/api/hod/change-password/${hod_id}/`, {
        current_password: current,
        new_password: newPass,
      });
      toast.success("Password changed successfully.");
      setShowPasswordModal(false)
    } catch (err) {
      toast.error("Error: " + (err.response?.data || "Try again"));
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Branch: {counts.branch}</h2>
        <div>
        <span className="text-black font-normal">Wanna change password? </span>
        <button
          onClick={() => setShowPasswordModal(true)}
          className=" text-cyan-800 hover:text-cyan-900 font-semibold transition"
        >
          Click me
        </button>
        </div>
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
      <ToastContainer/>
    </div>
  );
};

export default HodDashboard;
