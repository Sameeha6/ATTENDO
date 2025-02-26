import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "9:30-10:30", "10:30-11:30", "11:30-12:30", "1:30-2:30", "2:30-3:30", "3:30-4:30"
];
const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

const ManageTimetable = () => {
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");
  const [timetableData, setTimetableData] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [form, setForm] = useState({ subject: "", faculty: "" });

  // Get timetable of the selected semester
  const timetable = timetableData[selectedSemester] || {};

  const handleEdit = (day, time) => {
    setEditingCell({ day, time });
    setForm(timetable[day]?.[time] || { subject: "", faculty: "" });
  };

  const handleSave = () => {
    setTimetableData({
      ...timetableData,
      [selectedSemester]: {
        ...timetable,
        [editingCell.day]: {
          ...timetable[editingCell.day],
          [editingCell.time]: form,
        },
      },
    });
    setEditingCell(null);
  };

  const handleDelete = () => {
    const updatedTimetable = { ...timetable };
    delete updatedTimetable[editingCell.day][editingCell.time];
    if (Object.keys(updatedTimetable[editingCell.day]).length === 0) {
      delete updatedTimetable[editingCell.day];
    }
    setTimetableData({ ...timetableData, [selectedSemester]: updatedTimetable });
    setEditingCell(null);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Heading with Semester Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Timetable</h2>
        <select
          className="p-2 border rounded-md text-sm"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          {semesters.map((semester, index) => (
            <option key={index} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      {/* Timetable Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border min-w-max mb-24">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Day/Time</th>
              {times.map((time) => (
                <th key={time} className="border p-2">{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="border p-1 text-center font-bold">{day}</td>
                {times.map((time) => (
                  <td
                    key={time}
                    className="border p-2 relative cursor-pointer text-center text-gray-700"
                    onClick={() => handleEdit(day, time)}
                  >
                    {timetable[day]?.[time]?.subject || "-"}
                    {timetable[day]?.[time]?.faculty && (
                      <div className="absolute bg-gray-200 text-xs p-1 rounded-md mt-1 opacity-0 hover:opacity-100">
                        {timetable[day][time].faculty}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Timetable Modal */}
      {editingCell && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-2">Edit Timetable Entry</h3>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <input
              type="text"
              placeholder="Faculty"
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              className="p-2 border rounded-md w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingCell(null)} className="bg-gray-400 text-white px-4 py-1 rounded-md">Cancel</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded-md">Save</button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-1 rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTimetable;
