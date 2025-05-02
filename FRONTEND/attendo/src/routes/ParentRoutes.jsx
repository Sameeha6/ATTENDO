// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Footer from "../components/Footer";
// import ParentNav from "../parent/ParentNav";
// import AlertPage from "../parent/Alert";
// import NotificationPage from "../parent/Notification";
// import ParentDashboard from "../parent/ParentDashboard";
// import Report from "../parent/ViewReport";
// function ParentRoutes() {
//   return (
//     <div className="h-screen flex flex-col">
//       {/* Navbar */}
//       <ParentNav />

//       {/* Main Content */}
//       <div className="flex-grow p-6 bg-gray-100 pt-20">
//         {/* Added pt-20 to prevent content from being hidden under fixed navbar */}
//         <Routes>
//           <Route path="/Dash" element={<ParentDashboard />} />
//           <Route path="/alerts" element={<AlertPage />} />
//           <Route path="/notifications" element={<NotificationPage />} />
//           <Route path="/reports/:ward" element={<Report />} />
//         </Routes>
//       </div>

//       {/* Footer */}
//       {/* <Footer className="w-full bg-blue-900 text-white text-center" /> */}
//     </div>
//   );
// }

// export default ParentRoutes;

import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import ParentNav from "../parent/ParentNav";
import AlertPage from "../parent/Alert";
import NotificationPage from "../parent/Notification";
import ParentDashboard from "../parent/ParentDashboard";
import Hourly from "../parent/Hour";
import ParentSubject from "../parent/Subject";
import ParentSem from "../parent/Sem";
import HistoryNav from "../parent/HistoryNav"; // Assuming this is your HistoryNav

function ParentRoutes() {
  const location = useLocation();

  const hideNavbarRoutes = ["/parent/Dash",
    "/parent/alerts","/parent/notifications"]; // Define your paths here

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <ParentNav />
      {!hideNavbarRoutes.includes(location.pathname) && (
        <div className="mt-20">
          <HistoryNav />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-100 pt-20">
        <Routes>
          <Route path="/Dash" element={<ParentDashboard />} />
          <Route path="/alerts" element={<AlertPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/subject" element={<ParentSubject />} />
          <Route path="/hour" element={<Hourly />} />
          <Route path="/sem" element={<ParentSem />} />
        </Routes>
      </div>

      {/* Footer */}
      {/* <Footer className="w-full bg-blue-900 text-white text-center" /> */}
    </div>
  );
}

export default ParentRoutes;
