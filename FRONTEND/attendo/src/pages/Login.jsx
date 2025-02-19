import React from "react";

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl flex mt-14">
        
        {/* Left Section: Logo & Text */}
        <div className="w-1/2 flex flex-col justify-center items-start px-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
            alt="Logo"
            className="w-20"
          />
          <h2 className="text-3xl font-bold text-gray-800">Welcome to AttenDo</h2>
          <p className="text-gray-500 text-sm">Please login to continue</p>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-1/2 border-l pl-6">
          <form className="space-y-4">
            
            {/* ID */}
            <div>
              <label className="block text-gray-700 font-medium">ID</label>
              <input
                type="text"
                placeholder="Enter your ID"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

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
