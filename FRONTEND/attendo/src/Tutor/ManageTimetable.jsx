import React, { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "9:30-10:30", "10:30-11:30", "11:30-12:30", "1:30-2:30", "2:30-3:30", "3:30-4:30"
];
const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

const ManageTimetable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [form, setForm] = useState({ day: "", time: "", subject: "", faculty: "" });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Heading with Semester Dropdown */}
      <h2 className="text-2xl font-bold mb-4">Manage Timetable</h2>

      {/* Add Timetable Form */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
              className="w-full p-2 border rounded-md"
              value={form.semesters}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
          >
            <option value="">Select Day</option>
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          >
            <option value="">Select Time</option>
            {times.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Faculty"
            value={form.faculty}
            onChange={(e) => setForm({ ...form, faculty: e.target.value })}
          />
        </div>
        <button className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </div>

      {/* Timetable List Table */}
      <h3 className="text-xl font-semibold mb-3">Timetable List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Semester</th>
              <th className="border p-1">Day</th>
              <th className="border p-1">Time</th>
              <th className="border p-1">Subject</th>
              <th className="border p-1">Faculty</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="text-center">
              <td className="border p-1">1</td>
              <td className="border p-1">S1</td>
              <td className="border p-1">Monday</td>
              <td className="border p-1">9:30-10:30</td>
              <td className="border p-1">Math</td>
              <td className="border p-1">Mr. A</td>
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
            {/* Additional rows for other timetable entries */}
          </tbody>
        </table>
      </div>

      {/* Edit Timetable Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h3 className="text-xl font-semibold">Edit Timetable</h3>
              <button className="text-gray-600" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="w-full p-2 border rounded-md"
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select
                className="w-full p-2 border rounded-md"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              >
                <option value="">Select Time</option>
                {times.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Faculty"
                value={form.faculty}
                onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              />
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

export default ManageTimetable;
