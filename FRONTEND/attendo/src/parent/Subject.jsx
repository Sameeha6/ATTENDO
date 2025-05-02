import { useState, useEffect } from "react";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const ParentSubjectReport = () => {
  const [data, setData] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);

  const student_id = localStorage.getItem("student_id");

  const fetchReport = async () => {
    if (!academicYear || !semester) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/student-subject-report/${student_id}/`,
        {
          params: {
            academic_year: academicYear,
            semester: semester,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch subject-wise report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [academicYear, semester]);

  // Function to calculate marks based on percentage
  const getMarksOutOfFive = (percentage) => {
    let marksOutOfFive = 1;
    if (percentage >= 90) marksOutOfFive = 5;
    else if (percentage >= 80) marksOutOfFive = 4;
    else if (percentage >= 70) marksOutOfFive = 3;
    else if (percentage >= 60) marksOutOfFive = 2;
    return marksOutOfFive;
  };

  return (
    <div className="p-2 min-h-screen">
      <div className="bg-white text-black p-6 rounded-lg text-xl font-bold shadow-md flex items-center gap-3">
        Subject-wise Attendance Report
      </div>

      <div className="flex gap-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Academic Year
          </label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="border p-2 rounded"
            placeholder="eg:2022-26"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Semester
          </label>
          <input
            type="text"
            placeholder="eg:S2"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {loading ? (
        <p className="mt-4">Loading report...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {data.length > 0 ? (
            data.map((item, index) => {
              const percentage = (
                (item.present_hours / item.total_hours) *
                100
              ).toFixed(2);

              const marksOutOfFive = getMarksOutOfFive(percentage); // Get marks based on attendance

              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow flex items-center space-x-4"
                >
                  <PieChart width={80} height={80}>
                    <Pie
                      data={[{ value: item.present_hours }, { value: item.total_hours - item.present_hours }]}
                      cx={40}
                      cy={40}
                      innerRadius={25}
                      outerRadius={35}
                      fill="#ddd"
                      dataKey="value"
                    >
                      <Cell fill="#28A745" />
                      <Cell fill="#ddd" />
                    </Pie>
                  </PieChart>
                  <div>
                    <p className="text-lg font-bold">{percentage}%</p>
                    <p className="text-sm font-semibold">{item.subject_name}</p>
                    <p className="text-xs">Total hours: {item.total_hours}</p>
                    <p className="text-xs">Attended hours: {item.present_hours}</p>
                    <p className="text-xs font-bold">Mark (out of 5): {marksOutOfFive}</p> {/* Display marks */}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-2 text-center text-gray-500">No data found. Select academic year & semester.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentSubjectReport;