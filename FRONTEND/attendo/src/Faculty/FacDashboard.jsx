import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacultyDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [facultyId, setFacultyId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem("faculty_id");
    if (storedId) {
      setFacultyId(parseInt(storedId)); 
    }

    axios
      .get('http://127.0.0.1:8000/api/timetables/')
      .then((response) => {
        const data = response.data;
        setTimetable(data);

        const uniqueBranches = [...new Map(data.map(item => [item.branch.id, item.branch])).values()];
        setBranches(uniqueBranches);
        setFilteredTimetable(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...timetable];

    if (selectedBranch) {
      filtered = filtered.filter(entry => entry.branch.id === parseInt(selectedBranch));
    }
    if (selectedSemester) {
      filtered = filtered.filter(entry => entry.semester === parseInt(selectedSemester));
    }

    setFilteredTimetable(filtered);
  }, [selectedBranch, selectedSemester, timetable]);

  const handleSubjectClick = (entry) => {
    if (entry.faculty.id === facultyId) return;
  
    axios
      .get("http://127.0.0.1:8000/api/request-hour-change/")
      .then((response) => {
        const existingRequest = response.data.find(
          (req) =>
            req.requester.id === facultyId &&
            req.timetable_entry.id === entry.id
        );
  
        if (existingRequest) {
          if (existingRequest.status === 'Approved') {
            window.location.href = "stdattnd/"; 
          } else if (existingRequest.status === 'Pending') {
            alert("Request already sent and is pending HOD approval.");
          } else if (existingRequest.status === 'Rejected') {
            alert("Your previous request for this hour was rejected.");
          }
        } else {
          const confirmTakeHour = window.confirm(
            `Are you sure you want to take this hour?\n\nDay: ${entry.day}\nTime: ${entry.time}\nSubject: ${entry.subject.name}`
          );
  
          if (confirmTakeHour) {
            axios
              .post("http://127.0.0.1:8000/api/request-hour-change/", {
                faculty_id: facultyId,
                timetable_id: entry.id,
              })
              .then((res) => {
                alert("Request sent to HOD successfully.");
                setFilteredTimetable((prev) =>
                  prev.filter((item) => item.id !== entry.id)
                );
              })
              .catch((error) => {
                console.error("Failed to send request:", error);
                if (error.response?.data?.error) {
                  alert(error.response.data.error);
                } else {
                  alert("Failed to send request. Try again later.");
                }
              });
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="container mx-auto mt-14 max-w-6xl">
      {/* <div className="bg-white rounded-xl shadow-md p-6 mb-8 w-full"> */}
        {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Faculty Dashboard</h2> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Branch</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Semester</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200 px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Day</th>
                  <th className="px-6 py-3 ">Time</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Faculty</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimetable.length > 0 ? (
                  filteredTimetable.map((entry) => {
                    const isOwnSubject = entry.faculty.id === facultyId;

                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{entry.day}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.time}</td>
                        <td 
                          className={`px-6 py-3 whitespace-nowrap text-sm ${isOwnSubject ? 'bg-orange-100 font-semibold text-orange-300' : 'text-gray-500 hover:text-blue-600 cursor-pointer'}`}
                          onClick={() => !isOwnSubject && handleSubjectClick(entry)}
                        >
                          {entry.subject.name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.subject.code}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.faculty.username}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No timetable data available for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      {/* </div> */}
    </div>
  );
};

export default FacultyDashboard;