import React, { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageFaculties = () => {
  const branches = ["IT", "EC", "EEE", "CS", "PT", "ME"];
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];
  const subjects = ["Mathematics", "COD", "WIT"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Manage Faculties</h2>

      {/* Create Faculty Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Add Faculty</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Name" required />
          <input type="email" className="w-full p-2 border rounded-md" placeholder="Email Address" required />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
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
          <select className="w-full p-2 border rounded-md" required>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">
          Add
        </button>
      </div>

      {/* Faculty List Table */}
      <h3 className="text-xl font-semibold mb-3">Faculty List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Name</th>
              <th className="border p-1">Email</th>
              <th className="border p-1">Phone No</th>
              <th className="border p-1">Year</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Semester</th>
              <th className="border p-1">Subject</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="text-center">
              <td className="border p-1">1</td>
              <td className="border p-1">mathew</td>
              <td className="border p-1">ajaymathew@gmail.com</td>
              <td className="border p-1">1234567890</td>
              <td className="border p-1">2022-24</td>
              <td className="border p-1">IT</td>
              <td className="border p-1">S2</td>
              <td className="border p-1">Mathematics</td>
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

      {/* Edit Faculty Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">Edit Faculty</h3>
              <button className="text-black" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Name" required />
              <input type="email" className="w-full p-2 border rounded-md" placeholder="Email Address" required />
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
              <input type="text" className="w-full p-2 border rounded-md" placeholder="Academic Year" required />
              <select className="w-full p-2 border rounded-md" required>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              <select className="w-full p-2 border rounded-md" required>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
              <select className="w-full p-2 border rounded-md" required>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              {/* <button className="bg-red-600 text-white px-4 py-1 rounded-md mr-2" onClick={closeModal}>Cancel</button> */}
              <button className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaculties;
