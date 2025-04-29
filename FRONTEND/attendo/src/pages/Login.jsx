import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });
      console.log("Login Response:", response.data); 
      if (response.status === 200) {
        const role = response.data.role || response.data.data?.role;
        localStorage.setItem('role',response.data.data.role);
        localStorage.setItem("hod_id",response.data.data.hod_id);
        localStorage.setItem("tutor_id",response.data.data.tutor_id);
        localStorage.setItem("faculty_id",response.data.data.faculty_id);
        localStorage.setItem("parent_id",response.data.data.parent_id);
        localStorage.setItem("student_id",response.data.data.student_id);
        
        console.log("User Role:", role);

        if (role === "admin") {
          navigate("/admin/admin"); 
        }
        else if(role === "hod"){
          navigate("/hod/hodDash");
        }
        else if(role === "faculty"){
          navigate("/faculty/Dash");
        }
        else if(role === "tutor"){
          navigate("/tutor/tutorDash");
        }
        else if(role === "parent"){
          navigate("/parent/Dash");
        }
        else if(role === "student"){
          navigate("/student/student/studentDash");
        }
        else {
          setError("Access Denied!");
        }
      }
      toast.success('Login successfull.');
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError("Invalid credentials. Please try again.");
      toast.error('Error login.'+ JSON.stringify(error.response.data));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 mt-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md sm:max-w-xl md:max-w-3xl flex flex-col md:flex-row">
        
        {/* Welcome Message */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center mb-8 md:mb-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
            alt="Logo"
            className="w-16 md:w-20"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
            Welcome to AttenDo
          </h2>
          <p className="text-gray-500 text-sm mt-2">Please login to continue</p>
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs sm:max-w-none">
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm md:text-base">{error}</p>}
            <div className="mt-5">
              <button type="submit"
                className="w-full  bg-blue-950 text-white font-bold py-2 rounded-lg hover:bg-blue-900 transition duration-200">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;