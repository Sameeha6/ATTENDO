import React from "react";
import { MdClose, MdAccessTime } from "react-icons/md";

const Notifications = () => {
  return (
    <div className="bg-gray-50 font-sans min-h-screen p-2 mt-12 ">
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mt-2">NOTIFICATIONS</h1>
      </div>
      <div className="space-y-4">
        {/* Notification Item */}
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`p-4 bg-white border-l-4 rounded-lg shadow-sm flex items-start justify-between ${notification.borderColor}`}
          >
            <button className="mr-3 text-gray-400 hover:text-gray-600">
              <MdClose size={18} />
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">
                  {notification.title}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <MdAccessTime size={16} className="mr-1" />
                  {notification.time}
                </div>
              </div>
              <div className="text-gray-600 mt-1">{notification.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const notifications = [
  {
    title: "REQUEST APPROVED",
    time: "10:00 AM, 5 Mar 2025",
    message:
      "Your request to take the 2nd hour on 5th Mar 2025 has been approved.",
    borderColor: "border-green-400",
  },
  {
    title: "REQUEST REJECTED",
    time: "1:30 PM, 6 Mar 2025",
    message:
      "Your request to take the 4th hour on 6th Mar 2025 has been rejected.",
    borderColor: "border-red-400",
  },
  {
    title: "REQUEST PENDING",
    time: "9:00 AM, 7 Mar 2025",
    message:
      "Your request to take the 1st hour on 7th Mar 2025 is pending approval.",
    borderColor: "border-yellow-400",
  },
];

export default Notifications;
