import React, { useState }  from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageParents = () => {
  const branches = ["IT", "EC", "EEE", "CS", "PT", "ME"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
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
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Semester</label>
            <select className="w-full p-2 border rounded-md" required>
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create Parent Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Create Parent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" className="w-full p-2 border rounded-md" placeholder="Parent Name" required />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
          <input type="email" className="w-full p-2 border rounded-md" placeholder="Email Address" required />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Ward ID" required />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Ward Name" required />
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
              <th className="border p-1">Ward ID</th>
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
              <td className="border p-1">IEAWEIT031</td>
              <td className="border p-1">ravi</td>
              <td className="border p-1">2022-24</td>
              <td className="border p-1">CS</td>
              <td className="border p-1">S3</td>
              <td className="border p-1">
                <button className="text-blue-600" onClick={openModal}>
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h3 className="text-xl font-semibold">Edit Parent</h3>
              <button className="text-gray-600" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Parent Name" required />
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Email Address" required />
                  <input type="email" className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Ward Name" required />
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Academic Year" required />
                  <select className="w-full p-2 border rounded-md" required>
                    <option value="">Select Branch</option>
                      {branches.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  <select className="w-full p-2 border rounded-md" required>
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageParents;
