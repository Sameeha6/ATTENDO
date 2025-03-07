import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [date, setDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const navigate = useNavigate();

  const branches = ["IT", "EC", "EEE", "CS", "PT", "ME"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  // Function to handle cell clicks
  const handleCellClick = (event, day, subject) => {
    const cell = event.target;
    const isColored = cell.classList.contains("bg-orange-200"); // Check if it's a colored cell

    if (isColored) {
      navigate("/faculty/take-attendance"); // Go to take attendance page for colored cells
    } else {
      setSelectedHour(`${day} - ${subject}`);
      setShowModal(true); // Show request modal for uncolored cells
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden p-4 mt-14">

      {/* Filters Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <input type="text" placeholder="Academic Year" className="w-full p-2 border rounded-md"/>
        <select className="p-2 border rounded-md text-gray-500" required>
          <option value="branch">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>

        <select className="p-2 border rounded-md text-gray-500" required>
          <option value="sem">Select Semester</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>{semester}</option>
          ))}
        </select>

        <input
          type="date"
          className="p-2 border rounded-md text-gray-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Timetable Section */}
      <div className="bg-white shadow-md p-4 rounded-lg overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Timetable</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 min-w-[600px]">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Day/Time</th>
                <th className="border border-gray-300 p-2">9:30-10:30</th>
                <th className="border border-gray-300 p-2">10:30-11:30</th>
                <th className="border border-gray-300 p-2">11:30-12:30</th>
                <th className="border border-gray-300 p-2">1:30-2:30</th>
                <th className="border border-gray-300 p-2">2:30-3:30</th>
                <th className="border border-gray-300 p-2">3:30-4:30</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td className="border border-gray-300 p-2">Monday</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Monday", "Math")}>Math</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Monday", "OS")}>OS</td>
                <td className="border border-gray-300 bg-orange-200 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Monday", "Lab")}>wit</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Monday", "C")}>C</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Monday", "COD")}>COD</td>
                <td className="border border-gray-300 bg-orange-200 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Monday", "Lab")}>wit</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-300 p-2">Tuesday</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Tuesday", "OS")}>OS</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Tuesday", "C")}>C</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Tuesday", "Math")}>Math</td>
                <td className="border border-gray-300 bg-orange-200 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Tuesday", "Lab")}>wit</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Tuesday", "COD")}>COD</td>
                <td className="border border-gray-300 bg-orange-200 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Tuesday", "Lab")}>wit</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Wednesday</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Wednesday", "C")}>C</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Wednesday", "Math")}>Math</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Wednesday", "OS")}>OS</td>
                <td className="border border-gray-300 bg-orange-200 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Wednesday", "Lab")}>wit</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Wednesday", "Lab")}>wit</td>
                <td className="border border-gray-300 p-2 cursor-pointer" onClick={(e) => handleCellClick(e, "Wednesday", "COD")}>COD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Request to Take This Hour</h2>
            <p className="mb-4 text-center">
              Are you sure you want to take the hour of <strong>{selectedHour}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => { alert(`Request sent for ${selectedHour}`); setShowModal(false); }}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;