import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ branch: "", code: "", subject: "" });
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/subjects/");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/branches/");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSubject = async (e) => {
    e.preventDefault();
    if (!formData.branch || !formData.code || !formData.subject) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/subjects/", formData);
      fetchSubjects();
      setFormData({ branch: "", code: "", subject: "" });
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const openEditModal = (subject) => {
    setEditData(subject);
    setIsModalOpen(true);
  };

//   const updateSubject = async () => {
//     try {
//       await axios.put(`http://127.0.0.1:8000/api/subjects/${editData.id}/`, editData);
//       fetchSubjects();
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error updating subject:", error);
//     }
//   };

//   const deleteSubject = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/subjects/${id}/`);
//       fetchSubjects();
//     } catch (error) {
//       console.error("Error deleting subject:", error);
//     }
//   };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Subjects</h2>
      <form className="bg-gray-100 p-3 rounded-md mb-6" onSubmit={addSubject}>
        <h3 className="text-xl font-semibold mb-3">Add Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Subject Code" required />
          <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Subject Name" required />
        </div>
        <button type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </form>

      <h3 className="text-xl font-semibold mb-3">Subjects List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Code</th>
              <th className="border p-1">Subject</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className='text-gray-600'>
            {subjects.map((subject, index) => (
              <tr key={subject.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{subject.branch.name}</td>
                <td className="border p-1">{subject.code}</td>
                <td className="border p-1">{subject.name}</td>
                <td className="border p-1">
                  <button className="text-blue-600" 
                    // onClick={() => openEditModal(subject)}
                    >
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600" 
                    // onClick={() => deleteSubject(subject.id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">Edit Subject</h3>
              <button className="text-black" onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>
            <input type="text" value={editData?.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full p-2 border rounded-md" placeholder="Subject Name" required />
            <div className="mt-4 flex justify-end">
              <button onClick={updateSubject} className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubject;