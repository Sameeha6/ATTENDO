import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [approvedRequests, setApprovedRequests] = useState({});

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

        // Track approved requests and their expiration
        const approved = {};
        requestRes.data.forEach(req => {
          if (req.status === 'Approved' && req.expiration_time) {
            approved[req.timetable_entry.id] = req.expiration_time;
          }
        });
        setApprovedRequests(approved);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load timetable data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedApprovedRequests = {...approvedRequests};
      let changed = false;
      
      for (const [entryId, expiration] of Object.entries(approvedRequests)) {
        if (new Date(expiration) <= now) {
          delete updatedApprovedRequests[entryId];
          changed = true;
        }
      }
      
      if (changed) {
        setApprovedRequests(updatedApprovedRequests);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [approvedRequests]);

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
    // If it's the faculty's own class
    if (entry.faculty.id === facultyId) {
      navigate('/faculty/take-attendance', { state: { subject: entry.subject } });
      return;
    }

    // Check if there's an existing request for this entry
    const existingRequest = hourChangeRequests.find(
      req => req.requester.id === facultyId && req.timetable_entry.id === entry.id
    );

    // For non-allocated hours or any other case, show the modal
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleConfirmRequest = async () => {
    try {
      // Check if request already exists
      const res = await axios.get("http://127.0.0.1:8000/api/request-hour-change/");
      const exists = res.data.find(
        req => req.requester.id === facultyId && req.timetable_entry.id === selectedEntry.id
      );

      if (exists) {
        if (exists.status === 'Pending') {
          toast.info("Request is already pending approval.");
        } else if (exists.status === 'Approved') {
          toast.success("This request has already been approved.");
        } else if (exists.status === 'Rejected') {
          await axios.post("http://127.0.0.1:8000/api/request-hour-change/", {
            faculty_id: facultyId,
            timetable_id: selectedEntry.id
          });
          toast.success("Request re-sent to HOD.");
        }
      } else {
        await axios.post("http://127.0.0.1:8000/api/request-hour-change/", {
          faculty_id: facultyId,
          timetable_id: selectedEntry.id
        });
        toast.success("Request sent to HOD.");
      }

      setShowModal(false);
      setSelectedEntry(null);
      
      // Refresh requests data
      const requestRes = await axios.get("http://127.0.0.1:8000/api/request-hour-change/");
      setHourChangeRequests(requestRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Error processing request");
    }
  };

  // Helper function to get request status for an entry
  const getRequestStatus = (entryId) => {
    const request = hourChangeRequests.find(
      req => req.requester.id === facultyId && req.timetable_entry.id === entryId
    );
    return request ? request.status : null;
  };

  // Helper function to get time remaining for approved requests
  const getTimeRemaining = (expirationTime) => {
    if (!expirationTime) return null;
    const now = new Date();
    const expiration = new Date(expirationTime);
    const diff = expiration - now;
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-5">
      <ToastContainer />
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Faculty Schedule Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          View your scheduled classes. Click on your allocated subjects to mark attendance.
          Filter by branch and semester to find your classes.
        </p>
        <p className='font-bold mt-8 text-red-700 text-left pl-4'>
          NP: <span className=' font-normal text-black'>Filter by semester and branch before selecting your scheduled hour</span>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    const requestStatus = getRequestStatus(entry.id);
                    const expirationTime = approvedRequests[entry.id];
                    const timeRemaining = expirationTime ? getTimeRemaining(expirationTime) : null;
                    const isExpired = timeRemaining !== null && timeRemaining <= 0;

                    return (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.day}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.time}</td>
                        <td 
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isOwn 
                              ? 'bg-orange-100 font-medium text-orange-800 cursor-pointer' 
                              : 'cursor-pointer'
                          }`}
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
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No classes found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {getRequestStatus(selectedEntry.id) === 'Rejected' ? 'Resend Hour Change Request' : 'Request Hour Change'}
            </h2>
            <div className="space-y-3 mb-6">
              <p className="text-sm"><span className="font-medium">Day:</span> {selectedEntry.day}</p>
              <p className="text-sm"><span className="font-medium">Time:</span> {selectedEntry.time}</p>
              <p className="text-sm"><span className="font-medium">Subject:</span> {selectedEntry.subject.name}</p>
              <p className="text-sm"><span className="font-medium">Current Faculty:</span> {selectedEntry.faculty.username}</p>
              <p className="text-sm text-gray-600 mt-3">
                You're requesting to take over this class hour from {selectedEntry.faculty.username}.
                The HOD will need to approve this change.
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
                {getRequestStatus(selectedEntry.id) === 'Rejected' ? 'Resend Request' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;