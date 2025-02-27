import React, { useState } from "react";

const TakeAttendance = () => {
  // Sample student data
  const students = [
    { rollNo: "101", name: "Alice" },
    { rollNo: "102", name: "Bob" },
    { rollNo: "103", name: "Charlie" },
    { rollNo: "104", name: "David" },
    { rollNo: "105", name: "Emma" },
  ];

  // State to manage attendance
  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => {
      acc[student.rollNo] = "Present";
      return acc;
    }, {})
  );

  // Toggle attendance status
  const toggleAttendance = (rollNo) => {
    setAttendance((prevState) => ({
      ...prevState,
      [rollNo]: prevState[rollNo] === "Present" ? "Absent" : "Present",
    }));
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Take Attendance</h2>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-gray-600 font-semibold">Roll No</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Name</th>
              <th className="p-4 text-left text-gray-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.rollNo}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-gray-700">{student.rollNo}</td>
                <td className="p-4 text-gray-700">{student.name}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleAttendance(student.rollNo)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold text-white transition-all ${
                      attendance[student.rollNo] === "Present"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      attendance[student.rollNo] === "Present"
                        ? "focus:ring-green-500"
                        : "focus:ring-red-500"
                    }`}
                  >
                    {attendance[student.rollNo]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TakeAttendance;