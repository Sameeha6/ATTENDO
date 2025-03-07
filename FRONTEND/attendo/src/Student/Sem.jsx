import { FaCheckCircle, FaClock, FaChartBar } from "react-icons/fa";
import HistoryNav from "./HistoryNav";

const data = [
  { semester: "Semester 1", total: 120, attended: 100 },
  { semester: "Semester 2", total: 130, attended: 110 },
  { semester: "Semester 3", total: 125, attended: 90 },
  { semester: "Semester 4", total: 140, attended: 115 }
];

const Sem = () => {
  return (
    <div className="p-2 min-h-screen">
      <div className="bg-white text-black p-6 rounded-lg text-xl font-bold shadow-md flex items-center gap-3">
         Semester-wise Attendance Report
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {data.map((item, index) => {
          const percentage = ((item.attended / item.total) * 100).toFixed(2);
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-1">
                 {item.semester}
              </h2>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-blue-500" /> <span>Total Hours:</span>
                  </div>
                  <span className="text-gray-800 font-medium">{item.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCheckCircle className="text-green-500" /> <span>Attended Hours:</span>
                  </div>
                  <span className="text-gray-800 font-medium">{item.attended}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaChartBar className={percentage >= 75 ? "text-green-500" : percentage >= 50 ? "text-yellow-500" : "text-red-500"} /> <span>Attendance %:</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${percentage >= 75 ? "bg-green-100 text-green-700" : percentage >= 50 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
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

export default Sem;
