import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";

const ManageTutor = () => {
  const [tutors, setTutors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    branch: "",
    academic_year: "",
  });

  const [editFormData, setEditFormData] = useState({
    id: null,
    username: "",
    email: "",
    phone_number: "",
    branch: "",
    academic_year: "",
  });

  // const openModal = (tutor) => {
  //   setEditData(tutor);
  //   setIsModalOpen(true);
  // };

  const openModal = (tutor) => {
    setEditData({
      id: tutor.id,
      username: tutor.username,
      email: tutor.email,
      phone_number: tutor.phone_number,
      branch: tutor.branch.id || tutor.branch, // branch could be ID or object
      academic_year: tutor.academic_year
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };
  

  const fetchTutors = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/add-tutor/");
    setTutors(res.data);
  };

  const fetchBranches = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/branches/");
    setBranches(res.data);
  };

  useEffect(() => {
    fetchTutors();
    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'branch' ? parseInt(value) : value
    }));
  };

  const handleAddTutor = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/add-tutor/", formData);
      fetchTutors();
      setFormData({ username: "", email: "", phone_number: "", branch: "", academic_year: "" });
    } catch (err) {
      console.error("Error adding tutor:", err.response?.data || err);
    }
  };


  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: editData.username,
        email: editData.email,
        phone_number: editData.phone_number,
        branch: editData.branch,
        academic_year: editData.academic_year
      };
      const response = await axios.put(`http://127.0.0.1:8000/api/tutors/${editData.id}/`,payload); 
      setTutors(tutors.map(tutor => 
        tutor.id === editData.id ? response.data : tutor
      ));
      closeModal();
    } catch (error) {
      console.error("Error saving edited tutor:", error.response?.data || error);
    }
  };
  

  const handleDeleteTutor = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Tutor?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tutors/${id}/`);
      fetchTutors();
      alert("Tutor deleted successfully.");
    } catch (err) {
      console.error("Error deleting tutor:", err);
      alert("Failed to delete tutor. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Tutor</h2>

      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Tutor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" value={formData.username} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Username" required />
          <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full p-2 border rounded-md" placeholder="Email Address" required />
          <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
          <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <input name="academic_year" value={formData.academic_year} onChange={handleInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Academic Year" required />
        </div>
        <button onClick={handleAddTutor} className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </div>

      <h3 className="text-xl font-semibold mb-3">Tutors List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Username</th>
              <th className="border p-1">Email Address</th>
              <th className="border p-1">Phone Number</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Year</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {tutors.map((tutor, index) => (
              <tr key={tutor.id} className="text-center">
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
                  <button className="text-red-600" onClick={() => handleDeleteTutor(tutor.id)}>
                    <FaTrash size={18} />
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
              <h3 className="text-xl font-semibold">Edit Tutor</h3>
              <button className="text-gray-600" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={saveEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  name="username" 
                  value={editData?.username || ''} 
                  onChange={handleEditInputChange} 
                  type="text" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="Username" 
                  required 
                />
                <input 
                  name="email" 
                  value={editData?.email || ''} 
                  onChange={handleEditInputChange} 
                  type="email" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="Email Address" 
                  required 
                />
                <input name="phone_number" value={editData.phone_number} onChange={handleEditInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
                <select name="branch" value={editData.branch} onChange={handleEditInputChange} className="w-full p-2 border rounded-md" required>
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                <input name="academic_year" value={editData.academic_year} onChange={handleEditInputChange} type="text" className="w-full p-2 border rounded-md" placeholder="Academic Year" required />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="Submit" className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTutor;
