import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageParents = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Manage Parents</h2>

      {/* Filter Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Academic year</label>
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
          <div>
            <label className="block mb-1 text-gray-600">Semester</label>
            <select className="w-full p-2 border rounded-md" required>
              <option value="">Select Semester</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
              <option value="S5">S5</option>
              <option value="S6">S6</option>
              <option value="S7">S7</option>
              <option value="S8">S8</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Parent Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Create Parent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Parent Name</label>
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
            <label className="block mb-1 text-gray-600">Ward Name</label>
            <input type="text" className="w-full p-2 border rounded-md" required />
          </div>
        </div>
        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
          Add
        </button>
      </div>

      {/* Parent List Table */}
      <h3 className="text-xl font-semibold mb-3">Parent List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Parent Name</th>
              <th className="border p-1">Email</th>
              <th className="border p-1">Phone No</th>
              <th className="border p-1">Ward Name</th>
              <th className="border p-1">Year</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Semester</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="text-center">
              <td className="border p-1">1</td>
              <td className="border p-1">shankar</td>
              <td className="border p-1">johndoe@gmail.com</td>
              <td className="border p-1">1234567890</td>
              <td className="border p-1">ravi</td>
              <td className="border p-1">2022-24</td>
              <td className="border p-1">CS</td>
              <td className="border p-1">S3</td>
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

export default ManageParents;
