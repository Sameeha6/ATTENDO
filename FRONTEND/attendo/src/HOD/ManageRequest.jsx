import React from "react";
import { FiClock } from "react-icons/fi"; // React Icon for clock

const requests = [
  {
    id: 1,
    tutor: "John Doe",
    type: "Hour Exchange",
    subject: "Mathematics",
    status: "Pending",
    date: "24 Nov 2016",
    time: "9:30 AM",
  },
  {
    id: 2,
    tutor: "Jane Smith",
    type: "Edit Attendance",
    subject: "Physics",
    status: "Approved",
    date: "24 Nov 2016",
    time: "9:30 AM",
  },
  {
    id: 3,
    tutor: "Mark Lee",
    type: "Hour Exchange",
    subject: "Chemistry",
    status: "Rejected",
    date: "24 Nov 2016",
    time: "9:30 AM",
  },
];

const ManageRequests = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Requests</h1>

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
                <p className="font-semibold text-gray-800">{request.tutor}</p>
                <p className="text-sm text-gray-600">
                  {request.type} - {request.subject}
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

                {/* Action Buttons (Only for Pending Requests - Static UI) */}
                {request.status === "Pending" && (
                  <div className="mt-3 flex space-x-2">
                    <button className="border border-gray-700 py-1 text-green-700 hover:border-green-800 rounded-md flex-1">
                      Approve
                    </button>
                    <button className="border border-gray-700 py-1 text-red-700 rounded-md hover:border-red-800 flex-1">
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
                  {request.date} at {request.time}
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
