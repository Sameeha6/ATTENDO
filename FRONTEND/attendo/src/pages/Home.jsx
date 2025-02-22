import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

  const handlelogin = () => {
    navigate('/login');
  };

  return (
    <div className='overflow-hidden'>
      {/* Hero Section */}
      <section className="relative text-white text-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/asset/frontimg.jpg')" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
        >
          <h1 className="text-6xl font-bold animate-pulse">ONE TAP, ZERO HASSLE</h1>
          <h1 className="mt-2 text-xl font-semibold animate-pulse">Track Attendance Like Never Before!</h1>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
        >
          <button className="mt-6 bg-white text-black font-bold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-110"
            onClick={handlelogin}>
            Get started
          </button>
        </motion.div>
        </div>
      </section>

       {/* Features Section */}
       <section className="py-12 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800">What We Offer</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 shadow-xl rounded-lg bg-white transform transition duration-700 hover:scale-105">
            <div className="flex justify-center items-center">
              <img src="https://cdn-icons-png.flaticon.com/128/282/282803.png" alt="calender" className='w-16 h-16' />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Track & Report Attendance</h3>
            <p className="mt-2 text-gray-800 text-sm font-light">Setting up students and classes is very easy and you can be off and running in no time at all. Tracking is entirely web-based so you can enter data from anywhere you can access the internet!</p>
          </div>

          <div className="p-6 shadow-xl rounded-lg bg-white transform transition duration-700 hover:scale-105">
            <div className="flex justify-center items-center">
              <img src="https://cdn-icons-png.flaticon.com/128/438/438036.png" alt="reports" className='w-16 h-16'/>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Attendance Reporting</h3>
            <p className="mt-2 text-gray-800 text-sm font-light">You will have a variety of reports at your fingertips. You can view in depth reports by student or class.Stay ahead with automated attendance summaries and actionable insights to enhance student engagement and compliance. </p>
          </div>

          <div className="p-6 shadow-xl rounded-lg bg-white transform transition duration-700 hover:scale-105">
            <div className="flex justify-center items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/3437/3437364.png" alt="alert" className='w-16 h-16' />
            </div>
          
            <h3 className="mt-4 text-xl font-semibold">Instant Notifications & Alerts</h3>
            <p className="mt-2 text-gray-800 font-light text-sm">Stay informed in real time! Parents and students receive instant alerts for absences and low attendance thresholds. Automated notifications ensure seamless communication, keeping everyone in the loop. No more delays—get updates the moment attendance is recorded!</p>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="bg-gray-100 py-16 px-6 ">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, translateX: '-50%' }}
            whileInView={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="md:w-1/2 flex justify-center mb-6 md:mb-0"
          >
            <img
              src="https://i.pinimg.com/736x/eb/44/1e/eb441ede0814b93123430260b9036586.jpg"
              alt="mission"
              className="w-96 h-96 object-cover rounded-lg shadow-lg"
            />
          </motion.div>

          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left md:pl-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 font-light">
              To revolutionize student attendance tracking through smart automation, ensuring accuracy, efficiency, and real-time parent notifications. We strive to bridge the communication gap between our institution and parents, fostering a more connected and accountable learning environment.
            </p>
          </div>
        </div>
      </section>
      
      {/* Vision Section */}
      <section className="bg-white py-16 px-6">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto">
          <div className="md:w-1/2 text-center md:text-left md:pl-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 font-light">
                To become a leading digital attendance solution that empower our educational institution with seamless, tech-driven monitoring and transparent parent engagement. Our goal is to enhance student accountability, reduce manual errors, and promote a smarter, more efficient future for education.
              </p>
          </div>
              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, translateX: '50%' }}
                whileInView={{ opacity: 1, translateX: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="md:w-1/2 flex justify-center mb-6 md:mb-0"
              >
                <img
                  src="https://i.pinimg.com/736x/8e/a6/7d/8ea67d65570eb57ad1649dcb7ed89143.jpg"
                  alt="Vision"
                  className="w-auto h-80 object-cover rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
      </section>


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
          <Link to="/contact" className="text-blue-400 font-bold hover:underline mt-2 inline-block">
            SEND US AN EMAIL
          </Link>
        </div>

      </div>
    </section>

    </div>
  );
}

export default Home;


