import React from "react";
import StudentNav from "../Student/StudentNav";
import { Route, Routes, useLocation } from "react-router-dom";
import StudentDashboard from "../Student/StudentDashboard";
import AlertPage from "../Student/Alert";
import Subject from "../Student/Subject";
import Hour from "../Student/Hour";
import Sem from "../Student/Sem";
import HistoryNav from "../Student/HistoryNav";

function StudentRoutes() {
  const location = useLocation();

  const hideNavbarRoutes = ["/student/student/studentDash",
    "/student/student/student/alerts","/student/student/student/reports"];
  return (
    <div>
      {/* Page content */}
      <StudentNav/>
      {!hideNavbarRoutes.includes(location.pathname) && <div className="mt-20">
      <HistoryNav/>
      </div>
      }
      <div className="flex-grow p-4 mt-4">  

        <Routes>
          <Route path="/student/studentDash" element={<StudentDashboard />} />
          <Route path="/student/student/alerts" element={<AlertPage />} />
          <Route
            path="/student/student/attendance-history/subject"
            element={<Subject />}
          />
          <Route
            path="/student/student/attendance-history/hour"
            element={<Hour />}
          />
          <Route
            path="/student/student/attendance-history/sem"
            element={<Sem />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default StudentRoutes;