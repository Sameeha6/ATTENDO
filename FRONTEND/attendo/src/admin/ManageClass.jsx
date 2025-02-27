import React, { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageSemester = () => {
  const branches = ["IT", "EC", "EEE", "CS", "PT", "ME"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const handleEdit = (branch, semester) => {
    setSelectedBranch(branch);
    setSelectedSemester(semester);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    console.log(`Updated Semester: ${selectedBranch} - ${selectedSemester}`);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Manage Semester</h2>

      {/* Add Semester Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Semester</h3>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-gray-600">Branch</label>
            <select className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-gray-600">Semester</label>
            <select className="w-full p-2 border rounded-md" required>
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
          </div>
        </div>

        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
          Add
        </button>
      </div>

      {/* Semester List */}
      <h3 className="text-xl font-semibold mb-3">Semester List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Semester</th>
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
                <button className="text-blue-600" onClick={() => handleEdit("CS", "S3")}>
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
                <button className="text-blue-600" onClick={() => handleEdit("IT", "S2")}>
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

      {/* Modal for Editing Semester */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/3 relative">
            {/* Close button (X) at the top right */}
            <button
              className="absolute top-2 right-2 text-gray-800 hover:text-gray-900"
              onClick={handleCloseModal}
            >
              <FaTimes size={20} />
            </button>

            {/* <h3 className="text-xl font-semibold mb-3">Edit Semester</h3> */}

            <label className="block text-gray-600 mb-2">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
            </select>

            <label className="block text-gray-600 mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            >
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
            </select>

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

export default ManageSemester;
