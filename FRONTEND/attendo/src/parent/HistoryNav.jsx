import {React,useState } from "react";
import { Link } from "react-router-dom";

const HistoryNav = () => {
  const [semester, setSemester] = useState("First");

  return (
    <div className=" flex justify-end p-4 bg-white shadow-md ">
      {/* Dropdown for Semester Selection */}
      {/* <select
        className="border px-4 py-2 rounded-md"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      >
        <option value="First">First</option>
        <option value="Second">Second</option>
        <option value="Third">Third</option>
        <option value="Fourth">Fourth</option>
        <option value="Fifth">Fifth</option>
        <option value="Sixth">Sixth</option>
        <option value="Seventh">Seventh</option>
        <option value="Eighth">Eighth</option>
      </select> */}

      {/* Navigation Tabs */}
      <div className="flex space-x-6">
        <Link to="/parent/hour" className="text-gray-600 hover:text-blue-600">
          Hourly
        </Link>
        <Link to="/parent/subject" className="text-gray-600 hover:text-blue-600">
          Subject
        </Link>
        <Link to="/parent/sem" className="text-gray-600 hover:text-blue-600">
          Semester
        </Link>
      </div>
    </div>
  );
};

export default HistoryNav;