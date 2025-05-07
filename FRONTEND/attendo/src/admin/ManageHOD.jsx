import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const ManageHOD = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", phone: "", branch: "" });
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/branches/");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addHOD = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Invalid email format. Only @gmail.com emails are allowed.");
          return;
        }
    if (!formData.username || !formData.email || !formData.phone || !formData.branch) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/hod/", formData);
      setFormData({ username: "", email: "", phone: "", branch: "" });
      fetchBranches();
      toast.success('HOD added successfully.');
    } catch (error) {
      console.error("Error adding HOD:", error);
      toast.error('Error adding HOD.'+ JSON.stringify(error.response.data));
    }
  };

  const openEditModal = (items) => {
    if (!items.hod) {
      console.error("HOD data is missing!");
      return;
    }
    setEditData({
      id: items.hod.id,
      username: items.hod.username,
      email: items.hod.email,
      phone: items.hod.phone,
      branch: items.id,
    });
    setIsModalOpen(true);

  };

  const updateHOD = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Invalid email format. Only @gmail.com emails are allowed.");
          return;
        }
    if (!editData || !editData.id) {
      toast.error("HOD ID is missing, cannot update!");
      return;
    }
    try {
      await axios.put(`http://127.0.0.1:8000/api/gethod/${editData.id}/`, editData);
      setIsModalOpen(false);
      fetchBranches();
      toast.success('HOD updated successfully.');
    } catch (error) {
      console.error("Error updating HOD:", error);
      toast.error('Error updating HOD.'+ JSON.stringify(error.response.data));
    }
  };

  const deleteHOD = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this HOD?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/gethod/${id}/`);
      fetchBranches();
      toast.success("HOD deleted successfully.");
    } catch (error) {
      console.error("Error deleting HOD:", error);
      toast.error("Failed to delete HOD. Please try again."+ JSON.stringify(error.response.data));
    }
  };
  console.log(editData)

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage HOD</h2>
      
      <form className="bg-gray-100 p-3 rounded-md mb-6" onSubmit={addHOD}>
        <h3 className="text-xl font-semibold mb-3">Add HOD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Username" required />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Email Address" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
          <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </form>

      <h3 className="text-xl font-semibold mb-3">HODs List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Username</th>
              <th className="border p-1">Email</th>
              <th className="border p-1">Phone</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {branches.map((items, index) => (
              <tr key={items.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">
                  {items.hod?.username ? (
                    items.hod.username
                  ) : (
                    <span className="text-red-600 ">Not Assigned</span>
                  )}
                </td>
                <td className="border p-1">
                  {items.hod?.email ? (
                    items.hod.email
                  ) : (
                    <span className="text-red-600 ">N/A</span>
                  )}
                </td>
                <td className="border p-1">
                  {items.hod?.phone ? (
                    items.hod.phone
                  ) : (
                    <span className="text-red-600">N/A</span>
                  )}
                </td>
                <td className="border p-1">{items.name}</td>
                <td className="border p-1">
                  <button className="text-blue-600" onClick={() => openEditModal(items)}>
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600" onClick={() => deleteHOD(items.hod?.id)}>
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <form onSubmit={updateHOD}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Edit HOD</h3>
                <button className="text-black" onClick={() => setIsModalOpen(false)}>
                  <FaTimes size={20} />
                </button>
              </div>
              <input type="text" name="username" value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
              <input type="email" name="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
              <input type="text" name="phone" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full p-2 border rounded-md mb-2" required />
              <div className="flex justify-end">
                <button type="submit" className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default ManageHOD;
