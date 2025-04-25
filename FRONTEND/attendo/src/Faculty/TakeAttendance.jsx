import React, { useState,useEffect } from "react";
import axios from "axios";

const TakeAttendance = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceChanges, setAttendanceChanges] = useState({});
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');



  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/students/')
      .then((response) => {
        const data = response.data;
        setStudents(data);

        const uniqueBranches = [
          ...new Map(data.map(item => [item.branch.id, item.branch])).values()
        ];
        setBranches(uniqueBranches);
      })
      .catch((error) => {
        console.log("Error fetching students:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedBranch && selectedSemester && selectedAcademicYear) {
      const filtered = students.filter(student =>
        student.branch.id === parseInt(selectedBranch) &&
        student.semester === selectedSemester &&
        student.academic_year === selectedAcademicYear
      );
      const initialAttendance = filtered.reduce((acc, student) => {
        acc[student.student_id] = "Present";
        return acc;
      }, {});
      setAttendance(initialAttendance);
    }
  }, [selectedBranch, selectedSemester, selectedAcademicYear, students]);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const submitAttendance = () => {
    const submissionData = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      status,
      academic_year: selectedAcademicYear,
      hour: selectedHour,
      date: selectedDate,
    }));

    axios.post('http://127.0.0.1:8000/api/mark-attendance/', submissionData)
      .then(response => {
        console.log("Attendance marked:", response.data);
        alert("Attendance successfully submitted.");
      })
      .catch(error => {
        console.error("Failed to submit attendance:", error);
        alert("Error submitting attendance.");
      });
  };


  // useEffect(() => {
  //   if (selectedBranch && selectedSemester && selectedAcademicYear) {
  //     const filtered = students.filter(student =>
  //       student.branch.id === parseInt(selectedBranch) &&
  //       student.semester === selectedSemester &&
  //       student.academic_year === selectedAcademicYear
  //     );
  //     const initialAttendance = filtered.reduce((acc, student) => {
  //       acc[student.student_id] = "Present";
  //       return acc;
  //     }, {});
  
  //     setAttendance(initialAttendance);
  //   }
  // }, [selectedBranch, selectedSemester, selectedAcademicYear, students]);
  
  
  // useEffect(() => {
  //   axios.get('http://127.0.0.1:8000/api/students/')
  //     .then((response) => {
  //       const data = response.data;
  //       setStudents(data);

  //       const uniqueBranches = [
  //         ...new Map(data.map(item => [item.branch.id, item.branch])).values()
  //       ];
  //       setBranches(uniqueBranches);

  //       fetchAttendanceData();
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching students:", error);
  //     });
  // }, []);

  const fetchAttendanceData = () => {
    if (!selectedAcademicYear || !selectedHour || !selectedDate) {
  console.log("Please select all fields before fetching attendance data.");
  return;
}

    axios.get('http://127.0.0.1:8000/api/student-attendance/')
      .then((response) => {
        const data = response.data.students;
        const attendanceData = data.reduce((acc, student) => {
          if (student.attendance && student.attendance.length > 0) {
            acc[student.student_id] = student.attendance[0].status; // Take the first attendance record
          };
          return acc;
        }, {});
        setAttendance(attendanceData);
      })
      .catch((error) => {
        console.log("Error fetching attendance data:", error);
      });
  };

  // const toggleAttendance = (studentId) => {
  //   const newStatus = attendance[studentId] === 'Present' ? 'Absent' : 'Present';
  //   setAttendance(prev => ({
  //     ...prev,
  //     [studentId]: newStatus
  //   }));

  //   setAttendanceChanges(prev => ({
  //     ...prev,
  //     [studentId]: newStatus
  //   }));
  // };

  const saveAttendance = () => {
    alert("Attendance changes have been saved temporarily.");
  };

  // const submitAttendance = () => {
  //   const changesArray = Object.keys(attendanceChanges).map(studentId => ({
  //   student_id: studentId,
  //   status: attendanceChanges[studentId],
  //   academic_year: selectedAcademicYear,
  //   hour: selectedHour,
  //   date: selectedDate,
  // }));
  //   axios.post('http://127.0.0.1:8000/api/mark-attendance/', changesArray)
  //     .then(response => {
  //       console.log(response)
  //       console.log("Attendance marked:", response.data);
  //       alert("Attendance successfully submitted.");
  //       setAttendanceChanges({});
  //     })
  //     .catch(error => {
  //       console.error("Failed to submit attendance:", error);
  //       alert("Error submitting attendance.");
  //     });
  // };

  const filteredStudents = students.filter(student =>
    student.branch.id === parseInt(selectedBranch) &&
    student.semester === selectedSemester &&
    student.academic_year === selectedAcademicYear // <-- NEW
  );

  // const presentCount = filteredStudents.filter(student => attendance[student.student_id] === 'Present').length;
  // const absentCount = filteredStudents.filter(student => attendance[student.student_id] === 'Absent').length;

  return (
    <div className="bg-gray-50 min-h-screen mt-14">
      <div className="p-6">
        <div className="bg-white shadow-md p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-600 font-semibold">Academic year</label>
            <select className="w-full p-2 border rounded-md" value={selectedAcademicYear} onChange={(e)=> setSelectedAcademicYear(e.target.value)}>
              <option value="">Select Academic Year</option>  
              {Array.from(new Set(students.map(s => s.academic_year))).map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}           
               </select> 
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Branch</label>
            <select className="w-full p-2 border rounded-md"  value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Semester</label>
            <select className="w-full p-2 border rounded-md" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {Array.from(new Set(students.map(s => s.semester))).map((sem, index) => (
                <option key={index} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          <div>
          <label className="block text-gray-600 font-semibold">Hour</label>
              <select className="w-full p-2 border rounded-md" value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
                  <option value="">Select Hour</option>
                  {[1, 2, 3, 4, 5, 6].map(hour => (
                    <option key={hour} value={`Hour ${hour}`}>
                      Hour {hour}
                    </option>
                  ))}
              </select>
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Date</label>
            <input type="date" className="w-full p-2 border rounded-md"  value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}/>
          </div>
        </div>

      {/* Attendance Table (Visible on larger screens) */}
      {selectedBranch && selectedSemester && selectedAcademicYear && (
          filteredStudents.length > 0 ? (
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
            {filteredStudents.map((student) => (
              <tr key={student.student_id} className="border-b border-gray-200">
                <td className="p-2 text-gray-700">{student.student_id}</td>
                <td className="p-2 text-gray-700">{student.username}</td>
                <td className="p-2 text-center">
                <button  className={`px-6 py-2 rounded-full text-white font-semibold transition-all
                    ${attendance[student.student_id] === 'Present'
                      ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 `}
                    onClick={() => toggleAttendance(student.student_id)}
                >
                    {attendance[student.student_id]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          ) : (
        <p className="block md:hidden text-sm text-center p-6 text-gray-500">
          No students found for the selected branch, semester, and academic year.</p>
          )
      )}
      {/* Attendance Cards (Visible on mobile screens) */}
      {selectedBranch && selectedSemester && selectedAcademicYear && (
          filteredStudents.length > 0 ? (
      <div className="md:hidden p-6">
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student.student_id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-500 text-sm">{student.student_id}</p>
                <p className="text-gray-700 font-semibold">{student.username}</p>
              </div>
              <button  className={`px-6 py-2 rounded-full text-white font-semibold transition-all
                    ${attendance[student.student_id] === 'Present'
                      ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      attendance[student.RegNo] === "Present"
                        ? "focus:ring-green-500"
                        : "focus:ring-red-500"
                    }`}
                    onClick={() => toggleAttendance(student.student_id)}
                >
                {attendance[student.student_id]}
              </button>
            </div>
          ))}
        </div>
      </div>
      ) : (
      <p className="hidden md:block text-base text-center p-6 text-gray-500">
        No students found for the selected branch, semester, and academic year.
      </p>
      )
    )}

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
              .filter((student) => attendance[student.student_id] === "Present")
              .map((student) => (
                <li key={student.student_id} className="text-gray-700">
                  {student.username}
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
              .filter((student) => attendance[student.student_id] === "Absent")
              .map((student) => (
                <li key={student.student_id} className="text-gray-700">
                  {student.username}
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center items-center mt-8 gap-4">
        <button className="border bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full" onClick={saveAttendance}>
          Save
        </button>
        <button className="border bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full" onClick={submitAttendance}>
          Submit
        </button>
      </div>
    </div>
  </div>
  );
};

export default TakeAttendance;