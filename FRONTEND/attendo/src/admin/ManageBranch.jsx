import React, { useState } from 'react';
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageBranch = () => {
  const branches = ["IT", "EC", "EEE", "CS", "PT", "ME"];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchName, setBranchName] = useState('');

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setBranchName(branch); // Pre-fill input field with the branch to edit
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSaveChanges = () => {
    console.log(`Branch name updated to: ${branchName}`);
    setIsModalOpen(false); // Close the modal after saving
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Manage Branch</h2>

      {/* Create Branch Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Branch</h3>
        <label className="block text-gray-700 mb-2">Branch</label>
        <select className="w-full sm:w-2/3 md:w-1/2 p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        <div>
          <button className="mt-3 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
        </div>
      </div>

      {/* All Branches Table */}
      <h3 className="text-xl font-semibold mb-3">All Branches</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Branch Name</th>
              <th className="border p-1">Status</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className='text-gray-600'>
            <tr className="text-center">
              <td className="border p-1">1</td>
              <td className="border p-1">IT</td>
              <td className="border p-1 text-green-600 font-semibold">Assigned</td>
              <td className="border p-1">
                <button className="text-blue-600" onClick={() => handleEdit('IT')}>
                  <FaEdit size={18} />
                </button>
              </td>
              <td className="border p-1">
                <button className="text-red-600">
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3 relative">
            {/* Close button (X) at the top right */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={handleCloseModal}
            >
              <FaTimes size={20} />
            </button>

            {/* <h3 className="text-xl font-semibold mb-3">Edit Branch</h3> */}
            <label className="block text-gray-600 mb-2">Branch Name</label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-center">
              <button
                className="bg-blue-950 text-white px-4 py-1 rounded-md "
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
