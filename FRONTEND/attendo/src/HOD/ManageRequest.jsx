import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiClock } from "react-icons/fi";
import { toast,ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const hod_id = localStorage.getItem("hod_id");
        const [hourRes, editRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/request-hour-change/"),
          axios.get(`http://127.0.0.1:8000/api/notifications/${hod_id}/`)
        ]);

        const editRequests = editRes.data.notifications.map((n) => ({
          id: n.id,
          requester: { username: n.related_request.requested_by },
          timetable_entry: {
            subject: `Edit: ${n.related_request.student_name}`,
            day: n.related_request.date,
            time: `Hour ${n.related_request.hour}`,
          },
          status: n.related_request.status,
          isEditRequest: true,
          new_status: n.related_request.new_status,
        }));

        setRequests([...hourRes.data, ...editRequests]);
      } catch (error) {
        setError("Error fetching requests.");
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestAction = async (requestId, action, isEditRequest = false) => {
    try {
      if (isEditRequest) {
        await axios.post(
          `http://127.0.0.1:8000/api/approve-attendance-edit/${requestId}/`,
          { [action === "Approved" ? "approve" : "reject"]: true }
        );
      } else {
        await axios.put(
          `http://127.0.0.1:8000/api/request-hour-change/${requestId}/`,
          { status: action }
        );
      }
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: action } : r
        )
      );
    } catch (error) {
      setError("Error updating request status.");
      toast.error("Error updating request status.")
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen sm:p-2">
      <div className="w-full bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Manage Requests</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="divide-y">
          {requests.map((request) => (
            <div key={request.id} className="py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">

              <div
                className={`w-2 h-2 rounded-full ${
                  request.status === "Pending"
                    ? "bg-yellow-500"
                    : request.status === "Approved"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>

              {/* Request Details */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{request.requester.username}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {request.type} - {request.timetable_entry.subject}
                </p>

                {/* Status Badge */}
                <span
                  className={`mt-2 inline-block px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-md text-white ${
                    request.status === "Pending"
                      ? "bg-yellow-500"
                      : request.status === "Approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {request.status}
                </span>

                {/* Action Buttons */}
                {request.status === "Pending" && (
                  <div className="mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      className="border border-gray-700 py-1 text-green-700 hover:border-green-800 rounded-md flex-1 text-sm"
                      onClick={() => handleRequestAction(request.id, "Approved", request.isEditRequest)}
                    >
                      Approve
                    </button>
                    <button
                      className="border border-gray-700 py-1 text-red-700 hover:border-red-800 rounded-md flex-1 text-sm"
                      onClick={() => handleRequestAction(request.id, "Rejected", request.isEditRequest)}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status !== "Pending" && (
                  <p className="text-gray-500 mt-3 text-xs sm:text-sm">Action Taken</p>
                )}
              </div>

              <div className="text-xs text-gray-500 flex items-center gap-1 sm:mt-0 mt-2">
                <FiClock size={14} />
                <span className="break-words">
                  {request.timetable_entry.day} - {request.timetable_entry.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ManageRequests;
