import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageBranch = () => {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/branches/');
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleAddBranch = async () => {
    if (!branchName) return;
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/branches/', { name: branchName});
      setBranches([...branches, response.data]);
      setBranchName('');
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setBranchName(branch.name);
    setIsModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedBranch) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/editbranches/${selectedBranch.id}/`, { name: branchName });
      setBranches(branches.map(b => (b.id === selectedBranch.id ? { ...b, name: branchName } : b)));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating branch:', error);
    }
  };
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this branch?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/editbranches/${id}/`);
      setBranches(branches.filter(b => b.id !== id));
      alert("Branch deleted successfully.");
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert("Failed to delete branch. Please try again.");
    }
  };
  
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Branch</h2>
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Branch</h3>
        <label className="block text-gray-700 mb-2">Branch</label>
        <input
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          className="w-full sm:w-2/3 md:w-1/2 p-2 border rounded-md"
          placeholder="Enter branch name"
        />
        <div>
          <button className="mt-3 bg-blue-950 text-white px-4 py-1 rounded-md" onClick={handleAddBranch}>Add</button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3">All Branches</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Branch Name</th>
              <th className="border p-1">Assigned to</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className='text-gray-600'>
            {branches.map((branch, index) => (
              <tr key={branch.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{branch.name}</td>
                <td className="border p-1">{branch.hod ? (branch.hod.user) : (
                  <span className="text-red-600">Not Assigned</span>)}</td>
                <td className="border p-1">
                  <button className="text-blue-600" 
                      onClick={() => handleEdit(branch)}>
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600" onClick={() => handleDelete(branch.id)}>
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <label className="block text-gray-600 mb-2">Branch Name</label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-center">
              <button
                className="bg-blue-950 text-white px-4 py-1 rounded-md"
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBranch;