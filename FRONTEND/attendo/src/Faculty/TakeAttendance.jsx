// import React, { useState } from "react";

// const TakeAttendance = () => {
//   const students = [
//     { RegNo: "IEAWEIT01", name: "Sameeha" },
//     { RegNo: "IEAWEIT02", name: "Sangeetha" },
//   ];

//   const [branch, setBranch] = useState("CSE");
//   const [semester, setSemester] = useState("6");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

//   // State to manage attendance
//   const [attendance, setAttendance] = useState(
//     students.reduce((acc, student) => {
//       acc[student.RegNo] = "Present";
//       return acc;
//     }, {})
//   );

//   // Toggle attendance status
//   const toggleAttendance = (RegNo) => {
//     setAttendance((prevState) => ({
//       ...prevState,
//       [RegNo]: prevState[RegNo] === "Present" ? "Absent" : "Present",
//     }));
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen mt-14">
//       <div className="p-6">
//         <div className="bg-white shadow-md p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-gray-600 font-semibold">Academic year</label>
//             <input type="text" className="w-full p-2 border rounded-md" />
//           </div>
//           <div>
//             <label className="block text-gray-600 font-semibold">Branch</label>
//             <input type="text" className="w-full p-2 border rounded-md" />
//           </div>
//           <div>
//             <label className="block text-gray-600 font-semibold">Semester</label>
//             <input type="text" className="w-full p-2 border rounded-md" />
//           </div>
//           <div>
//             <label className="block text-gray-600 font-semibold">Date</label>
//             <input type="text" className="w-full p-2 border rounded-md" />
//           </div>
//         </div>
//       </div>

//       {/* Attendance Table (Visible on larger screens) */}
//       <div className="hidden md:block p-6 overflow-x-auto">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 text-black font-semibold">RegNo</th>
//               <th className="p-2 text-black font-semibold">Name</th>
//               <th className="p-2 text-black font-semibold text-center">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student) => (
//               <tr key={student.RegNo} className="border-b border-gray-200">
//                 <td className="p-2 text-gray-700">{student.RegNo}</td>
//                 <td className="p-2 text-gray-700">{student.name}</td>
//                 <td className="p-2 text-center">
//                   <button
//                     onClick={() => toggleAttendance(student.RegNo)}
//                     className={`px-6 py-2 rounded-full text-white font-semibold transition-all ${
//                       attendance[student.RegNo] === "Present"
//                         ? "bg-green-500 hover:bg-green-600"
//                         : "bg-red-500 hover:bg-red-600"
//                     } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                       attendance[student.RegNo] === "Present"
//                         ? "focus:ring-green-500"
//                         : "focus:ring-red-500"
//                     }`}
//                   >
//                     {attendance[student.RegNo]}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Attendance Cards (Visible on mobile screens) */}
//       <div className="md:hidden p-6">
//         <div className="grid grid-cols-1 gap-4">
//           {students.map((student) => (
//             <div
//               key={student.RegNo}
//               className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
//             >
//               <div>
//                 <p className="text-gray-500 text-sm">{student.RegNo}</p>
//                 <p className="text-gray-700 font-semibold">{student.name}</p>
//               </div>
//               <button
//                 onClick={() => toggleAttendance(student.RegNo)}
//                 className={`px-4 py-2 rounded-full text-white font-semibold transition-all ${
//                   attendance[student.RegNo] === "Present"
//                     ? "bg-green-500 hover:bg-green-600"
//                     : "bg-red-500 hover:bg-red-600"
//                 } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                   attendance[student.RegNo] === "Present"
//                     ? "focus:ring-green-500"
//                     : "focus:ring-red-500"
//                 }`}
//               >
//                 {attendance[student.RegNo]}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Present and Absent Lists */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6">
//         <div className="border-2 shadow-md p-6">
//           <div className="flex items-center space-x-2">
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/6752/6752597.png"
//               alt="present"
//               className="w-10 h-10"
//             />
//             <h3 className="text-lg font-bold text-black">Presentees</h3>
//           </div>
//           <ul className="mt-2">
//             {students
//               .filter((student) => attendance[student.RegNo] === "Present")
//               .map((student) => (
//                 <li key={student.RegNo} className="text-gray-700">
//                   {student.name}
//                 </li>
//               ))}
//           </ul>
//         </div>

//         <div className="border-2 shadow-md p-4">
//           <div className="flex items-center space-x-2">
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/18229/18229373.png"
//               alt="absent"
//               className="w-10 h-10"
//             />
//             <h3 className="text-lg font-bold text-black">Absentees</h3>
//           </div>
//           <ul className="mt-2">
//             {students
//               .filter((student) => attendance[student.RegNo] === "Absent")
//               .map((student) => (
//                 <li key={student.RegNo} className="text-gray-700">
//                   {student.name}
//                 </li>
//               ))}
//           </ul>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-center items-center mt-8">
//         <button className="border bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TakeAttendance;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TakeAttendance = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceChanges, setAttendanceChanges] = useState({});
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/students/')
      .then((response) => {
        const data = response.data;
        setStudents(data);
        const uniqueBranches = [
          ...new Map(data.map(item => [item.branch.id, item.branch])).values()
        ];
        setBranches(uniqueBranches);
        fetchAttendanceData();
      })
      .catch((error) => {
        console.log("Error fetching students:", error);
      });
  }, []);

  const fetchAttendanceData = () => {
    axios.get('http://localhost:8000/api/get-attendance/')
      .then((response) => {
        const data = response.data;
        const attendanceData = data.reduce((acc, item) => {
          acc[item.student_id] = item.status;
          return acc;
        }, {});
        setAttendance(attendanceData);
      })
      .catch((error) => {
        console.log("Error fetching attendance data:", error);
      });
  };

  const toggleAttendance = (studentId) => {
    const newStatus = attendance[studentId] === 'Present' ? 'Absent' : 'Present';
    setAttendance(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
    setAttendanceChanges(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const saveAttendance = () => {
    alert("Attendance changes have been saved temporarily.");
  };

  const submitAttendance = () => {
    const changesArray = Object.keys(attendanceChanges).map(studentId => ({
      student_id: studentId,
      status: attendanceChanges[studentId],
      date: new Date().toISOString().split('T')[0]
    }));
    axios.post('http://localhost:8000/api/mark-attendance/', changesArray)
      .then(response => {
        alert("Attendance successfully submitted.");
        setAttendanceChanges({});
      })
      .catch(error => {
        console.error("Failed to submit attendance:", error);
        alert("Error submitting attendance.");
      });
  };

  const filteredStudents = students.filter(student =>
    student.branch.id === parseInt(selectedBranch) &&
    student.semester === selectedSemester
  );

  const presentCount = filteredStudents.filter(student => attendance[student.id] === 'Present').length;
  const absentCount = filteredStudents.filter(student => attendance[student.id] === 'Absent').length;

  return (
    <div className="mt-20 p-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-semibold text-gray-900 mb-8">📋 Student Attendance</h2>
  
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">-- Select Semester --</option>
            {Array.from(new Set(students.map(s => s.semester))).map((sem, index) => (
              <option key={index} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Branch</label>
          <select
            className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">-- Select Branch --</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </select>
        </div>
      </div>
  
      {/* Attendance Stats */}
      {selectedBranch && selectedSemester && (
        <div className="mb-6 text-gray-800 font-medium text-lg flex gap-10">
          <span className="flex items-center gap-2">
            ✅ <strong className="text-green-600">{presentCount}</strong> Present
          </span>
          <span className="flex items-center gap-2">
            ❌ <strong className="text-red-600">{absentCount}</strong> Absent
          </span>
        </div>
      )}
  
      {/* Attendance Table */}
      {selectedBranch && selectedSemester && (
        <>
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Roll No</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-700">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">{student.student_id}</td>
                      <td className="p-4">{student.username}</td>
                      <td className="p-4">
                        <button
                          className={`px-4 py-1 rounded-full text-sm font-medium transition duration-200 ${
                            attendance[student.id] === 'Present'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          onClick={() => toggleAttendance(student.id)}
                        >
                          {attendance[student.id] || 'Absent'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-6">No students found for the selected branch and semester.</p>
          )}
        </>
      )}
  
      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md shadow-md transition"
          onClick={saveAttendance}
        >
         Save 
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition"
          onClick={submitAttendance}
        >
        Submit 
        </button>
      </div>
    </div>
  );  
}
export default TakeAttendance;