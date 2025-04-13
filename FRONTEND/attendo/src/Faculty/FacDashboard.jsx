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
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("faculty_id");
    if (storedId) setFacultyId(parseInt(storedId));

    axios.get('http://127.0.0.1:8000/api/timetables/')
      .then((res) => {
        setTimetable(res.data);
        const uniqueBranches = [...new Map(res.data.map(item => [item.branch.id, item.branch])).values()];
        setBranches(uniqueBranches);
        setFilteredTimetable(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...timetable];
    if (selectedBranch) filtered = filtered.filter(entry => entry.branch.id === parseInt(selectedBranch));
    if (selectedSemester) filtered = filtered.filter(entry => entry.semester === parseInt(selectedSemester));
    setFilteredTimetable(filtered);
  }, [selectedBranch, selectedSemester, timetable]);

  const handleSubjectClick = (entry) => {
    if (entry.faculty.id === facultyId) {
      window.location.href = "/faculty/take-attendance"; // 🧭 Redirect to take attendance
    } else {
      setSelectedEntry(entry);  // Show modal
      setShowModal(true);
    }
  };

  const handleConfirmRequest = () => {
    axios.get("http://127.0.0.1:8000/api/request-hour-change/")
      .then((res) => {
        const exists = res.data.find(
          req => req.requester.id === facultyId && req.timetable_entry.id === selectedEntry.id
        );

        if (exists) {
          if (exists.status === 'Pending') {
            alert("Request is already pending.");
          } else if (exists.status === 'Rejected') {
            alert("Previous request was rejected.");
          } else {
            alert("Already approved. Please refresh the page.");
          }
        } else {
          axios.post("http://127.0.0.1:8000/api/request-hour-change/", {
            faculty_id: facultyId,
            timetable_id: selectedEntry.id
          })
            .then(() => {
              alert("Request sent to HOD.");
              setShowModal(false);
              setSelectedEntry(null);
            })
            .catch(err => {
              console.error(err);
              alert("Error sending request.");
            });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error checking existing requests.");
      });
  };

  return (
    <div className="container mx-auto mt-14 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Branch</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Semester</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
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
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Faculty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTimetable.length > 0 ? filteredTimetable.map((entry) => {
                const isOwn = entry.faculty.id === facultyId;
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{entry.day}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{entry.time}</td>
                    <td
                      onClick={() => handleSubjectClick(entry)}
                      className={`px-6 py-3 text-sm font-medium cursor-pointer ${isOwn ? 'text-orange-500 bg-orange-100' : 'text-blue-600 hover:underline'}`}
                    >
                      {entry.subject.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{entry.subject.code}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{entry.faculty.username}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Request Hour Change</h2>
            <p><strong>Day:</strong> {selectedEntry.day}</p>
            <p><strong>Time:</strong> {selectedEntry.time}</p>
            <p><strong>Subject:</strong> {selectedEntry.subject.name}</p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
              <button onClick={handleConfirmRequest} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
