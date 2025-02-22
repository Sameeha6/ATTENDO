import React from "react";

const requests = [
  {
    id: 1,
    tutor: "John Doe",
    type: "Hour Exchange",
    subject: "Mathematics",
    status: "Pending",
  },
  {
    id: 2,
    tutor: "Jane Smith",
    type: "Edit Attendance",
    subject: "Physics",
    status: "Approved",
  },
  {
    id: 3,
    tutor: "Mark Lee",
    type: "Hour Exchange",
    subject: "Chemistry",
    status: "Rejected",
  },
];

const ManageRequests = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 
            transition hover:shadow-lg
            border-blue-500"
          >
            <h2 className="text-lg font-semibold">{request.tutor}</h2>
            <p className="text-gray-600">{request.type}</p>
            <p className="font-semibold mt-2">{request.subject}</p>

            {/* Status Badge */}
            <div className="mt-3">
              {request.status === "Pending" && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">
                  Pending
                </span>
              )}
              {request.status === "Approved" && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                  Approved
                </span>
              )}
              {request.status === "Rejected" && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                  Rejected
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {request.status === "Pending" && (
              <div className="mt-4 flex space-x-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex-1">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex-1">
                  Reject
                </button>
              </div>
            )}

            {request.status !== "Pending" && (
              <p className="text-gray-500 mt-4 text-sm">Action Taken</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRequests;
