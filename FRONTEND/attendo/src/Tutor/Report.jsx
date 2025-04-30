import React, { useEffect, useState } from "react";
import axios from "axios";

const TutorReport = () => {
    const [students, setStudents] = useState([]);
    const [branches, setBranches] = useState([]);
    const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

    const [filters, setFilters] = useState({
        academic_year: "",
        // branch_id: "",
        semester: "",
      });

      const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
      };
    
      useEffect(() => {
          fetchStudents();
          fetchBranches();
        }, []);

        const fetchStudents = async () => {
            const tutorId = localStorage.getItem("tutor_id");
            console.log("TUTOR ID:", tutorId);
          
        const res = await axios.get(`http://127.0.0.1:8000/api/student-under-tutor/${tutorId}/`);
              setStudents(res.data);
            };
          
            const fetchBranches = async () => {
              const res = await axios.get("http://127.0.0.1:8000/api/branches/");
              setBranches(res.data);
            };
          


  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Sem-wise Report</h1>

      {/* Filters */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Academic year</label>
            <input type="text" name="academic_year" value={filters.academic_year} onChange={handleFilterChange} className="w-full p-2 border rounded-md"/>
          </div>
        
          <div>
            <label className="block mb-1 text-gray-600">Semester</label>
            <select name="semester" className="w-full p-2 border rounded-md">
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full mt-3 border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">RegNo</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">12345</td>
                <td className="border p-2">John Doe</td>
                <td className="border p-2">90%</td>
              </tr>
              <tr>
                <td className="border p-2">12346</td>
                <td className="border p-2">Jane Smith</td>
                <td className="border p-2">80%</td>

              </tr>
              <tr>
                <td className="border p-2">12347</td>
                <td className="border p-2">Mark Lee</td>
                <td className="border p-2">70%</td>
              </tr>
              <tr>
                <td className="border p-2">12348</td>
                <td className="border p-2">Lucy Wang</td>
                <td className="border p-2">60%</td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TutorReport;