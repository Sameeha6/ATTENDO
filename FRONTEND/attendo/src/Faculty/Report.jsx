import React, { useEffect, useState } from "react";
import axios from "axios";

const FacultyReport = () => {
  const [studentDetails, setStudentDetails] = useState({
    subjects: [],
    branches: [],
    students: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [attendanceData, setAttendanceData] = useState({});

  // Fetch student + subject + branch data
  useEffect(() => {
    const faculty_id = localStorage.getItem("faculty_id");
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/facultybranchstds/${faculty_id}/`
        );
        console.log(response)
        setStudentDetails(response.data);
      } catch (err) {
        setError("Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, []);

  // Fetch attendance report
  useEffect(() => {
    const faculty_id = localStorage.getItem("faculty_id");
    if (
      !faculty_id ||
      !selectedBranch ||
      !selectedAcademicYear ||
      !selectedSemester ||
      !selectedSubject
    )
      return;
      const fetchAttendanceReport = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/attendance-report/${faculty_id}/`,
            {
              params: {
                branch_name: selectedBranch,
                academic_year: selectedAcademicYear,
                semester: selectedSemester,
                subject_name: selectedSubject,
              },
            }
          );
          console.log(response)
      
          const attendanceMap = {};
          response.data.forEach((student) => {
            const percentage = student.attendance_percentage;
            let marksOutOfFive = 1;
            if (percentage >= 90) marksOutOfFive = 5;
            else if (percentage >= 80) marksOutOfFive = 4;
            else if (percentage >= 70) marksOutOfFive = 3;
            else if (percentage >= 60) marksOutOfFive = 2;
      
            attendanceMap[student.student_id] = {
              percentage,
              marksOutOfFive,
            };
          });
      
          setAttendanceData(attendanceMap);
        } catch (err) {
          console.error("Failed to fetch attendance report", err);
        }
      };
      

    fetchAttendanceReport();
  }, [selectedBranch, selectedAcademicYear, selectedSemester, selectedSubject]);

  const filteredStudents = studentDetails.students.filter((student) => {
    const branchMatch = selectedBranch
      ? student.branch_name === selectedBranch
      : true;
    const yearMatch = selectedAcademicYear
      ? student.academic_year === selectedAcademicYear
      : true;
    const semesterMatch = selectedSemester
      ? student.semester === selectedSemester
      : true;
    const subjectMatch = selectedSubject
      ? studentDetails.subjects.some(
          (subject) =>
            subject.subject_name === selectedSubject &&
            subject.branch_name === student.branch_name
        )
      : true;
    return branchMatch && yearMatch && semesterMatch && subjectMatch;
  });

  return (
    <div className="bg-gray-50 font-sans min-h-screen p-4 mt-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Subject Report</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">Select Branch</option>
          {studentDetails.branches.map((branch) => (
            <option key={branch.id} value={branch.name}>
              {branch.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedAcademicYear}
          onChange={(e) => setSelectedAcademicYear(e.target.value)}
        >
          <option value="">Select Academic Year</option>
          {[...new Set(studentDetails.students.map((s) => s.academic_year))].map(
            (year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            )
          )}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">Select Semester</option>
          {[...new Set(studentDetails.students.map((s) => s.semester))].map(
            (sem, index) => (
              <option key={index} value={sem}>
                {sem}
              </option>
            )
          )}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {studentDetails.subjects.map((subject, index) => (
            <option key={index} value={subject.subject_name}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      {/* Student Table */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedSubject || "No subject selected"}
          </h2>
          <p className="text-gray-600">
            Students Enrolled:{" "}
            <span className="font-bold">{filteredStudents.length}</span>
          </p>
          <table className="w-full mt-3 border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">RegNo</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Attendance %</th>
                <th className="border p-2 text-left">Mark (out of 5)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => {
                  const attendance = attendanceData[student.student_id];
                  return (
                    <tr key={idx}>
                      <td className="border p-2">{student.student_id}</td>
                      <td className="border p-2">{student.username}</td>
                      <td className="border p-2">
                        {attendance
                          ? `${attendance.percentage.toFixed(2)}%`
                          : "N/A"}
                      </td>
                      <td className="border p-2">
                        {attendance ? attendance.marksOutOfFive : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-2">
                    No students found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyReport;