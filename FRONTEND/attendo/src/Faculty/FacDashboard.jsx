import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filteredTimetable, setFilteredTimetable] = useState([]);
  const [facultyId, setFacultyId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [hourChangeRequests, setHourChangeRequests] = useState([]);

  useEffect(() => {
    const storedId = localStorage.getItem("faculty_id");
    if (storedId) setFacultyId(parseInt(storedId));

    const fetchData = async () => {
      try {
        const [timetableRes, requestRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/timetables/'),
          axios.get("http://127.0.0.1:8000/api/request-hour-change/")
        ]);

        setTimetable(timetableRes.data);
        const uniqueBranches = [...new Map(timetableRes.data.map(item => [item.branch.id, item.branch])).values()];
        setBranches(uniqueBranches);
        setFilteredTimetable(timetableRes.data);
        setHourChangeRequests(requestRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...timetable];
    
    if (selectedBranch) {
      filtered = filtered.filter(entry => entry.branch.id === parseInt(selectedBranch));
    }

    if (selectedSemester) {
      filtered = filtered.filter(entry => {
        const semesterNumber = entry.semester.replace(/\D/g, '');
        return parseInt(semesterNumber) === parseInt(selectedSemester);
      });
    }
    
    setFilteredTimetable(filtered);
  }, [selectedBranch, selectedSemester, timetable]);

  const handleSubjectClick = (entry) => {
    if (entry.faculty.id === facultyId) {
      navigate('/faculty/take-attendance', { state: { subject: entry.subject } });
      return;
    }

    const existingRequest = hourChangeRequests.find(
      (req) => req.requester.id === facultyId && req.timetable_entry.id === entry.id
    );

    if (existingRequest) {
      if (existingRequest.status === 'Approved') {
        navigate('/faculty/take-attendance', { state: { subject: entry.subject } });
      } else if (existingRequest.status === 'Pending') {
        alert("Your request is still pending approval.");
      } else if (existingRequest.status === 'Rejected') {
        setSelectedEntry(entry);
        setShowModal(true);
      }
    } else {
      setSelectedEntry(entry);
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
          } else if (exists.status === 'Approved') {
            alert("Already approved. Please refresh the page.");
          } else if (exists.status === 'Rejected') {
            axios.post("http://127.0.0.1:8000/api/request-hour-change/", {
              faculty_id: facultyId,
              timetable_id: selectedEntry.id
            })
              .then(() => {
                alert("Request re-sent to HOD.");
                setShowModal(false);
                setSelectedEntry(null);
              })
              .catch(err => {
                console.error(err);
                alert("Error re-sending request.");
              });
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Faculty Schedule Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View your scheduled classes. Click on your allocated subjects to mark attendance.
          Filter by branch and semester to find your classes.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedBranch} 
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg "
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimetable.length > 0 ? (
                  filteredTimetable.map((entry) => {
                    const isOwn = entry.faculty.id === facultyId;
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.day}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.time}</td>
                        <td 
                          className={`px-6 py-4 whitespace-nowrap text-sm ${isOwn ? 'bg-orange-100 font-medium text-orange-800 cursor-pointer' : 'text-gray-500 cursor-pointer'}`}
                          onClick={() => handleSubjectClick(entry)}
                        >
                          {entry.subject.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.subject.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.faculty.username}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No classes found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Request Hour Change</h2>
            <div className="space-y-3 mb-6">
              <p className="text-sm"><span className="font-medium">Day:</span> {selectedEntry.day}</p>
              <p className="text-sm"><span className="font-medium">Time:</span> {selectedEntry.time}</p>
              <p className="text-sm"><span className="font-medium">Subject:</span> {selectedEntry.subject.name}</p>
              <p className="text-sm text-gray-600 mt-3">
                You're requesting to take this class hour from {selectedEntry.faculty.username}.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRequest}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;