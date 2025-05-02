import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Attendancehistory = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [semester, setSemester] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [branch, setBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [hour, setHour] = useState('');
  const [editedStatuses, setEditedStatuses] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/student-attendance/')
      .then((response) => {
        setAllStudents(response.data.students);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filtered = allStudents.filter(student =>
      (!semester || student.semester === semester) &&
      (!academicYear || student.academic_year === academicYear) &&
      (!branch || student.branch_name === branch) &&
      (!selectedDate || student.attendance.some(a => a.date === selectedDate)) &&
      (!hour || student.attendance.some(a => a.date === selectedDate && a.hour === hour))
    );
    setFilteredStudents(filtered);
  }, [semester, academicYear, branch, selectedDate, hour, allStudents]);

  const uniqueValues = (key) => [...new Set(allStudents.map(student => student[key]))];
  const uniqueDates = () => [...new Set(allStudents.flatMap(student => student.attendance.map(a => a.date)))];
  const uniqueHours = () => {
    if (!selectedDate) return [];
    return [...new Set(allStudents.flatMap(student => student.attendance.filter(a => a.date === selectedDate).map(a => a.hour)))];
  };

  const getStatusByDate = (student, date, hour) => {
    const editedKey = `${student.student_id}_${hour}`;
    if (editedStatuses[editedKey]) return editedStatuses[editedKey];
    const entry = student.attendance.find(a => a.date === date && a.hour === hour);
    return entry ? entry.status : 'No Record';
  };

  const handleEditClick = (studentId, currentStatus) => {
    const toggledStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    setEditedStatuses(prev => ({
      ...prev,
      [`${studentId}_${hour}`]: toggledStatus
    }));
  };

  const handleConfirmSubmit = () => {
    const facultyId = localStorage.getItem('faculty_id');
    axios.get(`http://127.0.0.1:8000/api/get-hod-for-branch/${branch}/`)
      .then(response => {
        const hodId = response.data.hod_id;
        const editRequests = Object.entries(editedStatuses).map(([key, newStatus]) => {
          const [studentId, hour] = key.split('_');
          const student = allStudents.find(s => s.student_id === studentId);
          return {
            student_id: studentId,
            date: selectedDate,
            hour,
            new_status: newStatus,
            branch: student.branch_name,
            requested_by: facultyId,
          };
        });

        axios.post('http://127.0.0.1:8000/api/attendance-edit-requests/', {
          requests: editRequests,
          hod_id: hodId,
        })
          .then((response) => {
            toast.success('Attendance edit request sent to HOD:', response.data);
            setEditedStatuses({});
            setShowPopup(false);
          })
          .catch((error) => {
            toast.error('Error submitting attendance edit request:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching HOD:', error);
      });
  };

  return (
    <div className="max-w-6xl mx-auto mt-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-cyan-950">View Attendance History Here..</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 my-8">
        
        <select onChange={(e) => setSemester(e.target.value)} className="border p-2 rounded">
          <option value="">Semester</option>
          {uniqueValues('semester').map((sem, idx) => (
            <option key={idx} value={sem}>{sem}</option>
          ))}
        </select>

        <select onChange={(e) => setAcademicYear(e.target.value)} className="border p-2 rounded">
          <option value="">Academic Year</option>
          {uniqueValues('academic_year').map((year, idx) => (
            <option key={idx} value={year}>{year}</option>
          ))}
        </select>

        <select onChange={(e) => setBranch(e.target.value)} className="border p-2 rounded">
          <option value="">Branch</option>
          {uniqueValues('branch_name').map((branch, idx) => (
            <option key={idx} value={branch}>{branch}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded">
          <option value="">Date</option>
          {uniqueDates().map((date, idx) => (
            <option key={idx} value={date}>{date}</option>
          ))}
        </select>

        <select onChange={(e) => setHour(e.target.value)} className="border p-2 rounded">
          <option value="">Hour</option>
          {uniqueHours().map((h, idx) => (
            <option key={idx} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {filteredStudents.length > 0 && selectedDate && hour ? (
        <>
          {/* Table for large screens */}
          <div className="hidden md:block">
            <table className="w-full border border-gray-300 shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border-b">ID</th>
                  <th className="p-3 text-left border-b">Name</th>
                  <th className="p-3 text-left border-b">Status</th>
                  <th className="p-3 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  const currentStatus = getStatusByDate(student, selectedDate, hour);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{student.student_id}</td>
                      <td className="p-3 border-b">{student.username}</td>
                      <td className={`p-3 border-b font-medium ${currentStatus === 'Present' ? 'text-green-600' : currentStatus === 'Absent' ? 'text-red-500' : 'text-gray-400'}`}>
                        {currentStatus}
                      </td>
                      <td className="p-3 border-b">
                        {currentStatus !== 'No Record' && (
                          <button
                            onClick={() => handleEditClick(student.student_id, currentStatus)}
                            className="text-blue-600 font-semibold hover:underline text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards for small screens */}
          <div className="md:hidden space-y-4">
            {filteredStudents.map((student, index) => {
              const currentStatus = getStatusByDate(student, selectedDate, hour);
              return (
                <div key={index} className="bg-white border rounded-lg p-4 shadow">
                  <p><strong>ID:</strong> {student.student_id}</p>
                  <p><strong>Name:</strong> {student.username}</p>
                  <p className={`font-medium ${currentStatus === 'Present' ? 'text-green-600' : currentStatus === 'Absent' ? 'text-red-500' : 'text-gray-400'}`}>
                    {selectedDate} - Hour {hour}: {currentStatus}
                  </p>
                  {currentStatus !== 'No Record' && (
                    <button
                      onClick={() => handleEditClick(student.student_id, currentStatus)}
                      className="text-blue-600 hover:underline font-semibold text-sm mt-2 justify-end"
                    >
                      Edit
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {Object.keys(editedStatuses).length > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowPopup(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
              >
                Submit
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p>Select date and hour to view attendance.</p>
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Attendance Changes</h2>
            <p className="text-sm text-gray-600 mb-6">You have edited attendance statuses. Do you want to save these changes?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Attendancehistory;
