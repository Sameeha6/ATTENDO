import React from "react";
import { MdClose, MdAccessTime } from "react-icons/md";

const NotificationPage = () => {
  return (
    <div className="bg-gray-50 font-sans min-h-screen p-6 pt-1 ">
      {/* Header Section */}
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mt-2">NOTIFICATIONS</h1>
        <p className="text-sm text-gray-500">
          Updates regarding your ward's attendance
        </p>
      </div>
      {/* Notification List */}
      <div className="space-y-4">
        {/* Notification  Item */}
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
    title: "ABSENT",
    time: "9:30 AM, 24 Feb 2025",
    message:
      "Your ward was absent for the 1st hour on 24th Feb 2025. Please ensure regular attendance.",
    borderColor: "border-red-400",
  },
  {
    title: "ABSENT",
    time: "11:00 AM, 24 Feb 2025",
    message:
      "Your ward was absent for the 3rd hour on 24th Feb 2025. Kindly check with them regarding the absence.",
    borderColor: "border-red-400",
  },
  {
    title: "CONSECUTIVE ABSENCE",
    time: "8:00 AM, 26 Feb 2025",
    message:
      "Your child has been absent for 3 consecutive days (24th-26th Feb 2025). Please take necessary action.",
    borderColor: "border-red-700",
  },
];

export default NotificationPage;
