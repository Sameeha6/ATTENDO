import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageHOD = () => {
  const [hods, setHods] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "", phone: "", branch: "" });
  const [editData, setEditData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect(() => {
  //   // fetchHODs();
  //   fetchBranches();
  // }, []);

  // const fetchHODs = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/api/hod/");
  //     setHods(response.data);
  //     console.log(hods)
  //   } catch (error) {
  //     console.error("Error fetching HODs", error);
  //   }
  // };
  useEffect(()=>{
    axios.get("http://localhost:8000/api/branches/").then((response)=>{
      console.log(response)
      setBranches(response.data)
    }).catch((error)=>{
      console.log(error)
    })

  },[])

  // const fetchBranches = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/api/branches/");
  //     setBranches(response.data);
  //     console.log(branches)
  //   } catch (error) {
  //     console.error("Error fetching branches", error);
  //   }
  // };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData)


  const addHOD = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.phone || !formData.branch) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // const payload = {
      //   username: formData.username,
      //   email: formData.email,
      //   phone: formData.phone,
      //   branch: parseInt(formData.branch), // Convert branch to an integer
      // };
     const response= await axios.post("http://localhost:8000/api/hod/", formData);
      console.log(response.data)
      // fetchHODs();
      setFormData({ username: "", email: "", phone: "", branch: "" });
    } catch (error) {
      console.error("Error adding HOD");
    }
  };

  // const openEditModal = (hod) => {
  //   setEditData({ ...hod, branch: hod.branch.id });
  //   setIsModalOpen(true);
  // };

  // const updateHOD = async () => {
  //   try {
  //     await axios.put(`http://localhost:8000/api/hod/${editData.id}/`, editData);
  //     fetchHODs();
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error updating HOD", error);
  //   }
  // };

  // const deleteHOD = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:8000/api/hod/${id}/`);
  //     fetchHODs();
  //   } catch (error) {
  //     console.error("Error deleting HOD", error);
  //   }
  // };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage HOD</h2>
      <form className="bg-gray-100 p-3 rounded-md mb-6" onSubmit={addHOD}>
        <h3 className="text-xl font-semibold mb-3">Add HOD</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Username" required />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Email Address" required />
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Phone Number" required />
          <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
        </div>
        <button  type="submit" className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md">Add</button>
      </form>

      <h3 className="text-xl font-semibold mb-3">HODs List</h3>
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
          <tbody>
            {/* {hods.map((hod, index) => (
              <tr key={hod.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{hod.username}</td>
                <td className="border p-1">{hod.email}</td>
                <td className="border p-1">{hod.phone}</td>
                <td className="border p-1">{hod.branch.name}</td>
                <td className="border p-1">
                  <button className="text-blue-600" 
                  // onClick={() => openEditModal(hod)}
                  >
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600"
                  //  onClick={() => deleteHOD(hod.id)}
                   >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 top-12">
          <div className="bg-white p-6 shadow-md w-11/12 max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">Edit HOD</h3>
              <button className="text-black" onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>
            <input type="text" value={editData?.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} className="w-full p-2 border rounded-md" placeholder="Username" required />
            <div className="mt-4 flex justify-end">
              <button onClick={updateHOD} className="bg-blue-950 text-white px-4 py-1 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHOD;
