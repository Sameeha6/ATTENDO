import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageFaculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", phone_number: "", branch: "" });
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/branches/")
      .then((response) => setBranches(response.data))
      .catch((error) => console.error("Error fetching branches", error));

      const hod_id = localStorage.getItem("hod_id");

      axios.get(`http://127.0.0.1:8000/api/faculties-under-hod/${hod_id}/`)
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculties", error));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addFaculty = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.phone_number || !formData.branch) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/addfaculty/", formData);
      setFaculties([...faculties, response.data]);
      setFormData({ username: "", email: "", phone_number: "", branch: "" });
    } catch (error) {
      console.error("Error adding faculty:", error.response?.data || error.message);
      alert("Error adding faculty: " + (error.response?.data?.error || error.message));
    }
  };
  

  const openModal = (faculty) => {
    setEditData(faculty);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/faculty/${editData.id}/`, editData);
      setFaculties(faculties.map(faculty => faculty.id === editData.id ? response.data : faculty));
      closeModal();
    } catch (error) {
      console.error("Error saving edited faculty:", error);
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/faculty/${id}/`);
      setFaculties(faculties.filter(faculty => faculty.id !== id));
    } catch (error) {
      console.error("Error deleting faculty:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Faculties</h2>
      <form className="bg-gray-100 p-3 rounded-md mb-6" onSubmit={addFaculty}>
        <h3 className="text-xl font-semibold mb-3">Add Faculty</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Username" required />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Email Address" required />
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
          <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </form>
      <h3 className="text-xl font-semibold mb-3">Faculty List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1">#</th>
              <th className="border p-1">Username</th>
              <th className="border p-1">Email</th>
              <th className="border p-1">Phone</th>
              <th className="border p-1">Branch</th>
              <th className="border p-1">Edit</th>
              <th className="border p-1">Delete</th>
            </tr>
          </thead>
          <tbody className='text-gray-600'>
            {faculties.map((faculty, index) => (
              <tr key={faculty.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{faculty?.username}</td>
                <td className="border p-1">{faculty?.email}</td>
                <td className="border p-1">{faculty?.phone_number}</td>
                <td className="border p-1">{faculty.branch_name}</td>
                <td className="border p-1">
                  <button className="text-blue-600" onClick={() => openModal(faculty)}>
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600" onClick={() => deleteFaculty(faculty.id)}>
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
              <h3 className="text-xl font-semibold">Edit Faculty</h3>
              <button className="text-black" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={saveEdit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="username" value={editData?.username} onChange={handleEditChange} className="w-full p-2 border rounded-md" placeholder="Username" required />
                <input type="email" name="email" value={editData?.email} onChange={handleEditChange} className="w-full p-2 border rounded-md" placeholder="Email Address" required />
                <input type="text" name="phone_number" value={editData?.phone_number} onChange={handleEditChange} className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
                <select name="branch" value={editData?.branch} onChange={handleEditChange} className="w-full p-2 border rounded-md" required>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaculties;
