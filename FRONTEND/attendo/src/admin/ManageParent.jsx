import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const ManageParents = () => {
  const semesters = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);

  const [filters, setFilters] = useState({
      academic_year: "",
      branch_id: "",
      semester: "",
    });

  const [newParent, setNewParent] = useState({
    parent_name: "",
    email: "",
    phone_number: "",
    ward_id: "",
    ward_name: "",
    year: "",
    branch_id: "",
    semester: "",
  });

  const [editParent, setEditParent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all parents
  const fetchParents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/parents/");
      setParents(res.data);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/branches/");
      setBranches(res.data); // assuming res.data is an array of branch objects
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };
  
  // Fetch students once on load
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/students/");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchParents();
    fetchStudents();
    fetchBranches();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  // Auto-fill ward name when ward_id is entered
  const handleWardIdChange = (e, isEdit = false) => {
    const wardId = e.target.value;
    const student = students.find((s) => s.student_id === wardId);

    if (isEdit) {
      setEditParent((prev) => ({
        ...prev,
        ward_id: wardId,
        ward_name: student ? student.name : "",
      }));
    } else {
      setNewParent((prev) => ({
        ...prev,
        ward_id: wardId,
        ward_name: student ? student.name : "",
      }));
    }
  };

  // Create parent
  const handleAddParent = async () => {
    try {
      const payload = {
        username: newParent.parent_name,
        email: newParent.email,
        phone_number: newParent.phone_number,
        ward_id: newParent.ward_id,
        ward_name: newParent.ward_name,
        academic_year: newParent.year,
        semester: newParent.semester,
        branch: newParent.branch_id,
        student_ids: [newParent.ward_id], // from the Student model
      };
  
      const response = await axios.post(
        "http://127.0.0.1:8000/api/parents/",
        payload
      );
  
      console.log("Parent added:", response.data);
      fetchParents();
      setNewParent({
        parent_name: "",
        email: "",
        phone_number: "",
        ward_id: "",
        ward_name: "",
        year: "",
        branch_id: "",
        semester: "",
      });
    } catch (error) {
      console.error("Error adding parent:", error.response?.data || error);
    }
  };
  
  // Edit modal
  const openModal = (parent) => {
    setEditParent({ ...parent });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setEditParent(null);
    setIsModalOpen(false);
  };

  // Update parent
  const handleUpdateParent = async () => {
    try {
      const payload = {
        username: editParent.username,
        email: editParent.email,
        phone_number: editParent.phone_number,
        ward_id: editParent.ward_id,
        ward_name: editParent.ward_name,
        academic_year: editParent.academic_year,
        semester: editParent.semester,
        branch: editParent.branch, // should be ID
        student_ids: [editParent.ward_id],
      };
  
      await axios.put(
        `http://127.0.0.1:8000/api/parents/${editParent.id}/`,
        payload
      );
  
      fetchParents();
      closeModal();
    } catch (err) {
      console.error("Error updating parent:", err.response?.data || err);
    }
  };
  

  // Delete parent
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parent?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/parents/${id}/`);
      fetchParents();
    } catch (err) {
      console.error("Error deleting parent:", err);
    }
  };

const filteredParents = parents.filter((p) => {
  return (
    (!filters.academic_year || p.academic_year === filters.academic_year) &&
    (!filters.branch_id || p.branch?.id === filters.branch_id) && // Fixed branch filtering
    (!filters.semester || p.semester === filters.semester)
  );
});


  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Manage Parents</h2>

      {/* Filter Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Academic year</label>
            <input type="text" name="academic_year" value={filters.academic_year} onChange={handleFilterChange} className="w-full p-2 border rounded-md"/>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Branch</label>
            <select name="branch_id" value={filters.branch_id} onChange={handleFilterChange} className="w-full p-2 border rounded-md" >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Semester</label>
            <select name="semester" value={filters.semester} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create Parent Section */}
      <div className="bg-gray-100 p-3 rounded-md mb-6">
        <h3 className="text-xl font-semibold mb-3">Create Parent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Parent Name"
            value={newParent.parent_name}
            onChange={(e) => setNewParent({ ...newParent, parent_name: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Phone Number"
            value={newParent.phone_number}
            onChange={(e) => setNewParent({ ...newParent, phone_number: e.target.value })}
          />
          <input
            type="email"
            className="w-full p-2 border rounded-md"
            placeholder="Email Address"
            value={newParent.email}
            onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Ward ID"
            value={newParent.ward_id}
            onChange={(e) => handleWardIdChange(e)}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Ward Name"
            value={newParent.ward_name}
            onChange={(e) =>
              setNewParent({ ...newParent, ward_name: e.target.value })
            }
          />

          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Academic Year"
            value={newParent.year}
            onChange={(e) => setNewParent({ ...newParent, year: e.target.value })}
          />
          <select name="branch_id" value={newParent.branch_id} 
            onChange={(e) => setNewParent({ ...newParent, branch_id: e.target.value })}
            className="w-full p-2 border rounded-md" required>
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <select
            className="w-full p-2 border rounded-md"
            value={newParent.semester}
            onChange={(e) => setNewParent({ ...newParent, semester: e.target.value })}
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
        <button
          className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md"
          onClick={handleAddParent}
        >
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
            {filteredParents.map((parent, index) => (
              <tr key={parent.id} className="text-center">
                <td className="border p-1">{index + 1}</td>
                <td className="border p-1">{parent?.username}</td>
                <td className="border p-1">{parent.email}</td>
                <td className="border p-1">{parent.phone_number}</td>
                <td className="border p-1">{parent.ward_id}</td>
                <td className="border p-1">{parent.ward_name}</td>
                <td className="border p-1">{parent.academic_year}</td>
                <td className="border p-1">
                  {branches.find(b => b.id === parent.branch)?.name || parent.branch}
                </td>

                <td className="border p-1">{parent.semester}</td>
                <td className="border p-1">
                  <button className="text-blue-600" onClick={() => openModal(parent)}>
                    <FaEdit size={18} />
                  </button>
                </td>
                <td className="border p-1">
                  <button className="text-red-600" onClick={() => handleDelete(parent.id)}>
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editParent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Parent</h3>
              <button className="text-gray-600" onClick={closeModal}>
                <FaTimes size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={editParent.username}
                onChange={(e) =>
                  setEditParent({ ...editParent, username: e.target.value })
                }className="p-2 border rounded-md" placeholder="Parent Name"/>
              <input type="text" value={editParent.phone_number}
                onChange={(e) =>
                  setEditParent({ ...editParent, phone_number: e.target.value })
                } className="p-2 border rounded-md" placeholder="Phone Number"/>
              <input
                type="email"
                value={editParent.email}
                onChange={(e) =>
                  setEditParent({ ...editParent, email: e.target.value })
                }
                className="p-2 border rounded-md"
                placeholder="Email"
              />
              <input
                type="text"
                value={editParent.ward_id}
                onChange={(e) => handleWardIdChange(e, true)}
                className="p-2 border rounded-md"
                placeholder="Ward ID"
              />
              <input
                type="text"
                value={editParent.ward_name}
                onChange={(e) =>
                  setEditParent({ ...editParent, ward_name: e.target.value })
                }
                className="p-2 border rounded-md"
                placeholder="Ward Name"
              />
              <input
                type="text"
                value={editParent.academic_year}
                onChange={(e) =>
                  setEditParent({ ...editParent, academic_year: e.target.value })
                }
                className="p-2 border rounded-md"
                placeholder="Academic Year"
              />
              <select
                value={editParent.branch}
                onChange={(e) =>
                  setEditParent({ ...editParent, branch: e.target.value })
                }
                className="p-2 border rounded-md"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <select
                value={editParent.semester}
                onChange={(e) =>
                  setEditParent({ ...editParent, semester: e.target.value })
                }
                className="p-2 border rounded-md"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="mt-4 bg-blue-950 text-white px-4 py-1 rounded-md justify-end"
              onClick={handleUpdateParent}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageParents;
