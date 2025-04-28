import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [parentName, setParentName] = useState(""); // Initial empty value
  const parentId = localStorage.getItem("parent_id");


  useEffect(() => {
    const fetchParentName = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/parents/${parentId}/`);

        console.log(response.data); // <-- Check what is inside data
        setParentName(response.data.username); // Or maybe .name or .full_name
      } catch (error) {
        console.error("Error fetching parent details:", error);
      }
    };
  
    if (parentId) {
      fetchParentName();
    }
  }, [parentId]);
  
  // Fetch students related to the parent
  useEffect(() => {
    if (parentId) {
      axios
        .get(`http://127.0.0.1:8000/api/parent-students/?parent_id=${parentId}`)
        .then((response) => {
          const data = response.data;
          setStudents(data);

          // If only one student, set that as selected automatically
          if (data.length === 1) {
            const firstStudent = data[0];
            setSelectedStudentId(firstStudent.student_id); // Set as selected
            localStorage.setItem("student_id", firstStudent.student_id); // Store in localStorage
          }
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
    }
  }, [parentId]);

  // Handle the change in the dropdown selection
  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudentId(studentId); // Update state with the selected student
    localStorage.setItem("student_id", studentId); // Save selected student in localStorage
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-start text-center p-6 pt-20">
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
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaUserCircle className="text-8xl text-gray-600 mx-auto mb-4" />
        </motion.div>

        {/* Hello, [Parent Name] with Motion */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2"
        >
          Hello, <span className="text-blue-950">{parentName || "Parent"}</span>!
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
          Monitor your ward's attendance with ease! Get instant insights and
          stay informed about their presence.
        </motion.p>

        {/* Select Ward Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-6 flex flex-col items-center"
        >
          {students.length > 1 && (
            <>
              <label
                htmlFor="studentSelect"
                className="text-gray-800 font-bold text-lg block mb-2 py-4"
              >
                Select Your Ward:
              </label>
              <div className="relative inline-block">
                <select
                  id="studentSelect"
                  className="form-select border rounded p-2"
                  value={selectedStudentId || ""} // Set to empty string initially
                  onChange={handleStudentChange}
                >
                  <option value="" disabled>
                    Choose a ward
                  </option>
                  {students.map((student) => (
                    <option key={student.student_id} value={student.student_id}>
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