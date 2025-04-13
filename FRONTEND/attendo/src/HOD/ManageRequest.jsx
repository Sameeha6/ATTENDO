import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios for making API requests
import { FiClock } from "react-icons/fi"; // React Icon for clock

const ManageRequests = () => {
  // State to hold the list of requests
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/request-hour-change/");
        setRequests(response.data);
      } catch (error) {
        setError("Error fetching requests.");
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  // Function to handle approving or rejecting a request
  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/request-hour-change/${requestId}/`, {
        status: action,
      });

      // Update the requests in the UI after the status change
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: action } : request
        )
      );
    } catch (error) {
      setError("Error updating request status.");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Requests</h1>

        {/* Display error message if there's an error */}
        {error && <p className="text-red-500">{error}</p>}

        <div className="divide-y">
          {requests.map((request) => (
            <div key={request.id} className="py-4 flex items-start gap-3">
              {/* Status Indicator */}
              <div
                className={`w-2 h-2 mt-2 rounded-full ${
                  request.status === "Pending"
                    ? "bg-yellow-500"
                    : request.status === "Approved"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>

              {/* Request Details */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{request.requester.username}</p>
                <p className="text-sm text-gray-600">
                  {request.type} - {request.timetable_entry.subject}
                </p>

                {/* Status Badge */}
                <span
                  className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-md text-white ${
                    request.status === "Pending"
                      ? "bg-yellow-500"
                      : request.status === "Approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {request.status}
                </span>

                {/* Action Buttons (Only for Pending Requests) */}
                {request.status === "Pending" && (
                  <div className="mt-3 flex space-x-2">
                    <button
                      className="border border-gray-700 py-1 text-green-700 hover:border-green-800 rounded-md flex-1"
                      onClick={() => handleRequestAction(request.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="border border-gray-700 py-1 text-red-700 rounded-md hover:border-red-800 flex-1"
                      onClick={() => handleRequestAction(request.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status !== "Pending" && (
                  <p className="text-gray-500 mt-3 text-sm">Action Taken</p>
                )}
              </div>

              {/* Date & Time */}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FiClock size={14} />
                <span>
                {request.timetable_entry.day} - {request.timetable_entry.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
