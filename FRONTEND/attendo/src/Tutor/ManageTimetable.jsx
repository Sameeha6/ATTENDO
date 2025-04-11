import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "9:30-10:30", "10:30-11:30", "11:30-12:30", "1:30-2:30", "2:30-3:30", "3:30-4:30"
];

const ManageTimetable = ({ tutorId }) => {
  const [semesters, setSemesters] = useState([]);
  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const [timetable, setTimetable] = useState([]);
  const [form, setForm] = useState({ semester: "", day: "", time: "", subject_id: "", faculty_id: "" ,branch_id:""});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
      fetchSubjectsAndSemesters();
      // fetchTimetable();
  
  }, []);

  const fetchSubjectsAndSemesters = async () => {
    const tutor_id=localStorage.getItem("tutor_id")

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/subjects-and-semesters/?tutor_id=${tutor_id}`);
      console.log(res)
      setSemesters(res.data.semesters);
      setSubjectsBySemester(res.data.subjects_by_semester);
    } catch (err) {
      console.error(err);
    }
  };

  // const fetchTimetable = async () => {
  //   try {
  //     const res = await axios.get(`http://127.0.0.1:8000/api/timetbl-faculty/?faculty_id=${tutorId}`);
  //     setTimetable(res.data.timetable);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleChange = (e) => {
    
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form)

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tutor_id=localStorage.getItem("tutor_id")

     // build payload matching your serializer
     const payload = {
      semester: parseInt(form.semester, 10),
      day: form.day,
      time:form.time,
      subject_id: parseInt(form.subject_id, 10),
      faculty_id: parseInt(form.faculty_id, 10),
      branch_id: parseInt(form.branch_id, 10),
    };

    try {
      const res = await axios.post(
        
        'http://localhost:8000/api/add-timetable/',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(res.data);
      alert('Timetable added successfully!');
    
      setForm({
        semester: '',
        day: '',
        time: '',
        subject_id: '',
        faculty_id: '',
        branch_id: form.branch_id
      });
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Failed to add timetable; see console for details.');
    }
  };

  
  const handleEdit = (entry) => {
    setForm({
      semester: entry.semester,
      day: entry.day,
      time: entry.time,
      subject_id: entry.subject.id,
      faculty_id: entry.faculty.id
    });
    setEditingId(entry.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-timetable/${id}/`);
      fetchTimetable();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Timetable</h2>
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <select
            className="w-full p-2 border rounded-md"
            name="semester"
            value={form.semester}
            onChange={handleChange}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>{`Semester ${sem}`}</option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            name="day"
            value={form.day}
            onChange={handleChange}
          >
            <option value="">Select Day</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            name="time"
            value={form.time}
            onChange={handleChange}
          >
            <option value="">Select Time</option>
            {times.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            name="subject_id"
            value={form.subject_id}
            onChange={handleChange}
          >
            <option value="">Select Subject</option>
            {form.semester &&
              subjectsBySemester[form.semester]?.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {`${subj.subject_code} - ${subj.subject_name}`}
                </option>
              ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            name="faculty_id"
            value={form.faculty_id}
            onChange={handleChange}
          >
            <option value="">Select Faculty</option>
            {form.semester &&
              subjectsBySemester[form.semester]
                ?.filter((subj) => subj.faculty)
                .map((subj) => (
                  <option key={subj.faculty.id} value={subj.faculty.id}>
                    {`${subj.faculty.username} (${subj.faculty.email})`}
                  </option>
                ))}
          </select>
          <button type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
            {editingId ? "Update" : "Add"} Timetable
          </button>
        </form>
      </div>

      <h3 className="text-xl font-semibold mb-3">Timetable List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Semester</th>
              <th className="border p-1">Day</th>
              <th className="border p-1">Time</th>
              <th className="border p-1">Subject</th>
              <th className="border p-1">Faculty</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {timetable.map((entry, index) => (
              <tr key={entry.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{entry.semester}</td>
                <td className="border p-1">{entry.day}</td>
                <td className="border p-1">{entry.time}</td>
                <td className="border p-1">{entry.subject.name}</td>
                <td className="border p-1">{entry.faculty.username}</td>
                <td className="border p-1">
                  <button className="text-blue-500" onClick={() => handleEdit(entry)}>
                    <FaEdit />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-500" onClick={() => handleDelete(entry.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTimetable;
