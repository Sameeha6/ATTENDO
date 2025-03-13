import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ParentDashboard() {
  const parentName = "Mohammed";
  const [selectedWard, setSelectedWard] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  // Sample wards list (Replace with dynamic data as needed)
  const wards = ["Fidha", "Sameeha", "Najiya"];

  // Handle selection and navigate
  const handleNavigate = (e) => {
    const ward = e.target.value;
    setSelectedWard(ward);
    if (ward) {
      navigate(`/parent/reports/${ward}`); // Navigate to the reports page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col items-center justify-start text-center p-6 pt-20">
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
          Hello, <span className="text-blue-950">{parentName}</span>!
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
          <label className="text-gray-800 font-bold text-lg block mb-2">
            Select Your Ward:
          </label>
          <div className="relative inline-block">
            <select
              value={selectedWard}
              onChange={handleNavigate} // Trigger navigation on selection
              className="px-9 py-2 border-2 border-black-700 rounded-xl shadow-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black-500 text-lg font-semibold appearance-none"
            >
              <option value="" disabled>
                Choose a ward
              </option>
              {wards.map((ward, index) => (
                <option key={index} value={ward} className="text-lg">
                  {ward}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              ⬇
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
