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
    <div className="bg-gray-50 font-sans min-h-screen p-4 md:p-6 lg:p-8 mt-10 md:mt-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-3xl font-bold text-cyan-950 mb-4 md:mb-6 text-center">
          Subject Report
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {studentDetails.branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
            >
              <option value="">All Years</option>
              {[...new Set(studentDetails.students.map((s) => s.academic_year))].map(
                (year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[...new Set(studentDetails.students.map((s) => s.semester))].map(
                (sem, index) => (
                  <option key={index} value={sem}>
                    {sem}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {studentDetails.subjects.map((subject, index) => (
                <option key={index} value={subject.subject_name}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedSubject || "All Subjects"}
            </h2>
            <p className="text-gray-600 mt-1">
              Students Enrolled:{" "}
              <span className="font-bold text-blue-600">
                {filteredStudents.length}
              </span>
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    RegNo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Attendance %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Mark (out of 5)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, idx) => {
                    const attendance = attendanceData[student.student_id];
                    const percentageColor = attendance
                      ? attendance.percentage >= 75
                        ? "text-green-600"
                        : attendance.percentage >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                      : "";
                    
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-500">
                          {student.student_id}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                          {student.username}
                        </td>
                        <td className={`px-6 py-2 whitespace-nowrap text-gray-500 text-sm font-medium ${percentageColor}`}>
                          {attendance
                            ? `${attendance.percentage.toFixed(2)}%`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                          {attendance ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {attendance.marksOutOfFive}
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No students found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyReport;