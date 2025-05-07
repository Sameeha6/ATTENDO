import React, { useState, useEffect } from "react";
import axios from "axios";

const ParentHourlyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [semester, setSemester] = useState("");
  const [month, setMonth] = useState("");

  const reshapeAttendance = (attendanceList) => {
    const groupedByDate = {};

    attendanceList.forEach((record) => {
      const { date, hour, status } = record;
      if (!groupedByDate[date]) {
        groupedByDate[date] = { date };
      }

      switch (hour) {
        case "Hour 1":
          groupedByDate[date].hour1 = status || "-";
          break;
        case "Hour 2":
          groupedByDate[date].hour2 = status || "-";
          break;
        case "Hour 3":
          groupedByDate[date].hour3 = status || "-";
          break;
        case "Hour 4":
          groupedByDate[date].hour4 = status || "-";
          break;
        case "Hour 5":
          groupedByDate[date].hour5 = status || "-";
          break;
        case "Hour 6":
          groupedByDate[date].hour6 = status || "-";
          break;
        default:
          break;
      }
    });

    return Object.values(groupedByDate);
  };

  useEffect(() => {
    const fetchAttendanceDetails = async () => {
      const StudentId = localStorage.getItem("student_id"); 
      if (!semester || !month) {
        setAttendanceData([]);
        setLoading(false);
        return;
      }
  
      const filters = {
        semester,
        month,
      };
  
      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/student-hour-attendance/${StudentId}/`,
          { params: filters }
        );
        const reshapedData = reshapeAttendance(response.data.attendance || []);
        setAttendanceData(reshapedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAttendanceDetails();
  }, [semester, month]);
  

  const renderStatus = (status) => {
    if (status === "Present") {
      return <span className="text-green-600">✅</span>;
    } else if (status === "Absent") {
      return <span className="text-red-600">❌</span>;
    }
    return <span>-</span>;
  };

  return (
    <div className="p-4 w-full min-h-screen bg-gray-50">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white text-black mb-6 p-4 rounded-lg font-bold shadow-md gap-3">
        <h1 className="text-xl">Hourly Attendance</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <select
            className="border-2 border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            <option value="S1">Semester 1</option>
            <option value="S2">Semester 2</option>
            <option value="S3">Semester 3</option>
            <option value="S4">Semester 4</option>
            <option value="S5">Semester 5</option>
            <option value="S6">Semester 6</option>
            <option value="S7">Semester 7</option>
            <option value="S8">Semester 8</option>
          </select>
          <select
            className="border-2 border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:border-blue-500"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="9">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>


      {loading && <p className="text-gray-600">Loading attendance data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Attendance Table */}
      {!loading && !error && attendanceData.length > 0 && (
        <div className="bg-white rounded-xl shadow-2xl overflow-x-auto">
          <table className="w-full">
            <thead className=" bg-white sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left text-black font-semibold">Date</th>
                <th className="p-4 text-center text-black font-semibold">Hour 1</th>
                <th className="p-4 text-center text-black font-semibold">Hour 2</th>
                <th className="p-4 text-center text-black font-semibold">Hour 3</th>
                <th className="p-4 text-center text-black font-semibold">Hour 4</th>
                <th className="p-4 text-center text-black font-semibold">Hour 5</th>
                <th className="p-4 text-center text-black font-semibold">Hour 6</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-4 text-gray-700 font-medium">{record.date}</td>
                  <td className="p-4 text-center">{renderStatus(record.hour1)}</td>
                  <td className="p-4 text-center">{renderStatus(record.hour2)}</td>
                  <td className="p-4 text-center">{renderStatus(record.hour3)}</td>
                  <td className="p-4 text-center">{renderStatus(record.hour4)}</td>
                  <td className="p-4 text-center">{renderStatus(record.hour5)}</td>
                  <td className="p-4 text-center">{renderStatus(record.hour6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && attendanceData.length === 0 && semester && month && (
        <p className="text-gray-600">No attendance records for selected filters.</p>
      )}

  
      <div className="flex justify-center space-x-6 mt-8">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-green-600">
            ✅
          </span>
          <span className="text-gray-700">Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-red-600">
            ❌
          </span>
          <span className="text-gray-700">Absent</span>
        </div>
      </div>
    </div>
  );
};

export default ParentHourlyAttendance;