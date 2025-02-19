import React from "react";

function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center md:px-16 py-12 mt-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900">AttenDo - Smart Attendance & Parent Notification System</h1>
        <p className="mt-4 text-lg text-gray-700">
          A seamless and efficient solution for attendance tracking in institutions, ensuring accurate monitoring and instant parent notifications.
        </p>
      </div>
      
      {/* Features Section */}
      <div className="max-w-4xl mt-10">
        <h2 className="text-2xl font-semibold text-blue-950 mb-6">What AttenDo Can Do:</h2>
        
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-xl font-bold flex items-center mb-2">✅ Increase Student Success Rate</h3>
          <p className="text-gray-700">
            Studies show that parental involvement improves student performance. AttenDo enhances transparency by keeping parents informed about their child's attendance and academic progress.
          </p>
        </div>
        
        <div className="bg-white p-6 shadow-md rounded-lg mt-4">
          <h3 className="text-xl font-bold flex items-center mb-2">✅ Simplify Attendance Taking</h3>
          <p className="text-gray-700">
            Teachers often struggle with time-consuming attendance tracking. AttenDo streamlines the process, making it quick and efficient while minimizing manual errors.
          </p>
        </div>
        
        <div className="bg-white p-6 shadow-md rounded-lg mt-4">
          <h3 className="text-xl font-bold flex items-center mb-2">✅ Produce Actionable Student Reports</h3>
          <p className="text-gray-700">
            Generate real-time reports and analytics on attendance trends, low attendance alerts, and condonation tracking for better decision-making.
          </p>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg mt-4">
          <h3 className="text-xl font-bold flex items-center mb-2">✅ Open Teacher/Parent Communication</h3>
          <p className="text-gray-700">
            AttenDo bridges the communication gap by providing automated SMS alerts for absences, low attendance warnings, and emergency notifications.
          </p>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg mt-4">
          <h3 className="text-xl font-bold flex items-center mb-2">✅ Simplify Student Attendance Analytics</h3>
          <p className="text-gray-700">
            Get a comprehensive view of student attendance trends through interactive dashboards, making it easier for administrators to take necessary actions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
