import {React,useState } from "react";
import { Link } from "react-router-dom";

const HistoryNav = () => {
  const [semester, setSemester] = useState("First");

  return (
    <div className=" flex justify-end p-4 bg-white shadow-md ">
      
      <div className="flex space-x-6">
        <Link to="/student/student/student/attendance-history/hour" className="text-gray-600 hover:text-blue-600">
          Hourly
        </Link>
        <Link to="/student/student/student/attendance-history/subject" className="text-gray-600 hover:text-blue-600">
          Subject
        </Link>
        <Link to="/student/student/student/attendance-history/sem" className="text-gray-600 hover:text-blue-600">
          Semester
        </Link>
      </div>
    </div>
  );
};

export default HistoryNav;
