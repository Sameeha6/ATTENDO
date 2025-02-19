import React from 'react'
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageBranch = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
    {/* Title */}
    <h2 className="text-2xl font-bold mb-4">Manage Branch</h2>

    {/* Create Branch Section */}
    <div className="bg-gray-100 p-4 rounded-md mb-6">
      <h3 className="text-xl font-semibold mb-3">Create Branch</h3>
      <label className="block mb-2">Branch Name *</label>
      <select className="w-full sm:w-2/3 md:w-1/2 p-2 border rounded-md "required>
        <option value="">Select Branch</option>
        <option value="IT">IT</option>
        <option value="EC">EC</option>
        <option value="EEE">EEE</option>
        <option value="CS">CS</option>
        <option value="PT">PT</option>
        <option value="ME">ME</option>
      </select>
      <div>
        <button className="mt-3 bg-blue-950 text-white px-4 py-2 rounded-md">Add</button>
      </div>
    </div>

    {/* All Branches Table */}
    <h3 className="text-xl font-semibold mb-3">All Branches</h3>
    <div className="overflow-x-auto">

      <table className="w-full border-collapse border ">
        <thead>
          <tr className="bg-blue-950 text-white">
            <th className="border p-2">#</th>
            <th className="border p-2">Branch Name</th>
            <th className="border p-2">Edit</th>
            <th className="border p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border p-2">1</td>
            <td className="border p-2">IT</td>
            <td className="border p-2">
              <button className="text-blue-600">
                <FaEdit size={18} />
              </button>
            </td>
            <td className="border p-2">
              <button className="text-red-600">
                <FaTrash size={18} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  );
};
export default ManageBranch;
