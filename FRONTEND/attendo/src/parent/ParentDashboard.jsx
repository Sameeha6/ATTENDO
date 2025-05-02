import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [parentName, setParentName] = useState("");
  const parentId = localStorage.getItem("parent_id");
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
      const parent_id = localStorage.getItem("parent_id");
      await axios.put(`http://127.0.0.1:8000/api/parent/change-password/${parent_id}/`, {
        current_password: current,
        new_password: newPass,
      });
      toast.success("Password changed successfully.");
    } catch (err) {
      toast.error("Error: " + (err.response?.data || "Try again"));
    }
  };

  useEffect(() => {
    const fetchParentName = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/parents/${parentId}/`
        );
        console.log(response.data);
        setParentName(response.data.username);
      } catch (error) {
        console.error("Error fetching parent details:", error);
      }
    };

    if (parentId) {
      fetchParentName();
    }
  }, [parentId]);

  useEffect(() => {
    if (parentId) {
      axios
        .get(`http://127.0.0.1:8000/api/parent-students/?parent_id=${parentId}`)
        .then((response) => {
          const data = response.data;
          setStudents(data);

          if (data.length === 1) {
            const firstStudent = data[0];
            setSelectedStudentId(firstStudent.id);
            localStorage.setItem("student_id", firstStudent.id); 
          }
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
    }
  }, [parentId]);

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId);
    localStorage.setItem("student_id", studentId);
    navigate("/parent/hour");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-start text-center p-6 pt-20">
      {/* <div className="flex justify-between items-center mb-6">
        <div>
        <span className="text-black font-normal">Wanna change password? </span>
        <button
          onClick={() => setShowPasswordModal(true)}
          className=" text-cyan-800 hover:text-cyan-900 font-semibold transition"
        >
          Click me
        </button>
        </div>
      </div> */}
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

      <ToastContainer/>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaUserCircle className="text-8xl text-gray-600 mx-auto mb-4" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2"
        >
          Hello, <span className="text-blue-950">{parentName || "Parent"}</span>!
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Welcome to <span className="text-blue-950">AttenDo</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg text-gray-600 mb-6"
        >
          Monitor your ward's attendance with ease! Get instant insights and
          stay informed about their presence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-6 flex flex-col items-center"
        >
          {students.length > 1 && (
            <>
              {/* <label
                htmlFor="studentSelect"
                className="text-gray-800 font-bold text-lg block mb-2 py-4"
              >
                Select Your Ward:
              </label> */}
              <div className="relative inline-block">
                <select
                  id="studentSelect"
                  className="form-select border rounded p-2"
                  value={selectedStudentId || ""}
                  onChange={handleStudentChange}
                >
                  <option value="" disabled>
                    Select your ward
                  </option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.username}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}