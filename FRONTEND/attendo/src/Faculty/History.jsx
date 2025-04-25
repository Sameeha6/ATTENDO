import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    axios.get('http://localhost:8000/api/student-attendance/')
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

  const uniqueDates = () => {
    const dates = allStudents.flatMap(student =>
      student.attendance.map(a => a.date)
    );
    return [...new Set(dates)];
  };

  const uniqueHours = () => {
    if (!selectedDate) return [];
    const hours = allStudents.flatMap(student =>
      student.attendance
        .filter(a => a.date === selectedDate)
        .map(a => a.hour)
    );
    return [...new Set(hours)];
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

    axios.get(`http://localhost:8000/api/get-hod-for-branch/${branch}/`)
      .then(response => {
        console.log(response)
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

        axios.post('http://localhost:8000/api/attendance-edit-requests/', {
          requests: editRequests,
          hod_id: hodId,
        })
          .then((response) => {
            console.log('Attendance edit request sent to HOD:', response.data);
            setEditedStatuses({});
            setShowPopup(false);
          })
          .catch((error) => {
            console.error('Error submitting attendance edit request:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching HOD:', error);
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Attendance History</h1>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <select onChange={(e) => setSemester(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm">
          <option value="">Select Semester</option>
          {uniqueValues('semester').map((sem, idx) => (
            <option key={idx} value={sem}>{sem}</option>
          ))}
        </select>

        <select onChange={(e) => setAcademicYear(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm">
          <option value="">Select Academic Year</option>
          {uniqueValues('academic_year').map((year, idx) => (
            <option key={idx} value={year}>{year}</option>
          ))}
        </select>

        <select onChange={(e) => setBranch(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm">
          <option value="">Select Branch</option>
          {uniqueValues('branch_name').map((branch, idx) => (
            <option key={idx} value={branch}>{branch}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedDate(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm">
          <option value="">Select Date</option>
          {uniqueDates().map((date, idx) => (
            <option key={idx} value={date}>{date}</option>
          ))}
        </select>

        <select onChange={(e) => setHour(e.target.value)} className="border border-gray-300 p-2 rounded-md shadow-sm">
          <option value="">Select Hour</option>
          {uniqueHours().map((h, idx) => (
            <option key={idx} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {filteredStudents.length > 0 && selectedDate && hour ? (
        <div className="space-y-6">
          {filteredStudents.map((student, index) => {
            const currentStatus = getStatusByDate(student, selectedDate, hour);

            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-sm text-gray-700 mb-3">
                  <p><strong>Id:</strong> {student.student_id}</p>
                  <p><strong>Name:</strong> {student.username}</p>
                </div>

                <div className="pt-2 border-t flex justify-between items-center">
                  <span className={`font-medium ${currentStatus === 'Present' ? 'text-green-600' : currentStatus === 'Absent' ? 'text-red-500' : 'text-gray-400'}`}>
                    {selectedDate} - Hour {hour}: {currentStatus}
                  </span>
                  {currentStatus !== 'No Record' && (
                    <button
                      onClick={() => handleEditClick(student.student_id, currentStatus)}
                      className="text-blue-600 hover:underline text-sm ml-4"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {Object.keys(editedStatuses).length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowPopup(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
              >
                Submit Changes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p>Select date and hour to view attendance.</p>
        </div>
      )}

   
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 text-center animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Attendance Changes</h2>
            <p className="text-sm text-gray-600 mb-6">You have edited attendance statuses. Do you want to save these changes?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 hover:shadow-lg transition-all duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendancehistory;