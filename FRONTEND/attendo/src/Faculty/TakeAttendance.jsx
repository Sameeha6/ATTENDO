import React, { useState } from "react";

const TakeAttendance = () => {
  const students = [
    { RegNo: "IEAWEIT01", name: "Sameeha" },
    { RegNo: "IEAWEIT02", name: "Sangeetha" },
  ];

  const [branch, setBranch] = useState("CSE");
  const [semester, setSemester] = useState("6");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // State to manage attendance
  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => {
      acc[student.RegNo] = "Present";
      return acc;
    }, {})
  );

  // Toggle attendance status
  const toggleAttendance = (RegNo) => {
    setAttendance((prevState) => ({
      ...prevState,
      [RegNo]: prevState[RegNo] === "Present" ? "Absent" : "Present",
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-14">
      <div className="p-6">
        <div className="bg-white shadow-md p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-600 font-semibold">Academic year</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Branch</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Semester</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Date</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
        </div>
      </div>

      {/* Attendance Table (Visible on larger screens) */}
      <div className="hidden md:block p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-black font-semibold">RegNo</th>
              <th className="p-2 text-black font-semibold">Name</th>
              <th className="p-2 text-black font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.RegNo} className="border-b border-gray-200">
                <td className="p-2 text-gray-700">{student.RegNo}</td>
                <td className="p-2 text-gray-700">{student.name}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => toggleAttendance(student.RegNo)}
                    className={`px-6 py-2 rounded-full text-white font-semibold transition-all ${
                      attendance[student.RegNo] === "Present"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      attendance[student.RegNo] === "Present"
                        ? "focus:ring-green-500"
                        : "focus:ring-red-500"
                    }`}
                  >
                    {attendance[student.RegNo]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Cards (Visible on mobile screens) */}
      <div className="md:hidden p-6">
        <div className="grid grid-cols-1 gap-4">
          {students.map((student) => (
            <div
              key={student.RegNo}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-500 text-sm">{student.RegNo}</p>
                <p className="text-gray-700 font-semibold">{student.name}</p>
              </div>
              <button
                onClick={() => toggleAttendance(student.RegNo)}
                className={`px-4 py-2 rounded-full text-white font-semibold transition-all ${
                  attendance[student.RegNo] === "Present"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  attendance[student.RegNo] === "Present"
                    ? "focus:ring-green-500"
                    : "focus:ring-red-500"
                }`}
              >
                {attendance[student.RegNo]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Present and Absent Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6">
        <div className="border-2 shadow-md p-6">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6752/6752597.png"
              alt="present"
              className="w-10 h-10"
            />
            <h3 className="text-lg font-bold text-black">Presentees</h3>
          </div>
          <ul className="mt-2">
            {students
              .filter((student) => attendance[student.RegNo] === "Present")
              .map((student) => (
                <li key={student.RegNo} className="text-gray-700">
                  {student.name}
                </li>
              ))}
          </ul>
        </div>

        <div className="border-2 shadow-md p-4">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/18229/18229373.png"
              alt="absent"
              className="w-10 h-10"
            />
            <h3 className="text-lg font-bold text-black">Absentees</h3>
          </div>
          <ul className="mt-2">
            {students
              .filter((student) => attendance[student.RegNo] === "Absent")
              .map((student) => (
                <li key={student.RegNo} className="text-gray-700">
                  {student.name}
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center items-center mt-8">
        <button className="border bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
          Submit
        </button>
      </div>
    </div>
  );
};

export default TakeAttendance;