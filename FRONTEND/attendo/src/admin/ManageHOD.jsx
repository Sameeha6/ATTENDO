import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageHOD = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Manage HOD</h2>

      {/* Create HOD Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add HOD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">First Name</label>
            <input type="text" className="w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Last Name</label>
            <input type="text" className="w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Email Address</label>
            <input type="email" className="w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Phone Number</label>
            <input type="text" className="w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Branch</label>
            <select className="w-full p-2 border rounded-md" required>
              <option value="">Select Branch</option>
              <option value="IT">IT</option>
              <option value="EC">EC</option>
              <option value="EEE">EEE</option>
              <option value="CS">CS</option>
              <option value="PT">PT</option>
              <option value="ME">ME</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
          Add
        </button>
      </div>

      {/* All HODs Table */}
      <h3 className="text-xl font-semibold mb-3">HODs List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">First Name</th>
              <th className="border p-1">Last Name</th>
              <th className="border p-1">Email Address</th>
              <th className="border p-1">Phone Number</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody  className="text-gray-600">
            <tr className="text-center">
              <td className="border p-1">1</td>
              <td className="border p-1">Sam</td>
              <td className="border p-1">Sebastin</td>
              <td className="border p-1">samseb@example.com</td>
              <td className="border p-1">1234567890</td>
              <td className="border p-1">CS</td>
              <td className="border p-1">
                <button className="text-blue-600">
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
    </div>
  );
};

export default ManageHOD;
