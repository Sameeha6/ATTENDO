import { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaChartBar } from "react-icons/fa";
import axios from "axios";

const ParentSemesterReport = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const studentId = localStorage.getItem("student_id");
        if (!studentId) {
          setError("Student ID not found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/student-report-semester/?student_id=${studentId}`
        );

        console.log(response.data);
        setAttendanceData(response.data);
      } catch (err) {
        setError("Error fetching data! Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-2 min-h-screen">
      <div className="bg-white text-black p-6 rounded-lg text-xl font-bold shadow-md flex items-center gap-3">
        Semester-wise Attendance Report
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {attendanceData.map((item, index) => {
          const percentage = item.attendance_percentage.toFixed(2);
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-1">
                {item.semester}
              </h2>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-blue-500" /> <span>Total Hours:</span>
                  </div>
                  <span className="text-gray-800 font-medium">{item.total_hours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCheckCircle className="text-green-500" /> <span>Attended Hours:</span>
                  </div>
                  <span className="text-gray-800 font-medium">{item.present_hours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaChartBar
                      className={
                        percentage >= 75
                          ? "text-green-500"
                          : percentage >= 50
                          ? "text-yellow-500"
                          : "text-red-500"
                      }
                    />
                    <span>Attendance %:</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${percentage >= 75
                        ? "bg-green-100 text-green-700"
                        : percentage >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParentSemesterReport;