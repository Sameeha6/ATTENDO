import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      console.log("Login Response:", response.data); // Debugging API response

      if (response.status === 200) {
        const role = response.data.role || response.data.data?.role; // Handle API response structure

        console.log("User Role:", role);

        if (role === "admin") {
          navigate("/admin/admin"); // Redirect admin to dashboard instantly
        }
        else if(role === "hod"){
          navigate("/hod/hodDash");
        }
        else if(role === "faculty"){
          navigate("/faculty/Dash");
        }
         else {
          setError("Access Denied! Only admins can log in.");
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl flex mt-14">
        
        {/* Left Side - Welcome Message */}
        <div className="w-1/2 flex flex-col justify-center items-start px-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
            alt="Logo"
            className="w-20"
          />
          <h2 className="text-3xl font-bold text-gray-800">Welcome to AttenDo</h2>
          <p className="text-gray-500 text-sm">Please login to continue</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 border-l pl-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
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

            {/* Password Input */}
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

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-950 text-white font-bold py-2 rounded-lg hover:bg-blue-900 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
