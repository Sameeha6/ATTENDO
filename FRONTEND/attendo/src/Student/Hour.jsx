import React, { useState } from "react";
import HistoryNav from "./HistoryNav";

const attendanceData = [
  { date: "Monday 01", status: ["✅", "❌", "❌", "✅", "✅", "✅"] },
  { date: "Tuesday 02", status: ["✅", "✅", "✅", "✅", "✅", "✅"] },
  { date: "Wednesday 03", status: ["✅", "✅", "✅", "✅", "✅", "✅"] },
  { date: "Thursday 04", status: ["✅", "✅", "✅", "✅", "✅", "✅"] },
  { date: "Friday 05", status: ["✅", "❌", "✅", "✅", "✅", "✅"] },
  { date: "Monday 08", status: ["✅", "✅", "✅", "✅", "✅", "✅"] },
  { date: "Tuesday 09", status: ["✅", "✅", "✅", "✅", "❌", "✅"] },
];

const Hourly = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");

  return (
    <div className="p-2  w-full min-h-screen">
      {/* Header and Month Selector */}
      <div className="flex justify-between items-center bg-white text-black mb-6 p-4 rounded-lg  font-bold shadow-md gap-3">
        <h1 className="text-xl">Hourly Attendance</h1>
        <select
          className="border-2 border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="March">April</option>
          <option value="March">May</option>
          <option value="March">June</option>
          <option value="March">July</option>
          <option value="March">August</option>
          <option value="March">September</option>
          <option value="March">October</option>
          <option value="March">November</option>
          <option value="March">December</option>
          
        </select>
      </div>

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
                {entry.status.map((status, i) => (
                  <td key={i} className="p-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        status === "✅"
                          ? "bg-green-100 text-green-600"
                          : status === "❌"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-8">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
            ✅
          </span>
          <span className="text-gray-700">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
            ❌
          </span>
          <span className="text-gray-700">Leave</span>
        </div>
      </div>
    </div>
  );
};

export default Hourly;