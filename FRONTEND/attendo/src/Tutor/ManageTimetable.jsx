import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "9:30:00", "10:30:00", "11:30:00", "1:30:00", "2:30:00", "3:30:00"
];

const ManageTimetable = ({ tutorId }) => {
  const [semesters, setSemesters] = useState([]);
  const [subjectsBySemester, setSubjectsBySemester] = useState({});
  const [timetable, setTimetable] = useState([]);
  const [form, setForm] = useState({ semester: "", day: "", time: "", subject_id: "", faculty_id: "" ,branch_id:""});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
      fetchSubjectsAndSemesters();
      fetchTimetable();
  
  }, []);

  useEffect(() => {
    console.log("Current semester:", form.semester);
    console.log("Subjects for semester:", subjectsBySemester[form.semester]);
  }, [form.semester, subjectsBySemester]);

  const fetchSubjectsAndSemesters = async () => {
    const tutor_id=localStorage.getItem("tutor_id")
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/subjects-and-semesters/?tutor_id=${tutor_id}`);
      console.log(res.data)
      const { branch } = res.data;
      setSemesters(res.data.semesters);
      setSubjectsBySemester(res.data.subjects_by_semester);
      
      if (branch?.id) {
        localStorage.setItem("branch_id", branch.id);
        setForm(fd => ({ ...fd, branch_id: branch.id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimetable = async () => {
    try {
    const tutorId=localStorage.getItem("tutor_id")
      const res = await axios.get(`http://127.0.0.1:8000/api/add-timetable/?tutor_id=${tutorId}`);
      console.log(res)
      setTimetable(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tutor_id = localStorage.getItem("tutor_id")
     // build payload matching your serializer
     const payload = {
      semester: form.semester,
      day: form.day,
      time:form.time,
      subject_id: parseInt(form.subject_id, 10),
      faculty_id: parseInt(form.faculty_id, 10),
      branch_id: parseInt(form.branch_id, 10),
    };
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/add-timetable/?tutor_id=${tutor_id}`,
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
    setIsModalOpen(true);
    setEditId(entry.id);
    setForm({
      ...form,
      semester: entry.semester,
      day: entry.day,
      time: entry.time,
      subject_id: entry.subject.id,
      faculty_id: entry.faculty.id,
      branch_id: form.branch_id,  // Keep current branch
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({
      semester: '',
      day: '',
      time: '',
      subject_id: '',
      faculty_id: '',
      branch_id: form.branch_id,
    });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        semester: form.semester,
        day: form.day,
        time: form.time,
        subject_id: parseInt(form.subject_id),
        faculty_id: parseInt(form.faculty_id),
        branch_id: parseInt(form.branch_id),
      };
  
      await axios.put(`http://127.0.0.1:8000/api/delete-timetable/${editId}/`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      alert("Updated successfully!");
      closeModal();
      fetchTimetable(); // refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
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
        <div className="bg-gray-100 rounded-md mb-6">
          <form className="bg-gray-100 p-3 rounded-md " onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-4">Add Timetable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="w-full p-2 border rounded-md" name="semester" value={form.semester} onChange={handleChange}>
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>{` ${sem}`}</option>
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
                        {`${subj.faculty.username}`}
                      </option>
                    ))}
              </select>
            </div>
            <button type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
              Add
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h3 className="text-xl font-semibold">Edit Timetable</h3>
              <button className="text-gray-600" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="w-full p-2 border rounded-md"
                name="semester"
                value={form.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>{` ${sem}`}</option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded-md"
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded-md"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              >
                <option value="">Select Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded-md"
                value={form.subject_id}
                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
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
                value={form.faculty_id}
                onChange={(e) => setForm({ ...form, faculty_id: e.target.value })}
              >
                <option value="">Select Faculty</option>
                {form.semester &&
                  subjectsBySemester[form.semester]
                    ?.filter((subj) => subj.faculty)
                    .map((subj) => (
                      <option key={subj.faculty.id} value={subj.faculty.id}>
                        {`${subj.faculty.username}`}
                      </option>
                    ))}
              </select>

            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-950 text-white px-4 py-1 rounded-md" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTimetable;
