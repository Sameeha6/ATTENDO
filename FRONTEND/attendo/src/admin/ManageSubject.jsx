import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    academic_year: "",
    semester: "",
    branch: "",
    faculty: "",
    subject_code: "",
    subject_name: "",
  });
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
    fetchFaculties();
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

  const fetchFaculties = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/addfaculty/");
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const addSubject = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/subjects/", formData);
      fetchSubjects();
      setFormData({
        academic_year: "",
        semester: "",
        branch: "",
        faculty: "",
        subject_code: "",
        subject_name: "",
      });
      toast.success('Subject added successfully.');
    } catch (error) {
        console.error("Error adding subject:", error.message);
        toast.error('Error adding subject.'+ JSON.stringify(error.response.data));
    }
  };

  const openEditModal = (subject) => {
    setEditData({
      id: subject.id,
      academic_year: subject.academic_year,
      semester: subject.semester,
      branch: subject.branch,  
      faculty: subject.faculty,
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
    });
    setIsModalOpen(true);
  };
  
  

  const updateSubject = async () => {
    try {
      console.log("Updating with data:", editData);
      await axios.put(`http://127.0.0.1:8000/api/subjects/${editData.id}/`, editData);
      fetchSubjects();
      setIsModalOpen(false);
      toast.success("Subject updated successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Validation Errors:", error.response.data);
        toast.error("Update failed: " + JSON.stringify(error.response.data));
      } else {
        console.error("Error updating subject:", error.message);
        toast.error("Update failed. Please try again."+ JSON.stringify(error.response.data));
      }      
    }
  };

  const deleteSubject = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/subjects/${id}/`);
      fetchSubjects();
      toast.success("Subject deleted successfully.");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject. Please try again."+ JSON.stringify(error.response.data));
    }
  };
  

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Subjects</h2>

      {/* Form */}
      <form className="bg-gray-100 p-3 rounded-md mb-6" onSubmit={addSubject}>
        <h3 className="text-xl font-semibold mb-3">Add Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="academic_year" value={formData.academic_year} onChange={handleInputChange} placeholder="Academic Year" className="w-full p-2 border rounded-md" required />
          <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="Semester" className="w-full p-2 border rounded-md" required />
          <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
          <select name="faculty" value={formData.faculty} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.username}</option>)}
          </select>
          <input type="text" name="subject_code" value={formData.subject_code} onChange={handleInputChange} placeholder="Subject Code" className="w-full p-2 border rounded-md" required />
          <input type="text" name="subject_name" value={formData.subject_name} onChange={handleInputChange} placeholder="Subject Name" className="w-full p-2 border rounded-md" required />
        </div>
        <button type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border p-1">#</th>
              <th className="border p-1">Year</th>
              <th className="border p-1">Semester</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Faculty</th>
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
                <td className="border p-1">{subject.academic_year}</td>
                <td className="border p-1">{subject.semester}</td>
                <td className="border p-1">{subject.branch_name}</td>
                <td className="border p-1">{subject.faculty_name}</td>
                <td className="border p-1">{subject.subject_code}</td>
                <td className="border p-1">{subject.subject_name}</td>
                <td className="border p-1">
                  <button onClick={() => openEditModal(subject)} className="text-blue-600">
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button onClick={() => deleteSubject(subject.id)} className="text-red-600">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Subject</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-black">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="academic_year" value={editData.academic_year} onChange={handleEditChange} className="p-2 border rounded-md" />
              <input type="text" name="semester" value={editData.semester} onChange={handleEditChange} className="p-2 border rounded-md" />
              <select name="branch" value={editData.branch} onChange={handleEditChange} className="p-2 border rounded-md">
                <option value="">Select Branch</option>
                {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
              <select name="faculty" value={editData.faculty} onChange={handleEditChange} className="p-2 border rounded-md">
              <option value="">Select Faculty</option>
                {faculties.map((faculty) => <option key={faculty.id} value={faculty.id}>{faculty.username}</option>)}
              </select>
              <input type="text" name="subject_code" value={editData.subject_code} onChange={handleEditChange} className="p-2 border rounded-md" />
              <input type="text" name="subject_name" value={editData.subject_name} onChange={handleEditChange} className="p-2 border rounded-md" />
            </div>
            <div className="flex justify-end">
            <button onClick={updateSubject} className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageSubject;
