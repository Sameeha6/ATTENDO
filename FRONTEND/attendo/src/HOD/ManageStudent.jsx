import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const [form, setForm] = useState({
    username: "",
    student_id: "",
    email: "",
    phone_number: "",
    academic_year: "",
    branch_id: "",
    semester: "",
  });

  const [filters, setFilters] = useState({
    academic_year: "",
    // branch_id: "",
    semester: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchBranches();
  }, []);

  const fetchStudents = async () => {
    const hod_id = localStorage.getItem("hod_id");
    console.log("HOD ID:", hod_id);

    const res = await axios.get(`http://127.0.0.1:8000/api/students-under-hod/${hod_id}/`);
    setStudents(res.data);
  };

  const fetchBranches = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/branches/");
    setBranches(res.data);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/students/", form);
      setForm({
        username: "",
        student_id: "",
        email: "",
        phone_number: "",
        academic_year: "",
        branch_id: "",
        semester: "",
      });
      fetchStudents();
    } catch (err) {
      console.error("POST Error:", err.response?.data || err.message);
    }
  };

  const openModal = (student) => {
    setForm({
      username: student.username || "",
      student_id: student.student_id || "",
      email: student.email || "",
      phone_number: student.phone_number || "",
      academic_year: student.academic_year || "",
      branch_id: student.branch?.id || "",
      semester: student.semester || "",
    });
    setEditStudentId(student.id);  // <- Make sure `student.id` exists
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({
      username: "",
      student_id: "",
      email: "",
      phone_number: "",
      academic_year: "",
      branch_id: "",
      semester: "",
    });
    setEditStudentId(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/students/${editStudentId}/`,
        form
      );
      closeModal();
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${id}/`);
      fetchStudents();
      alert("Student deleted successfully.");
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student. Please try again.");
    }
  };

  const filteredStudents = students.filter((student) => {
    return (
      (!filters.academic_year ||
        student.academic_year === filters.academic_year) &&
      // (!filters.branch_id || student.branch?.id == filters.branch_id) &&
      (!filters.semester || student.semester === filters.semester)
    );
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Students</h2>

      {/* Filter UI */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Academic year</label>
            <input type="text" name="academic_year" value={filters.academic_year} onChange={handleFilterChange} className="w-full p-2 border rounded-md"/>
          </div>
          {/* <div>
            <label className="block mb-1 text-gray-600">Branch</label>
            <select name="branch_id" value={filters.branch_id} onChange={handleFilterChange} className="w-full p-2 border rounded-md" >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div> */}
          <div>
            <label className="block mb-1 text-gray-600">Semester</label>
            <select name="semester" value={filters.semester} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
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

      {/* Add Student */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Create Student</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="student_id" value={form.student_id} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" required placeholder="Student ID"/>
          <input name="username" value={form.username} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" required placeholder="Name"/>
          <input name="email" value={form.email} onChange={handleInputChange} type="email" className="w-full p-2 border rounded-md" placeholder="Email" required />
          <input name="phone_number" value={form.phone_number} onChange={handleInputChange} type="number" className="w-full p-2 border rounded-md" placeholder="Phone Number" required/>
          <input name="academic_year" value={form.academic_year} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Academic Year" required />
          <select name="branch_id" value={form.branch_id} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <select name="semester" value={form.semester} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md"
          onClick={handleAddStudent}
        >
          Add
        </button>
      </div>

      {/* Student List */}
      <h3 className="text-xl font-semibold mb-3">Student List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-1">#</th>
              <th className="border p-1">ID</th>
              <th className="border p-1">Name</th>
              <th className="border p-1">Email</th>
              <th className="border p-1">Phone No</th>
              <th className="border p-1">Year</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Semester</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredStudents.map((student, index) => (
              <tr key={student.id}>
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{student.student_id}</td>
                <td className="border p-1">{student.username}</td>
                <td className="border p-1">{student.email}</td>
                <td className="border p-1">{student.phone_number}</td>
                <td className="border p-1">{student.academic_year}</td>
                <td className="border p-1">{student.branch_name}</td>
                <td className="border p-1">{student.semester}</td>
                <td className="border p-1">
                  <button
                    className="text-blue-600"
                    onClick={() => openModal(student)}
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(student.id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12 z-50">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h3 className="text-xl font-semibold">Edit Student</h3>
              <button className="text-gray-600" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="student_id" value={form.student_id} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Student ID"/>
              <input name="username" value={form.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Name" />
              <input name="email" value={form.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Email"/>
              <input name="phone_number" value={form.phone_number} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Phone Number"/>
              <input name="academic_year" value={form.academic_year} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Academic Year"/>
              <select name="branch_id" value={form.branch_id} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <select name="semester" value={form.semester} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-950 text-white px-4 py-1 rounded-md" onClick={handleUpdate}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
