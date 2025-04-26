import React, { useState, useEffect } from "react";

const HourlyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch attendance data based on the selected month
  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    const student_id = localStorage.getItem("student_id");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/hourly-attendance/${student_id}/?month=${selectedMonth}&academic_year=2025-2026`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance when the component mounts or when selectedMonth changes
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth]);

  return (
    <div className="p-4 w-full min-h-screen">
      {/* Header and Month Selector */}
      <div className="flex justify-between items-center bg-white text-black mb-6 p-4 rounded-lg font-bold shadow-md gap-3">
        <h1 className="text-xl">Hourly Attendance</h1>
        <select
          className="border-2 border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="2025-01">January 2025</option>
          <option value="2025-02">February 2025</option>
          <option value="2025-03">March 2025</option>
          <option value="2025-04">April 2025</option>
          <option value="2025-05">May 2025</option>
          <option value="2025-06">June 2025</option>
          <option value="2025-07">July 2025</option>
          <option value="2025-08">August 2025</option>
          <option value="2025-09">September 2025</option>
          <option value="2025-10">October 2025</option>
          <option value="2025-11">November 2025</option>
          <option value="2025-12">December 2025</option>
        </select>
      </div>

      {/* Loading or Error State */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-2xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white">
            <tr>
              <th className="p-4 text-left text-black font-semibold">Date</th>
              {[...Array(6)].map((_, i) => (
                <th key={i} className="p-4 text-center text-black font-semibold">
                  H{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition-colors`}
              >
                <td className="p-4 text-gray-700 font-medium">{entry.date}</td>
                {[...Array(6)].map((_, hourIndex) => {
                  const status = entry.status[hourIndex] || "Absent"; // Handle missing status
                  return (
                    <td key={hourIndex} className="p-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          status === "Present"
                            ? "text-green-600"
                            : status === "Absent"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {status === "Present" ? "✅" : "❌"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-8">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-green-600">
            ✅
          </span>
          <span className="text-gray-700">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-red-600">
            ❌
          </span>
          <span className="text-gray-700">Absent</span>
        </div>
      </div>
    </div>
  );
};

export default HourlyAttendance;
