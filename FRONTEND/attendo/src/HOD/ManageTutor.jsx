import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    branch: "",
    academic_year: "",
  });
  const [editTutorId, setEditTutorId] = useState(null);
  const [branches, setBranches] = useState([]);


  // 🔃 Fetch Tutors
  const fetchTutors = async () => {
    const hod_id = localStorage.getItem("hod_id");
    console.log("HOD ID:", hod_id);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/tutors-under-hod/${hod_id}/`);
      console.log("Tutors response:", res.data);
      setTutors(res.data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/branches/");
      setBranches(res.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  

  useEffect(() => {
    fetchTutors();
    fetchBranches();
  }, []);

  // 🆕 Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ➕ Add Tutor
  const handleAdd = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/add-tutor/", { ...formData });
      setFormData({ username: "", email: "", phone_number: "", branch: "", academic_year: "" });
      fetchTutors();
    } catch (error) {
      console.error("Error adding tutor:", error);
    }
  };

  // 🗑️ Delete Tutor
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tutors/${id}/`);
      fetchTutors();
    } catch (error) {
      console.error("Error deleting tutor:", error);
    }
  };

  // 📝 Edit Tutor - open modal
  const openModal = (tutor) => {
    setEditTutorId(tutor.id);
    setFormData({
      username: tutor.username,
      email: tutor.email,
      phone_number: tutor.phone_number,
      branch: tutor.branch,
      academic_year: tutor.academic_year,
    });
    setIsModalOpen(true);
  };

  // ✅ Update Tutor
  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000//api/tutors/${editTutorId}/`, { ...formData });
      setIsModalOpen(false);
      setFormData({ username: "", email: "", phone_number: "", branch: "", academic_year: "" });
      setEditTutorId(null);
      fetchTutors();
    } catch (error) {
      console.error("Error updating tutor:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Tutor</h2>

      {/* Add Tutor Form */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Tutor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" value={formData.username} onChange={handleChange} className="p-2 border rounded-md" placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} className="p-2 border rounded-md" placeholder="Email" />
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="p-2 border rounded-md" placeholder="Phone Number" />
          <select name="branch" value={formData.branch} onChange={handleChange} className="p-2 border rounded-md">
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>

          <input name="academic_year" value={formData.academic_year} onChange={handleChange} className="p-2 border rounded-md" placeholder="Academic Year" />
        </div>
        <button onClick={handleAdd} className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </div>

      {/* Tutor Table */}
      <h3 className="text-xl font-semibold mb-3">Tutors List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-1">#</th>
              <th className="border p-1">Name</th>
              <th className="border p-1">Email</th>
              <th className="border p-1">Phone</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Year</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-center text-gray-600">
            {tutors.map((tutor, index) => (
              <tr key={tutor.id}>
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{tutor.username}</td>
                <td className="border p-1">{tutor.email}</td>
                <td className="border p-1">{tutor.phone_number}</td>
                <td className="border p-1">{tutor.branch_name}</td>
                <td className="border p-1">{tutor?.academic_year}</td>
                <td className="border p-1">
                  <button className="text-blue-600" onClick={() => openModal(tutor)}>
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600" onClick={() => handleDelete(tutor.id)}>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h3 className="text-xl font-semibold">Edit Tutor</h3>
              <button className="text-gray-600" onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="username" value={formData.username} onChange={handleChange} className="p-2 border rounded-md" placeholder="Name" />
              <input name="email" value={formData.email} onChange={handleChange} className="p-2 border rounded-md" placeholder="Email" />
              <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="p-2 border rounded-md" placeholder="Phone Number" />
              <select name="branch" value={formData.branch} onChange={handleChange} className="p-2 border rounded-md">
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>

              <input name="academic_year" value={formData.academic_year} onChange={handleChange} className="p-2 border rounded-md" placeholder="Academic Year" />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handleUpdate} className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTutor;
