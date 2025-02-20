import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageSemester = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Manage Semester</h2>

      {/* Create Class Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Semester</h3>

        {/* Select Branch & Class (Same Row) */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-gray-600">Branch</label>
            <select className="w-full p-2 border rounded-md "required>
              <option value="">Select Branch</option>
              <option value="IT">IT</option>
              <option value="EC">EC</option>
              <option value="EEE">EEE</option>
              <option value="CS">CS</option>
              <option value="PT">PT</option>
              <option value="ME">ME</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-gray-600">Semester</label>
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

        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
          Add
        </button>
      </div>

      {/* All Classes Table */}
      <h3 className="text-xl font-semibold mb-3">Semester List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 ">
              <th className="border p-1">#</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Class</th>
              <th className="border p-1">Status</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="text-center">
              <td className="border p-1">1</td>
              <td className="border p-1">CS</td>
              <td className="border p-1">S3</td>
              <td className="border p-1 text-green-600 font-semibold">Assigned</td>
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
            <tr className="text-center">
              <td className="border p-1">2</td>
              <td className="border p-1">IT</td>
              <td className="border p-1">S2</td>
              <td className="border p-1 text-red-600 font-semibold">Unassigned</td>
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

export default ManageSemester;
