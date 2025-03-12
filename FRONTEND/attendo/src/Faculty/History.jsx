import React, { useState } from 'react';

function FacHistory() {
  const branches = ["IT", "EC", "EEE", "CS", "PT", "ME"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const students = [
    { RegNo: "IEAWEIT01", name: "Sameeha", status: "Present" },
    { RegNo: "IEAWEIT02", name: "Sangeetha", status: "Absent" },
    { RegNo: "IEAWEIT03", name: "Fidha", status: "Present" },
    { RegNo: "IEAWEIT04", name: "Lamiya", status: "Present" },
    { RegNo: "IEAWEIT05", name: "Najiya", status: "Absent" },
  ];
  const [attendance, setAttendance] = useState(students);
  const [date, setDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Toggle attendance status
  const toggleAttendance = (RegNo) => {
    setAttendance((prev) =>
      prev.map((student) =>
        student.RegNo === RegNo
          ? { ...student, status: student.status === "Present" ? "Absent" : "Present" }
          : student
      )
    );
  };

  return (
    <div className="flex flex-col p-4 mt-14">
      {/* Filters Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-gray-600 font-semibold">Academic Year</label>
          <input type="text" className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Branch</label>
          <select className="w-full p-2 border rounded-md" required>
            <option value="branch">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Semester</label>
          <select className="w-full p-2 border rounded-md" required>
            <option value="sem">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Hour</label>
          <input type="text" className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-gray-600 font-semibold">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Attendance History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-black font-semibold">Reg No</th>
                <th className="p-2 text-black font-semibold">Name</th>
                <th className="p-2 text-black font-semibold text-center">Status</th>
                <th className="p-2 text-black font-semibold text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((student) => (
                <tr key={student.RegNo} className="border-b border-gray-200">
                  <td className="p-2 text-gray-700">{student.RegNo}</td>
                  <td className="p-2 text-gray-700">{student.name}</td>
                  <td className="p-2 text-center text-gray-700">{student.status}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => toggleAttendance(student.RegNo)}
                      className={`px-4 py-1 rounded-full font-semibold transition-all ${
                        student.status === "Present"
                          ? "text-green-500 hover:text-green-600"
                          : "text-red-500 hover:text-red-600"
                      }`}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center mt-6">
          <button
            className="border bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
            onClick={() => setShowModal(true)}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirm Attendance Submission</h2>
            <p className="mb-4 text-center">
              Are you sure you want to change the attendance record for the selected date and hour?
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => { alert("Attendance submitted successfully!"); setShowModal(false); }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FacHistory;
