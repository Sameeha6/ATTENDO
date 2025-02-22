import React from "react";
import { motion } from 'framer-motion';

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        // className="text-center max-w-3xl"
      >
        <div className="text-gray-800 text-center py-6 text-4xl font-bold mt-32">
          CONTACT US: ASK ABOUT ATTENDO
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start px-8 py-12">
        {/* Left Description */}
        <div className="md:w-1/2 w-full px-4">
          <h2 className="text-2xl font-semibold mb-4">Let us know if you have any questions!</h2>
          <p className="text-gray-600">
            Feel free to ask anything about how Attendo can help you manage attendance tracking, management, parent communications, and more.  
            We’re happy to assist with any questions and would love to hear your suggestions on how to improve Attendo!
          </p>
          {/* <img src="https://i.pinimg.com/736x/e0/fa/99/e0fa99273d3d78853fc1b1ed24e77f7b.jpg" alt="contact us" className="w-80  /> */}
          {/* Social Media Links */}
          {/* <div className="mt-4">
            <span className="text-gray-700">Follow us on social media:</span>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-blue-600 text-2xl">🔵</a>
              <a href="#" className="text-blue-400 text-2xl">🐦</a>
            </div>
          </div> */}
        </div>

        {/* Contact Form (Right Side) */}
        <div className="md:w-1/2 w-full bg-white p-8 shadow-md rounded-lg mt-8 md:mt-0">
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-md" required />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Subject</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md" rows="4" required></textarea>
            </div>

            {/* Send Message Button */}
            <button
              type="button"
              className="w-full bg-blue-950 text-white p-3 rounded-md hover:bg-blue-600"
              onClick={() => window.location.href = `mailto:support@attendo.com?subject=Contact Us&body=Your Message Here`}
            >
              Send Message
            </button>
          </form>
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
          {/* <div>
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2">CONTACT US:</h2>
            <p className="text-gray-300 mt-4 font-light">Have questions? Need assistance? Reach out to us anytime!</p>
          </div> */}

        </div>
      </section>
    </div>
    
  );
};

export default ContactUs;
