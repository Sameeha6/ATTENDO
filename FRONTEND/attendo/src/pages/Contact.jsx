import React, { useState } from "react";
import { motion } from 'framer-motion';

const ContactUs = () => {
  // State for form fields and response message
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: name,
      email: email,
      subject: subject,
      message: message,
    };

    try {
      // Send POST request to backend API
      const response = await fetch("http://127.0.0.1:8000/api/contactus/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the request was successful
      if (response.ok) {
        setResponseMessage("Your message has been sent successfully!");
        // Clear form fields
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.detail || "There was an error sending your message.");
      }
    } catch (error) {
      setResponseMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
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
        </div>

        {/* Contact Form (Right Side) */}
        <div className="md:w-1/2 w-full bg-white p-8 shadow-md rounded-lg mt-8 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Subject</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Send Message Button */}
            <button
              type="submit"
              className="w-full bg-blue-950 text-white p-3 rounded-md hover:bg-blue-900"
            >
              Send Message
            </button>
          </form>

          {/* Response Message */}
          {responseMessage && (
            <div className="mt-4 text-center text-gray-800 font-semibold">
              {responseMessage}
            </div>
          )}
        </div>
      </div>

      {/* Additional content like features and footer */}
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

          <footer className="bg-gray-900 text-white py-6 text-center">
          <p>&copy; 2025 ATTENDO. All Rights Reserved.</p>
        </footer>

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
