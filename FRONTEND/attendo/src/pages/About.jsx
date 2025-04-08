import React from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div>
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-6 py-12 overflow-hidden">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 mt-20">
          AttenDo - Smart Attendance & Parent Notification System
        </h1>
        <p className="mt-4 text-lg text-gray-700 font-light">
          A seamless and efficient solution for attendance tracking in institutions, ensure accurate monitoring, improve transparency, foster student success and instant parent notifications.
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-6xl mt-7 w-full">
        <h2 className="text-3xl font-bold text-blue-950 text-center mb-8">
          What AttenDo Can Do:
        </h2>

        {/* Feature 1 */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <img
            src="https://img.freepik.com/free-vector/students-walking-school_74855-5292.jpg?w=900&t=st=1712312342~exp=1712312942~hmac=5f7c7b6d0d8c0b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8"
            alt="Student Success"
            className="w-96 h-64 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-2xl font-bold flex items-center mb-4">
              Increase Student Success Rate
            </h3>
            <p className="text-gray-700 font-light">
              Studies show that parental involvement improves student performance. AttenDo enhances transparency by keeping parents informed about their child's attendance and academic progress.
            </p>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row-reverse items-center gap-8 bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <img
            src="	https://i.pinimg.com/736x/3b/44/1e/3b441e59a2dee6a0b9ea767d3cb21bcc.jpg"
            alt="Simplify Attendance"
            className="w-96 h-64 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-2xl font-bold flex items-center mb-4">
              Simplify Attendance Taking
            </h3>
            <p className="text-gray-700 font-light">
              Teachers often struggle with time-consuming attendance tracking. AttenDo streamlines the process, making it quick and efficient while minimizing manual errors.
            </p>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <img
            src="	https://i.pinimg.com/736x/70/df/e7/70dfe7bf93ffc5ffd3cfd1e76f89c88f.jpg"
            alt="Student Reports"
            className="w-96 h-64 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-2xl font-bold flex items-center mb-4">
              Produce Actionable Student Reports
            </h3>
            <p className="text-gray-700 font-light">
            Generate a comprehensive view of student attendance trends with interactive dashboards, offering administrators a clear view of attendance trends, low attendance alerts, and condonation tracking for smarter decision-making.
            </p>
          </div>
        </motion.div>

        {/* Feature 4 */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row-reverse items-center gap-8 bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <img
            src="https://i.pinimg.com/736x/3b/da/ee/3bdaee3477c435cc97a5241ca6e3788f.jpg"
            alt="Teacher Parent Communication"
            className="w-96 h-64 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-2xl font-bold flex items-center mb-4">
              Open Teacher/Parent Communication
            </h3>
            <p className="text-gray-700 font-light">
              AttenDo bridges the communication gap by providing automated alerts for absences, low attendance warnings, and emergency notifications.
            </p>
          </div>
        </motion.div>

        {/* Feature 5 */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-lg shadow-lg mb-8"
        >
          <img
            src="https://i.pinimg.com/736x/25/21/72/2521720ae833a6b0ebb587c8edd839e3.jpg"
            alt="Student Analytics"
            className="w-96 h-64 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-2xl font-bold flex items-center mb-4">
              Simplify Student Grading
            </h3>
            <p className="text-gray-700 font-light">
            Keep the student grading process simple according to the student and class flow. Simply by adding criteria and you can assign grades easily from anywhere while you are tracking attendance.
            </p>
          </div>
        </motion.div>
      </div>
      </div>

      <section className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Features */}
          <div className="mb-10">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2">FEATURES:</h2>
            <ul className="mt-4 space-y-2 text-gray-300 font-light">
              <li>✔️ Fast and Easy Attendance Entry</li>
              <li>✔️ Automated Attendance Tracking</li>
              <li>✔️ Real-time Parent Notifications</li>
              <li>✔️ Secure Role-Based Access</li>
              <li>✔️ Department & Semester Analytics</li>
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-10">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2">BENEFITS</h2>
            <ul className="mt-4 space-y-2 text-gray-300 font-light">
              <li>✔️ Increases Efficiency</li>
              <li>✔️ Improves Student Accountability</li>
              <li>✔️ Enhances Communication</li>
              <li>✔️ User-Friendly Dashboard</li>
            </ul>
          </div>

          {/* About Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2">ABOUT SMART ATTENDANCE:</h2>
            <p className="text-gray-300 mt-4 font-light">
              Attendo is designed to revolutionize attendance tracking in institutions.  
              With automated reports, real-time notifications, and smart analytics, managing attendance has never been easier.  
              Our system empowers users with accurate, real-time attendance insights. 
              Join us in transforming the way attendance is managed!
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2">CONTACT US:</h2>
            <p className="text-gray-300 mt-4 font-light">Have questions? Need assistance? Reach out to us anytime!</p>
            <Link to="/contact" className="text-blue-400 font-bold hover:underline mt-2 mb-6 inline-block">
              SEND US AN EMAIL
            </Link>
          </div>

          <footer className="bg-gray-900 text-white py-6 text-center">
          <p>&copy; 2025 ATTENDO. All Rights Reserved.</p>
        </footer>

        </div>
      </section>
    </div>
  );
}

export default AboutUs;