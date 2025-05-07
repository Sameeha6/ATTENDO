import React, { useEffect, useState } from "react";
import axios from "axios";

const TutorReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filters, setFilters] = useState({
    semester: "",
  });

  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchAttendanceData = async () => {
    const tutorId = localStorage.getItem("tutor_id");
    const tutorBranch = localStorage.getItem("tutor_branch");
    const tutorAcademicYear = localStorage.getItem("tutor_academic_year");

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/tutor-report-semester/`, {
        params: {
          tutor_id: tutorId,
        },
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const filteredAttendance = attendanceData.filter((item) =>
    filters.semester ? item.semester === filters.semester : true
  );

  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-950 mb-2">Semester-wise Attendance Report</h1>
        <p className="text-gray-600">View and filter attendance by semester</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Semesters</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Attendance Records</h2>
        </div>
        <div className="px-5 py-3 bg-yellow-50 border-b border-gray-200 text-sm text-gray-700 flex items-center gap-2">
          <span className="w-4 h-4 inline-block bg-red-100 border-l-4 border-red-500"></span>
          Students highlighted in red have attendance below 75%
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No attendance records found for the selected filters
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Reg No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Semester
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      item.attendance_percentage < 75
                        ? 'bg-red-100 font-semibold border-l-4 border-red-500'
                        : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.student_id}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                      {item.student_name}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.semester}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.attendance_percentage >= 75
                            ? 'bg-green-100 text-green-800'
                            : item.attendance_percentage >= 50
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.attendance_percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorReport;